<script lang="ts">
	import CheckoutButton from './CheckoutButton.svelte';
	export let title = 'Plan';
	export let price = 0;
	export let type: 'basic' | 'pro' | 'premium';

	const priceIds = {
		basic: 'price_1Po3mNJOCm0kYvDpRtMwgpvX',
		pro: 'price_1Po3mNJOCm0kYvDpRtMwgpvX',
		premium: 'price_1Po3mNJOCm0kYvDpRtMwgpvX'
	};
</script>

<div class="card bg-base-100 mt-10 mb-10 w-full shadow-2xl dark:shadow-none">
	<div class="card-body text-left">
		<p class="text-accent font-bold">{title}</p>
		<div class="inline-block">
			<p class="text-4xl font-bold inline">${price}</p>
			<p class="ml-2 text-gray-400 inline">per month</p>
		</div>
		<p class="pt-4">Best option for power users</p>
		<div class="divider" />
		<p>1 user</p>
		<p>1 project</p>
		<p>1 GB storage</p>
		<p>Community support</p>
		<CheckoutButton priceId={priceIds[type]} />
	</div>
</div>
