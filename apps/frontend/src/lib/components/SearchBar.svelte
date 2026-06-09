<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let value: string = '';
	export let placeholder: string = 'Rechercher une intervention...';

	const dispatch = createEventDispatcher<{ change: { value: string } }>();

	function onInput() {
		dispatch('change', { value });
	}
</script>

<label class="relative block">
	<span class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[11px] font-bold text-slate-400">Q</span>
	<input
		type="search"
		bind:value
		on:input={onInput}
		placeholder={placeholder}
		class="w-full rounded-xl border border-slate-300 bg-white py-2 pl-8 pr-3 text-sm text-slate-800 outline-none transition focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/15"
	/>
</label>
