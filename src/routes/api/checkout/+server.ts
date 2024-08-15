import type { RequestHandler } from './$types';
import { stripe } from '$lib/server/stripe';
import 'dotenv/config';

export const POST: RequestHandler = async ({ request }) => {
    try {
        const { priceId, email, userId } = await request.json();
        const session = await stripe.checkout.sessions.create({
            metadata: { userId: userId },
            customer_email: email,
            payment_method_types: ['card'],
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            mode: 'subscription',
            success_url: 'http://localhost:5173/app',
            cancel_url: 'http://localhost:5173/login/subscribe',
    });
        return new Response(JSON.stringify({ id: session.id }), {
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error: any) {
        console.error(error);
        return new Response(JSON.stringify({ message: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
};