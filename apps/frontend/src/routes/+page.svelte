<script lang="ts">
	import Header from '$lib/components/Header.svelte';
	import BottomNav from '$lib/components/BottomNav.svelte';
	import StatCard from '$lib/components/StatCard.svelte';

	const stats = [
		{ label: 'Interventions totales', value: 18, tone: 'blue', meta: 'Semaine 24' },
		{ label: 'Terminees', value: 9, tone: 'green', meta: '50% cloturees' },
		{ label: 'En cours', value: 6, tone: 'orange', meta: '3 urgences' },
		{ label: 'A traiter', value: 3, tone: 'red', meta: 'Aujourd hui' }
	];

	const highlights = [
		{
			title: 'INT-2026-021 - Arcelor Lille',
			detail: 'Controle vibratoire convoyeur principal - Slot 14:00',
			status: 'Urgence atelier'
		},
		{
			title: 'INT-2026-017 - Pharma Nord',
			detail: 'Validation post-maintenance unite de filtration',
			status: 'Controle qualite'
		},
		{
			title: 'INT-2026-019 - AgriTech Hub',
			detail: 'Pieces disponibles, intervention relancable',
			status: 'Pret a redemarrer'
		}
	];

	const planning = [
		{ hour: '08:30', task: 'Briefing equipe mobile', site: 'Base Lens', state: 'Terminee' },
		{ hour: '11:00', task: 'Diagnostic pompe doseuse', site: 'AgriTech Hub', state: 'En cours' },
		{ hour: '14:00', task: 'Controle hydraulique', site: 'Arcelor Lille', state: 'A planifier' },
		{ hour: '16:30', task: 'Signature rapport PDF', site: 'Pharma Nord', state: 'A valider' }
	];
</script>

<div class="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 pb-24 pt-4 sm:px-6 lg:px-10">
	<Header title="Tableau de bord" subtitle="Pilotage compact des interventions terrain" rightMeta="Vue operationnelle" />

	<section class="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
		{#each stats as stat}
			<StatCard label={stat.label} value={stat.value} tone={stat.tone} meta={stat.meta} />
		{/each}
	</section>

	<section class="mt-4 grid grid-cols-1 gap-3 xl:grid-cols-[1.2fr_1fr]">
		<div class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
			<div class="flex items-center justify-between">
				<h2 class="text-sm font-semibold text-slate-900">Priorites du jour</h2>
				<a href="/interventions" class="text-xs font-semibold uppercase tracking-[0.08em] text-[#2563EB] hover:underline">Ouvrir la liste</a>
			</div>
			<div class="mt-3 space-y-2">
				{#each highlights as item}
					<div class="rounded-xl border border-slate-200 bg-slate-50 p-3">
						<p class="text-xs font-semibold text-slate-900">{item.title}</p>
						<p class="mt-0.5 text-xs text-slate-600">{item.detail}</p>
						<span class="mt-1 inline-flex rounded-full border border-[#2563EB]/25 bg-[#2563EB]/10 px-2 py-0.5 text-[11px] font-semibold text-[#1d4ed8]">
							{item.status}
						</span>
					</div>
				{/each}
			</div>
		</div>

		<div class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
			<h2 class="text-sm font-semibold text-slate-900">Timeline terrain</h2>
			<ul class="mt-3 space-y-2">
				{#each planning as item}
					<li class="grid grid-cols-[64px_1fr] gap-2 rounded-xl border border-slate-200 bg-slate-50 p-2.5">
						<p class="text-xs font-semibold text-slate-500">{item.hour}</p>
						<div>
							<p class="text-xs font-semibold text-slate-900">{item.task}</p>
							<p class="text-[11px] text-slate-600">{item.site} - {item.state}</p>
						</div>
					</li>
				{/each}
			</ul>
		</div>
	</section>

	<section class="mt-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
		<div class="flex items-center justify-between">
			<h2 class="text-sm font-semibold text-slate-900">Raccourcis intervention</h2>
			<p class="text-[11px] font-medium text-slate-500">Acces rapide mobile</p>
		</div>
		<div class="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3">
			<a href="/login" class="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-[#2563EB] hover:text-[#2563EB]">
				Session technicien
			</a>
			<a href="/interventions" class="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-[#22C55E] hover:text-[#15803d]">
				File d interventions
			</a>
			<a href="/interventions/INT-2026-004" class="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-[#F59E0B] hover:text-[#b45309]">
				Intervention active
			</a>
		</div>
	</section>

	<BottomNav />
</div>
