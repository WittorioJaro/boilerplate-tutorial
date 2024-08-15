import { json, type RequestHandler } from '@sveltejs/kit';
import { stripe } from '$lib/server/stripe';


export const POST: RequestHandler = async ({ request }) => {
    const { customerId } = await request.json();

    try {
        const portalSession = await stripe.billingPortal.sessions.create({
            customer: customerId,
            return_url: 'http://localhost:5173/app',
        });
        return json({ id: portalSession.id, url: portalSession.url });
    } catch (error: any) {
        console.error(error);
        return json({ message: error.message }, { status: 500 });
    }
};