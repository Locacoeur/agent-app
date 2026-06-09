<script lang="ts">
	import StatusBadge from '$lib/components/StatusBadge.svelte';

	export let id: string;
	export let client: string;
	export let equipment: string;
	export let address: string;
	export let status: string;
	export let plannedDate: string;
</script>

<article class="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm transition hover:border-[#2563EB]/30 hover:shadow-md">
	<div class="flex items-start justify-between gap-2">
		<div>
			<p class="text-sm font-semibold text-slate-900">{client}</p>
			<p class="text-[11px] font-medium text-slate-500">{id}</p>
		</div>
		<StatusBadge {status} />
	</div>

	<div class="mt-2 rounded-xl bg-slate-50 p-2">
		<p class="text-xs font-semibold text-slate-700">{equipment}</p>
		<p class="mt-0.5 text-[11px] text-slate-500">{address}</p>
	</div>
	<p class="mt-2 text-[11px] font-medium uppercase tracking-[0.08em] text-slate-500">Prevu le {plannedDate}</p>

	<a
		href={`/interventions/${id}`}
		class="mt-2 inline-flex w-full items-center justify-center rounded-xl bg-[#2563EB] px-3 py-2 text-sm font-semibold text-white transition hover:bg-[#1d4ed8]"
	>
		Consulter
	</a>
</article>
