<script lang="ts">
	import { goto } from '$app/navigation';
	import type { PageProps } from './$types';
	import { saveData, seedFakeInterventionData } from '$lib/db';

	let { data }: PageProps = $props();
	let syncMessage = $state('');
	let seedMessage = $state('');

	async function syncZoho() {
		const interventions = Array.isArray(data) ? data : data.data;
		await saveData(
			{
				interventions,
				syncedAt: new Date().toISOString()
			},
			'zoho-sync'
		);
		syncMessage = 'Données enregistrées localement. Envoi Zoho optionnel pour plus tard.';
	}

	async function seedFakeData() {
		await seedFakeInterventionData();
		seedMessage = 'Fausse base de données créée dans IndexedDB.';
		location.reload();
	}

	async function startIntervention(interventionId: string) {
		await goto(`/intervention/${encodeURIComponent(interventionId)}/1`);
	}
</script>

<div class="mx-auto min-h-screen w-full max-w-3xl px-4 py-4 sm:px-6 lg:px-8">
	<section class="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm space-y-3">
		<button
			type="button"
			onclick={syncZoho}
			class="w-full rounded-2xl bg-[#2563EB] px-4 py-5 text-base font-bold text-white shadow-sm transition hover:bg-[#1d4ed8] active:scale-[0.99]"
		>
			Enregistrer localement
		</button>
		<button
			type="button"
			onclick={seedFakeData}
			class="w-full rounded-2xl bg-[#f59e0b] px-4 py-5 text-base font-bold text-white shadow-sm transition hover:bg-[#d97706] active:scale-[0.99]"
		>
			Générer fausses interventions
		</button>
		{#if syncMessage}
			<p class="mt-2 text-center text-xs font-medium text-[#15803d]">{syncMessage}</p>
		{/if}
		{#if seedMessage}
			<p class="mt-2 text-center text-xs font-medium text-[#b45309]">{seedMessage}</p>
		{/if}
	</section>

	<section class="mt-4 space-y-3">
		{#each Array.isArray(data) ? data : data.data as intervention (intervention.id)}
			<article class="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
				<div class="flex items-start justify-between gap-3">
					<div>
						<p class="text-[11px] font-semibold tracking-[0.1em] text-slate-500 uppercase">
							{intervention.id}
						</p>
						<h2 class="mt-1 text-sm font-bold text-slate-900">{intervention.client}</h2>
					</div>
					<span class="rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] font-semibold text-slate-700">
						{intervention.label}
					</span>
				</div>

				<div class="mt-3 grid grid-cols-2 gap-2">
					<button
						type="button"
						onclick={() => startIntervention(intervention.id)}
						class="rounded-xl bg-[#22C55E] px-3 py-2 text-xs font-semibold text-white transition hover:bg-[#16a34a]"
					>
						Lancer
					</button>
					<button
						type="button"
						class="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-center text-xs font-semibold text-slate-700 transition hover:border-[#2563EB] hover:text-[#2563EB]"
					>
						Consulter les informations
					</button>
				</div>
			</article>
		{/each}
	</section>
</div>
