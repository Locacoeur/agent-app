<script lang="ts">
	import type { PageProps } from './$types';
	import { extractText } from 'unpdf';
	import { extractAedG3Data } from '$lib/extraction';
	import { rvd } from '$lib/rvd.svelte';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';

	const { params }: PageProps = $props();

	let files = $state<FileList | null>(null);

	const extract = async () => {
		if (files) {
			const pdf = await files[0].arrayBuffer();
			const { totalPages, text } = await extractText(pdf, { mergePages: true });

			console.log(`Total pages: ${totalPages}`);
			console.log(text);

			const res = await extractAedG3Data(text);

			rvd.id = params.id;
			rvd.aed = res;

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
		<input
			id="upload"
			bind:files
			type="file"
			class="hidden"
			onchange={async () => await extract()}
		/>

		<label
			for="upload"
			class="block w-full cursor-pointer rounded-2xl bg-[#2563EB] px-4 py-5 text-center text-base font-bold text-white shadow-sm transition hover:bg-[#1d4ed8] active:scale-[0.99]"
		>
			Upload
		</label>
	</section>
</div>
