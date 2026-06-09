<script lang="ts">
	import Header from '$lib/components/Header.svelte';

	let email = 'technicien@opstrack.fr';
	let password = '';
	let isConnected = false;

	function submitLogin(event: Event) {
		event.preventDefault();
		isConnected = true;
	}
</script>

<div class="mx-auto flex min-h-screen w-full max-w-md flex-col px-4 py-4 sm:px-6">
	<Header title="Connexion" subtitle="Acces technicien terrain" rightMeta="Auth mock locale" />

	<section class="mt-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
		<div class="rounded-xl border border-[#2563EB]/20 bg-[#2563EB]/10 px-3 py-2">
			<p class="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#1d4ed8]">Terminal equipe nord</p>
			<p class="mt-0.5 text-xs text-slate-600">Session locale sans backend, prete pour integration API.</p>
		</div>

		<form class="mt-3 space-y-2.5" on:submit={submitLogin}>
			<div>
				<label for="email" class="mb-1 block text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-600">Email</label>
				<input
					id="email"
					type="email"
					bind:value={email}
					required
					class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/15"
				/>
			</div>

			<div>
				<label for="password" class="mb-1 block text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-600">Mot de passe</label>
				<input
					id="password"
					type="password"
					bind:value={password}
					required
					class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/15"
				/>
			</div>

			<button type="submit" class="w-full rounded-xl bg-[#2563EB] px-3 py-2 text-sm font-semibold text-white transition hover:bg-[#1d4ed8]">
				Ouvrir la session
			</button>
		</form>

		{#if isConnected}
			<div class="mt-3 rounded-xl border border-[#22C55E]/30 bg-[#22C55E]/10 p-3">
				<p class="text-sm font-medium text-[#15803d]">Connexion mock reussie.</p>
				<p class="mt-0.5 text-[11px] text-[#15803d]">Profil: Technicien maintenance senior</p>
				<a href="/" class="mt-2 inline-block text-xs font-semibold uppercase tracking-[0.08em] text-[#2563EB] hover:underline">Acceder au dashboard</a>
			</div>
		{/if}
	</section>
</div>
