<script lang="ts">
	import { user, userData } from '$lib/firebase';
	import toast from 'svelte-french-toast';

	const handleClick = async () => {
		try {
			if (!$user) {
				toast.error('You must be logged in to manage billing');
				return;
			}

			const response = await fetch('/api/portal', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					customerId: $userData!.stripeCustomerId
				})
			});

			if (!response.ok) {
				toast.error('Failed to create portal session');
			}

			const { url } = await response.json();
			window.location.href = url;
		} catch (error) {
			console.error(error);
			toast.error('Failed to create portal session');
		}
	};
</script>

<button on:click={handleClick} class="btn btn-primary">Manage billing</button>
