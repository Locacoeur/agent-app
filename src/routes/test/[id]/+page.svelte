<script lang="ts">
	import type { PageProps } from './$types';
	import { extractAedG3Data } from '$lib/extraction';
	import { extractText } from 'unpdf';

	const { params }: PageProps = $props();

	let files = $state<FileList | null>(null);

	const extract = async () => {
		if (files) {
			const pdf = await files[0].arrayBuffer();
			const { text } = await extractText(pdf, { mergePages: true });

			//console.log(`Total pages: ${totalPages}`);
			//console.log(text);

			const res = await extractAedG3Data(text);
			console.log(res);
		}
	};
</script>

<p>{params.id}</p>
<input bind:files type="file" onchange={async () => await extract()} />
