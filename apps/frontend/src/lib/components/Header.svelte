<script lang="ts">
	export let title: string;
	export let subtitle: string = '';
	export let rightMeta: string = 'Mode statique';
</script>

<header class="rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-sm md:p-4">
	<div class="flex items-start justify-between gap-3">
		<div>
			<p class="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#2563EB]">OpsTrack Terrain</p>
			<h1 class="mt-1 text-lg font-bold text-slate-900 md:text-xl">{title}</h1>
			{#if subtitle}
				<p class="mt-1 text-xs text-slate-600 md:text-sm">{subtitle}</p>
			{/if}
		</div>
		<div class="hidden rounded-xl border border-[#2563EB]/20 bg-[#2563EB]/10 px-3 py-2 text-xs font-medium text-[#1d4ed8] sm:block">
			{rightMeta}
		</div>
	</div>
</header>
