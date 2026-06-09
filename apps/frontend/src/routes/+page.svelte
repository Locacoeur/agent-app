<script lang="ts">
	const interventions = [
		{ id: 'INT-2026-021', client: 'Arcelor Lille', label: 'A faire', progress: 22, tone: 'blue' },
		{ id: 'INT-2026-017', client: 'Pharma Nord', label: 'En cours', progress: 58, tone: 'orange' },
		{ id: 'INT-2026-019', client: 'AgriTech Hub', label: 'A traiter', progress: 81, tone: 'red' },
		{ id: 'INT-2026-004', client: 'DataCooling DC2', label: 'Terminee', progress: 100, tone: 'green' }
	];

	let synced = false;

	function syncZoho() {
		synced = true;
	}

	function barClass(tone: string): string {
		if (tone === 'green') return 'bg-[#22C55E]';
		if (tone === 'orange') return 'bg-[#F59E0B]';
		if (tone === 'red') return 'bg-[#EF4444]';
		return 'bg-[#2563EB]';
	}
</script>

<div class="mx-auto min-h-screen w-full max-w-3xl px-4 py-4 sm:px-6 lg:px-8">
	<section class="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
		<button
			type="button"
			on:click={syncZoho}
			class="w-full rounded-2xl bg-[#2563EB] px-4 py-5 text-base font-bold text-white shadow-sm transition hover:bg-[#1d4ed8] active:scale-[0.99]"
		>
			Synchroniser avec Zoho
		</button>
		{#if synced}
			<p class="mt-2 text-center text-xs font-medium text-[#15803d]">Synchronisation lancee.</p>
		{/if}
	</section>

	<section class="mt-4 space-y-3">
		{#each interventions as intervention}
			<article class="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
				<div class="flex items-start justify-between gap-3">
					<div>
						<p class="text-[11px] font-semibold uppercase tracking-[0.1em] text-slate-500">{intervention.id}</p>
						<h2 class="mt-1 text-sm font-bold text-slate-900">{intervention.client}</h2>
					</div>
					<span class="rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] font-semibold text-slate-700">
						{intervention.label}
					</span>
				</div>

				<div class="mt-3 h-2 w-full rounded-full bg-slate-100">
					<div class={`h-2 rounded-full ${barClass(intervention.tone)}`} style={`width: ${intervention.progress}%`}></div>
				</div>

				<div class="mt-3 grid grid-cols-2 gap-2">
					<button type="button" class="rounded-xl bg-[#22C55E] px-3 py-2 text-xs font-semibold text-white transition hover:bg-[#16a34a]">
						Lancer
					</button>
					<a href="#" class="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-center text-xs font-semibold text-slate-700 transition hover:border-[#2563EB] hover:text-[#2563EB]">
						Consulter les informations
					</a>
				</div>
			</article>
		{/each}
	</section>
</div>
