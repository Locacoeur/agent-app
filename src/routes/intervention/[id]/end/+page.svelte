<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { deleteData, loadData } from '$lib/db';
	import type { PageProps } from './$types';

	const { params }: PageProps = $props();

	//TODO: update zoho-infos pour changer le label en "terminé"

	let summary: any = $derived(await loadData(params.id));
	let feedback = $state('');

	const prepareZoho = async () => {
		//...
	};

	const backToList = async () => {
		await deleteData(params.id);
		await goto(resolve('/'));
	};
</script>

<div class="mx-auto min-h-screen w-full max-w-3xl px-4 py-6 sm:px-6 lg:px-8">
	<section class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
		<h1 class="text-heading text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
			Résumé de l'intervention
		</h1>

		{#if !summary}
			<p
				class="mt-6 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700"
			>
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
					<p>{summary.device_model ?? 'N/C'}</p>
				</div>

				<div class="rounded-2xl border border-slate-200 bg-slate-50 p-4">
					<p class="font-semibold">Rapport AED</p>
					<pre class="mt-2 max-h-60 overflow-auto text-xs leading-5">{JSON.stringify(
							summary.aed_report,
							null,
							2
						)}</pre>
				</div>

				<div class="grid gap-3 md:grid-cols-2">
					<div class="rounded-2xl border border-slate-200 bg-slate-50 p-4">
						<p class="font-semibold">Electrodes</p>
						<p>{JSON.stringify(summary.electrodes, undefined, ' ') ?? 'Non scannées'}</p>
					</div>
					<div
						class="rounded-2xl border border-slate-200 bg-slate-50 p-4 {summary.electrodes2
							? 'row-span-2'
							: ''}"
					>
						<p class="font-semibold">Batterie</p>
						<p>{JSON.stringify(summary.battery, undefined, ' ') ?? 'Non scannée'}</p>
					</div>
					{#if summary.electrodes2}
						<div class="rounded-2xl border border-slate-200 bg-slate-50 p-4">
							<p class="font-semibold">Electrodes de remplacement</p>
							<p>{JSON.stringify(summary.electrodes2, undefined, ' ') ?? 'Non scannées'}</p>
						</div>
					{/if}
				</div>

				<div class="rounded-2xl border border-slate-200 bg-slate-50 p-4">
					<p class="font-semibold">Défibrillateur</p>
					<p>Série: {summary.aed?.serial_number ?? 'N/C'}</p>
				</div>

				<div class="rounded-2xl border border-slate-200 bg-slate-50 p-4">
					<p class="font-semibold">AED report</p>
					<iframe
						class="h-100"
						src={URL.createObjectURL(summary.aed_report_file)}
						width="100%"
						height="100%"
						style="border: none"
						title="AED report"
					></iframe>
				</div>

				<div class="rounded-2xl border border-slate-200 bg-slate-50 p-4">
					<p class="font-semibold">Feedback</p>
					<textarea bind:value={feedback} class="w-full"></textarea>
				</div>
			</div>
		{/if}

		<div class="mt-8 grid gap-3 sm:grid-cols-2">
			<button
				type="button"
				onclick={prepareZoho}
				class="rounded-2xl bg-[#2563EB] px-4 py-4 text-base font-bold text-white shadow-sm transition hover:bg-[#1d4ed8] active:scale-[0.99]"
				disabled={!(
					summary.aed_report_file &&
					summary.electrodes &&
					summary.battery &&
					summary.aed
				)}
			>
				Envoyer à Zoho
			</button>

			<button
				type="button"
				onclick={backToList}
				class="rounded-2xl border border-slate-200 bg-white px-4 py-4 text-base font-bold text-slate-900 shadow-sm transition hover:border-slate-400 active:scale-[0.99]"
			>
				Annuler l'intervention
			</button>
		</div>
	</section>
</div>
