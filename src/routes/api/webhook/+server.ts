import { json, type RequestHandler } from '@sveltejs/kit';
import { stripe } from '$lib/server/stripe';
import { adminDB } from '$lib/server/admin';
import Stripe from 'stripe';
import 'dotenv/config';

export const POST: RequestHandler = async ({ request }) => {
    try {
        const rawBody = await request.text();
        const signature = request.headers.get('stripe-signature');

        let event;
        try {
            event = stripe.webhooks.constructEvent(
                rawBody,
                signature!,
                process.env.STRIPE_WEBHOOK_SECRET!
            );
        } catch (error: any) {
            console.error("Webhook signature verification failed.", error);
            return new Response(JSON.stringify({ message: 'Webhook signature verification failed.' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }
        if (event.type === 'checkout.session.completed') {
            const session: Stripe.Checkout.Session = event.data.object;
            console.log(session.metadata);
            const userId = session.metadata?.userId;
            
            await adminDB.collection('users').doc(userId!).set(
                {
                    stripeCustomerId: session.customer,
                    subscriptionId: session.subscription,
                    planActive: true,
                    planExpires: null,
                },
                { merge: true }
            );
        }
        if (event.type === 'customer.subscription.updated') {
            const subscription: Stripe.Subscription = event.data.object;
            const userId = subscription.metadata?.userId;

            await adminDB.collection('users').doc(userId).update({
                planActive: subscription.status === 'active',
                planExpires: subscription.cancel_at,
            });
        }
        if (event.type === 'customer.subscription.deleted') {
            const subscription: Stripe.Subscription = event.data.object;
            const userId = subscription.metadata?.userId;

            await adminDB.collection('users').doc(userId).update({
                planActive: false,
                subscriptionId: null,
            });
        }
        return json({ message: 'success' });

    } catch (error: any) {
        console.error(error);
        return new Response(JSON.stringify({ message: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
};