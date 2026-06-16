<script lang="ts">
	import type { PageProps } from './$types';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { saveData } from '$lib/db';

	const { params }: PageProps = $props();

	let files = $state<FileList | null>(null);
	let deviceModel = $state<'g5' | 'g3'>('g5');
	let batteryLow = $state(false);
	let feedback = $state('');

	const extract = async () => {
		if (!files || files.length === 0) {
			feedback = 'Veuillez sélectionner un fichier PDF de rapport AED.';
			return;
		}

		try {
			// Temporary mock - PDF extraction would go here
			const percentage = 75;
			batteryLow = percentage > 0 && percentage <= 15;
			feedback = batteryLow
				? 'Batterie critique détectée (<15%). Changement de batterie recommandé.'
				: 'Rapport AED chargé. Continuez avec les étapes de vérification.';

			const mockAedReport = {
				'Numéro de série': 'D12345678',
				'Pourcentage de la batterie': percentage,
				'Électrodes': 'Standard',
				'Modèle': deviceModel === 'g5' ? 'G5' : 'G3'
			};

			await saveData({ id: params.id, aed_report: mockAedReport, deviceModel, batteryLow }, params.id);

			await goto(resolve('/intervention/[id]/2', { id: params.id }));
		} catch (error) {
			console.error(error);
			feedback = 'Impossible de traiter le rapport AED. Vérifiez le PDF et réessayez.';
		}
	};
</script>

<div class="mx-auto min-h-screen w-full max-w-3xl px-4 sm:px-6 lg:px-8">
	<section class="min-h-screen content-center rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
		<h1 class="text-heading text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
			Intervention AED
		</h1>
		<p class="mt-4 text-sm text-slate-600">
			Choisissez le modèle de l’appareil, puis téléchargez le rapport AED. Ce rapport permettra de valider la batterie et de préparer la suite du parcours.
		</p>

		<div class="mt-6 grid gap-3 sm:grid-cols-2">
			<label class="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-center shadow-sm">
				<input
					type="radio"
					name="model"
					value="g5"
					checked={deviceModel === 'g5'}
					onchange={() => (deviceModel = 'g5')}
					class="mr-2"
				/>
				G5
				<p class="mt-2 text-xs text-slate-500">Numéro de série commence par D et ne contient que des chiffres.</p>
			</label>

			<label class="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-center shadow-sm">
				<input
					type="radio"
					name="model"
					value="g3"
					checked={deviceModel === 'g3'}
					onchange={() => (deviceModel = 'g3')}
					class="mr-2"
				/>
				G3
				<p class="mt-2 text-xs text-slate-500">Numéro de série plus court, sans préfixe D.</p>
			</label>
		</div>

		<div class="mt-6">
			<input
				id="upload"
				bind:files
				type="file"
				accept="application/pdf"
				class="hidden"
				onchange={async () => await extract()}
			/>

			<label
				for="upload"
				class="mt-4 block w-full cursor-pointer rounded-2xl bg-[#2563EB] px-4 py-5 text-center text-base font-bold text-white shadow-sm transition hover:bg-[#1d4ed8] active:scale-[0.99]"
			>
				Télécharger le rapport AED
			</label>
		</div>

		{#if feedback}
			<p class="mt-4 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
				{feedback}
			</p>
		{/if}
	</section>
</div>
