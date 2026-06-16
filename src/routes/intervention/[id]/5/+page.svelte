<script lang="ts">
	import type { PageProps } from './$types';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { onMount } from 'svelte';
	import { loadData, saveData } from '$lib/db';

	const { params }: PageProps = $props();
	let summary: any = null;
	let feedback = '';

	const loadSummary = async () => {
		summary = await loadData(params.id);
	};

	const storeSummary = async () => {
		if (!summary) return;
		await saveData({ ...summary, savedAt: new Date().toISOString() }, `intervention-summary-${params.id}`);
		feedback = 'Résumé enregistré en local dans IndexedDB.';
	};

	const prepareZoho = async () => {
		if (!summary) return;
		await saveData({ id: params.id, summary, readyAt: new Date().toISOString() }, `zoho-ready-${params.id}`);
		feedback = 'Résumé prêt pour envoi à Zoho.';
	};

	const backToList = async () => {
		await goto(resolve('/'));
	};

	onMount(() => {
		loadSummary();
	});
</script>

<div class="mx-auto min-h-screen w-full max-w-3xl px-4 py-6 sm:px-6 lg:px-8">
	<section class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
		<h1 class="text-heading text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
			Résumé de l’intervention
		</h1>
		<p class="mt-3 text-sm text-slate-600">
			Toutes les informations récupérées sont affichées ci-dessous. Vous pouvez tester le parcours localement pour l’instant, l’envoi vers Zoho est optionnel.
		</p>

		{#if !summary}
			<p class="mt-6 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
				Aucune donnée trouvée pour cette intervention.
			</p>
		{:else}
			<div class="mt-6 space-y-4 text-sm text-slate-700">
				<div class="rounded-2xl border border-slate-200 bg-slate-50 p-4">
					<p class="font-semibold">ID intervention</p>
					<p>{summary.id}</p>
				</div>

				<div class="rounded-2xl border border-slate-200 bg-slate-50 p-4">
					<p class="font-semibold">Modèle AED</p>
					<p>{summary.deviceModel ?? 'N/C'}</p>
				</div>

				<div class="rounded-2xl border border-slate-200 bg-slate-50 p-4">
					<p class="font-semibold">Rapport AED</p>
					<pre class="mt-2 max-h-60 overflow-auto text-xs leading-5">{JSON.stringify(summary.aed_report, null, 2)}</pre>
				</div>

				<div class="grid gap-3 md:grid-cols-2">
					<div class="rounded-2xl border border-slate-200 bg-slate-50 p-4">
						<p class="font-semibold">Electrodes</p>
						<p>{summary.electrodes ?? 'Non scannées'}</p>
					</div>
					<div class="rounded-2xl border border-slate-200 bg-slate-50 p-4">
						<p class="font-semibold">Batterie</p>
						<p>{summary.battery ?? 'Non scannée'}</p>
					</div>
				</div>

				<div class="rounded-2xl border border-slate-200 bg-slate-50 p-4">
					<p class="font-semibold">Défibrillateur</p>
					<p>Série: {summary.defibrillator?.serial ?? 'N/C'}</p>
					<p>Modèle: {summary.defibrillator?.model ?? 'N/C'}</p>
				</div>
			</div>
		{/if}

		<div class="mt-8 grid gap-3 sm:grid-cols-2">
			<button
				type="button"
				onclick={storeSummary}
				class="rounded-2xl bg-[#22C55E] px-4 py-4 text-base font-bold text-white shadow-sm transition hover:bg-[#16a34a] active:scale-[0.99]"
			>
				Enregistrer localement
			</button>
			<button
				type="button"
				onclick={prepareZoho}
				class="rounded-2xl bg-[#2563EB] px-4 py-4 text-base font-bold text-white shadow-sm transition hover:bg-[#1d4ed8] active:scale-[0.99]"
			>
				Préparer pour Zoho (optionnel)
			</button>
		</div>

		{#if feedback}
			<p class="mt-4 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
				{feedback}
			</p>
		{/if}

		<div class="mt-6">
			<button
				type="button"
				onclick={backToList}
				class="rounded-2xl border border-slate-200 bg-white px-4 py-4 text-base font-bold text-slate-900 shadow-sm transition hover:border-slate-400 active:scale-[0.99]"
			>
				Retour à l’accueil
			</button>
		</div>
	</section>
</div>
