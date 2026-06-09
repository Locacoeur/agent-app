<script lang="ts">
	import Header from '$lib/components/Header.svelte';
	import BottomNav from '$lib/components/BottomNav.svelte';
	import SearchBar from '$lib/components/SearchBar.svelte';
	import InterventionCard from '$lib/components/InterventionCard.svelte';

	let query = '';
	let selectedStatus = 'Tous';

	const interventions = [
		{
			id: 'INT-2026-001',
			client: 'Arcelor Lille',
			equipment: 'Presse hydraulique HZ-44',
			address: '12 Rue des Acieries, Lille',
			status: 'A planifier',
			plannedDate: '12/06/2026'
		},
		{
			id: 'INT-2026-002',
			client: 'Pharma Nord',
			equipment: 'Unite de filtration UF-210',
			address: '8 Avenue Curie, Amiens',
			status: 'En cours',
			plannedDate: '10/06/2026'
		},
		{
			id: 'INT-2026-003',
			client: 'AgriTech Hub',
			equipment: 'Pompe doseuse PD-18',
			address: '4 Rue des Serres, Arras',
			status: 'En attente pieces',
			plannedDate: '11/06/2026'
		},
		{
			id: 'INT-2026-004',
			client: 'DataCooling DC2',
			equipment: 'Module HVAC CRAC-90',
			address: '90 Boulevard Nord, Lens',
			status: 'Controle qualite',
			plannedDate: '09/06/2026'
		},
		{
			id: 'INT-2026-005',
			client: 'Siderurgie Est',
			equipment: 'Convoyeur CV-32',
			address: '2 Rue Laminoir, Valenciennes',
			status: 'Terminee',
			plannedDate: '08/06/2026'
		}
	];

	$: availableStatuses = ['Tous', ...new Set(interventions.map((item) => item.status))];
	$: filtered = interventions.filter((item) => {
		const matchesQuery = [item.client, item.id, item.equipment]
			.join(' ')
			.toLowerCase()
			.includes(query.toLowerCase());
		const matchesStatus = selectedStatus === 'Tous' || item.status === selectedStatus;
		return matchesQuery && matchesStatus;
	});
	$: totalCount = interventions.length;
	$: openCount = interventions.filter((item) => !item.status.toLowerCase().includes('term')).length;
	$: blockedCount = interventions.filter((item) => item.status.toLowerCase().includes('attente')).length;
</script>

<div class="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 pb-24 pt-4 sm:px-6 lg:px-10">
	<Header title="Interventions assignees" subtitle="Recherche compacte et filtre metier" rightMeta="Vue liste" />

	<section class="mt-4 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
		<div class="grid grid-cols-1 gap-2 md:grid-cols-[1fr_auto] md:items-end">
			<div>
				<SearchBar bind:value={query} placeholder="Client, ID, equipement" />
			</div>
			<div>
				<label for="status" class="mb-1 block text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-600">Statut</label>
			<select
				id="status"
				bind:value={selectedStatus}
				class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/15 md:w-56"
			>
				{#each availableStatuses as status}
					<option value={status}>{status}</option>
				{/each}
			</select>
			</div>
		</div>

		<div class="mt-2 grid grid-cols-3 gap-2">
			<div class="rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-2">
				<p class="text-[11px] text-slate-500">Total</p>
				<p class="text-sm font-semibold text-slate-900">{totalCount}</p>
			</div>
			<div class="rounded-xl border border-[#F59E0B]/30 bg-[#F59E0B]/10 px-2.5 py-2">
				<p class="text-[11px] text-[#b45309]">Ouvertes</p>
				<p class="text-sm font-semibold text-[#b45309]">{openCount}</p>
			</div>
			<div class="rounded-xl border border-[#EF4444]/30 bg-[#EF4444]/10 px-2.5 py-2">
				<p class="text-[11px] text-[#b91c1c]">Bloquees</p>
				<p class="text-sm font-semibold text-[#b91c1c]">{blockedCount}</p>
			</div>
		</div>
	</section>

	<section class="mt-3 grid grid-cols-1 gap-2.5 md:grid-cols-2 xl:grid-cols-3">
		{#if filtered.length === 0}
			<div class="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-600 shadow-sm">
				Aucune intervention ne correspond aux filtres.
			</div>
		{:else}
			{#each filtered as intervention}
				<InterventionCard
					id={intervention.id}
					client={intervention.client}
					equipment={intervention.equipment}
					address={intervention.address}
					status={intervention.status}
					plannedDate={intervention.plannedDate}
				/>
			{/each}
		{/if}
	</section>

	<BottomNav />
</div>
