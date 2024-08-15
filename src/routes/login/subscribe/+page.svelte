<script lang="ts">
	import CardPlan from '$lib/components/CardPlan.svelte';
	import { user } from '$lib/firebase';
</script>

<div class="w-9/12 bg-base-200 text-center mx-auto mt-14 lg:mt-0">
	<h1 class="text-2xl mb-6 font-bold text-accent">Welcome, {$user?.displayName}</h1>
	<h1 class="text-xl font-bold">Choose your plan:</h1>
	<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-12 mt-2">
		<CardPlan title="Basic" price={10} type="basic" />
		<CardPlan title="Pro" price={20} type="pro" />
		<CardPlan title="Premium" price={30} type="premium" />
	</div>
</div>
