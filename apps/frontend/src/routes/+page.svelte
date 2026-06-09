<script lang="ts">
	import { authClient } from '$lib/auth-client';
	import { fromStore } from 'svelte/store';

	const sessionAtom = authClient.useSession();
	const session = fromStore(sessionAtom);
</script>

<div>
	{#if session.current.data}
		<div>
			<p>
				{session.current.data.user.name}
			</p>
			<button
				onclick={async () => {
					await authClient.signOut();
				}}
			>
				Sign Out
			</button>
		</div>
	{:else}
		<button
			onclick={async () => {
				await authClient.signIn.social({ provider: 'Zoho' });
			}}
		>
			Continue with GitHub
		</button>
	{/if}
</div>
