<script lang="ts">
	export let label: string;
	export let value: number;
	export let tone: 'blue' | 'green' | 'orange' | 'red' = 'blue';
	export let meta: string = '';

	const classes = {
		blue: 'border-[#2563EB]/30 bg-white text-[#1d4ed8]',
		green: 'border-[#22C55E]/30 bg-white text-[#15803d]',
		orange: 'border-[#F59E0B]/30 bg-white text-[#b45309]',
		red: 'border-[#EF4444]/30 bg-white text-[#b91c1c]'
	};
</script>

	<article class={`rounded-2xl border p-3 shadow-sm ${classes[tone]}`}>
		<p class="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">{label}</p>
		<p class="mt-1 text-2xl font-bold">{value}</p>
		{#if meta}
			<p class="mt-1 text-[11px] font-medium text-slate-500">{meta}</p>
		{/if}
</article>
