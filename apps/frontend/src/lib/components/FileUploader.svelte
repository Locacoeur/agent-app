<script lang="ts">
	export let label: string;
	export let accept: string = '*/*';
	export let helper: string = '';

	let files: File[] = [];
	let dragging = false;

	function appendFiles(list: FileList | null) {
		if (!list) return;
		files = [...files, ...Array.from(list)];
	}

	function onInput(event: Event) {
		const target = event.currentTarget as HTMLInputElement;
		appendFiles(target.files);
	}

	function onDrop(event: DragEvent) {
		event.preventDefault();
		dragging = false;
		appendFiles(event.dataTransfer?.files || null);
	}

	function removeFile(index: number) {
		files = files.filter((_, i) => i !== index);
	}

	function formatSize(bytes: number): string {
		if (bytes < 1024) return `${bytes} o`;
		if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} Ko`;
		return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`;
	}
</script>

<section class="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
	<h3 class="text-sm font-semibold text-slate-900">{label}</h3>
	{#if helper}
		<p class="mt-0.5 text-[11px] text-slate-500">{helper}</p>
	{/if}

	<label
		on:dragover|preventDefault={() => (dragging = true)}
		on:dragleave={() => (dragging = false)}
		on:drop={onDrop}
		class={`mt-2 block cursor-pointer rounded-xl border-2 border-dashed p-3 text-center transition ${
			dragging ? 'border-[#2563EB] bg-[#2563EB]/10' : 'border-slate-300 bg-slate-50'
		}`}
	>
		<input type="file" class="hidden" multiple {accept} on:change={onInput} />
		<p class="text-sm font-medium text-slate-700">Glisser/deposer</p>
		<p class="mt-0.5 text-[11px] text-slate-500">ou cliquer pour selectionner</p>
	</label>

	{#if files.length > 0}
		<ul class="mt-3 space-y-2">
			{#each files as file, index}
				<li class="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-2 text-xs text-slate-700">
					<div>
						<p class="font-medium text-slate-800">{file.name}</p>
						<p class="text-[11px]">{file.type || 'Type inconnu'} - {formatSize(file.size)}</p>
					</div>
					<button
						type="button"
						on:click={() => removeFile(index)}
						class="rounded-lg bg-[#EF4444]/10 px-2 py-1 text-[11px] font-semibold text-[#b91c1c] transition hover:bg-[#EF4444]/20"
					>
						Retirer
					</button>
				</li>
			{/each}
		</ul>
	{/if}
</section>
