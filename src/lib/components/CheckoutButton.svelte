<script lang="ts">
	import { onMount } from 'svelte';
	import { loadStripe } from '@stripe/stripe-js';
	import toast from 'svelte-french-toast';
	import { user } from '$lib/firebase';

	export let priceId: string;

	let stripe: any;

	onMount(async () => {
		const stripePromise = await loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
		stripe = await stripePromise;

		if (!stripe) {
			toast.error('Stripe failed to load');
		}
	});

	const handleCheckout = async () => {
		if (!$user) {
			toast.error('You must be logged in to subscribe');
			return;
		}

		try {
			const response = await fetch('/api/checkout', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					priceId: priceId,
					userId: $user.uid,
					email: $user.email
				})
			});
			if (!response.ok) {
				throw new Error('Failed to create checkout session');
			}
			const session = await response.json();
			await stripe.redirectToCheckout({ sessionId: session.id });
		} catch (error) {
			console.error(error);
			toast.error('Failed to create checkout session');
		}
	};
</script>

<button class="btn btn-accent mt-4" on:click={handleCheckout}>Subscribe</button>
