<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let open: boolean = false;
	export let title: string = 'Confirmation';

	const dispatch = createEventDispatcher<{ close: void }>();

	function closeModal() {
		dispatch('close');
	}
</script>

{#if open}
	<div class="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/50 p-4 sm:items-center" role="dialog" aria-modal="true">
		<div class="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-4 shadow-xl">
			<div class="flex items-start justify-between gap-3">
				<h3 class="text-base font-semibold text-slate-900">{title}</h3>
				<button type="button" on:click={closeModal} class="rounded-lg bg-slate-100 px-2 py-1 text-[11px] font-semibold text-slate-700 hover:bg-slate-200">Fermer</button>
			</div>
			<div class="mt-2 text-sm text-slate-700">
				<slot />
			</div>
		</div>
	</div>
{/if}
