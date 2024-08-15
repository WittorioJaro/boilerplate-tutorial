<script lang="ts">
	import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
	import { auth, db } from '$lib/firebase';
	import { doc, getDoc, writeBatch } from 'firebase/firestore';
	import { goto } from '$app/navigation';

	const handleGoogleLogin = async () => {
		const provider = new GoogleAuthProvider();
		const result = await signInWithPopup(auth, provider);
		const signerInUser = result.user;

		//check if user exists in firestore
		const userDocRef = doc(db, 'users', signerInUser.uid);
		const userDocSnap = await getDoc(userDocRef);

		if (!userDocSnap.exists()) {
			const batch = writeBatch(db);
			batch.set(userDocRef, {
				displayName: signerInUser.displayName || 'Anonymous',
				planActive: false,
				planExpires: null,
				stripeCustomerId: null,
				subscriptionId: null
			});
			await batch.commit();
		}
		goto('/login/subscribe');
	};
</script>

<div class="card bg-base-100 w-11/12 sm:10/12 md:w-6/12 lg:w-4/12 shadow-xl dark:shadow-none">
	<div class="card-body items-center">
		<h1>Login</h1>
		<button on:click={handleGoogleLogin} class="btn btn-primary">Login with Google</button>
	</div>
</div>
