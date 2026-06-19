<script lang="ts">
	import type { PageProps } from './$types';
	import { extractText } from 'unpdf';
	import { extractAedG3Data, extractAedG5Data } from '$lib/extraction';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { saveData } from '$lib/db';

	const { params }: PageProps = $props();

	let files = $state<FileList | null>(null);
	let deviceModel = $state<'g5' | 'g3'>('g5');

	// Extrait les informations de l'aed report upload, le parse et l'enregistre dans idb
	const extract = async () => {
		if (files) {
			const pdf = files[0];
			const pdfBuffer = await pdf.arrayBuffer();
			const { text } = await extractText(pdfBuffer, { mergePages: true });

			let res: Record<string, string | number | [string, string][]>;
			if (deviceModel === 'g3') {
				res = await extractAedG3Data(text);
			} else {
				res = await extractAedG5Data(text);
			}

			await saveData(
				{ id: params.id, aed_report: res, aed_report_file: pdf, device_model: deviceModel },
				params.id
			);

			await goto(resolve('/intervention/[id]/2', { id: params.id }));
		}
	};
</script>

<div class="mx-auto min-h-screen w-full max-w-3xl px-4 sm:px-6 lg:px-8">
	<section
		class="min-h-screen content-center rounded-2xl border border-slate-200 bg-white p-3 shadow-sm"
	>
		<h1
			class="text-heading mb-22 justify-self-center text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl"
		>
			Upload AED Report
		</h1>
		<p class="mt-4 text-sm text-slate-600">
			Choisissez le modèle de l'appareil, puis téléchargez le rapport AED. Ce rapport permettra de
			valider la batterie et de préparer la suite du parcours.
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
	</section>
</div>
