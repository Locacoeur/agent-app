<script lang="ts">
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';
	import Header from '$lib/components/Header.svelte';
	import BottomNav from '$lib/components/BottomNav.svelte';
	import StatusBadge from '$lib/components/StatusBadge.svelte';
	import QRScannerMock from '$lib/components/QRScannerMock.svelte';
	import ReportForm from '$lib/components/ReportForm.svelte';
	import FileUploader from '$lib/components/FileUploader.svelte';
	import Modal from '$lib/components/Modal.svelte';

	const mockInterventions = [
		{
			id: 'INT-2026-001',
			client: 'Arcelor Lille',
			address: '12 Rue des Acieries, Lille',
			equipmentType: 'Presse hydraulique HZ-44',
			description: 'Controle fuite circuit principal et recalibrage capteur pression.',
			status: 'A planifier',
			plannedDate: '12/06/2026'
		},
		{
			id: 'INT-2026-004',
			client: 'DataCooling DC2',
			address: '90 Boulevard Nord, Lens',
			equipmentType: 'Module HVAC CRAC-90',
			description: 'Verification compresseur, test securite thermique et reprise connectique.',
			status: 'Controle qualite',
			plannedDate: '09/06/2026'
		},
		{
			id: 'INT-2026-005',
			client: 'Siderurgie Est',
			address: '2 Rue Laminoir, Valenciennes',
			equipmentType: 'Convoyeur CV-32',
			description: 'Validation finale, serrage mecanique et remise en production.',
			status: 'Terminee',
			plannedDate: '08/06/2026'
		}
	];

	let currentId = 'INT-2026-001';
	let showModal = false;

	$: current =
		mockInterventions.find((item) => item.id === currentId) || {
			id: currentId,
			client: 'Client non trouve',
			address: 'Adresse indisponible',
			equipmentType: 'Equipement inconnu',
			description: 'Aucune description disponible pour cette intervention.',
			status: 'A qualifier',
			plannedDate: '--/--/----'
		};

	onMount(() => {
		if (!browser) return;
		const segments = window.location.pathname.split('/').filter(Boolean);
		const maybeId = segments[segments.length - 1];
		if (maybeId) currentId = decodeURIComponent(maybeId);
	});
</script>

<div class="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 pb-24 pt-4 sm:px-6 lg:px-10">
	<Header title="Detail intervention" subtitle={current.id} rightMeta="Execution terrain" />

	<section class="mt-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
		<div class="flex flex-wrap items-start justify-between gap-3">
			<div>
				<h2 class="text-base font-bold text-slate-900">{current.client}</h2>
				<p class="mt-0.5 text-xs text-slate-600">{current.address}</p>
			</div>
			<StatusBadge status={current.status} />
		</div>

		<dl class="mt-3 grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
			<div class="rounded-xl border border-slate-200 bg-slate-50 p-2.5">
				<dt class="text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500">Type d'equipement</dt>
				<dd class="mt-0.5 text-xs font-semibold text-slate-800">{current.equipmentType}</dd>
			</div>
			<div class="rounded-xl border border-slate-200 bg-slate-50 p-2.5">
				<dt class="text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500">Date prevue</dt>
				<dd class="mt-0.5 text-xs font-semibold text-slate-800">{current.plannedDate}</dd>
			</div>
			<div class="rounded-xl border border-slate-200 bg-slate-50 p-2.5 sm:col-span-2">
				<dt class="text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500">Description</dt>
				<dd class="mt-0.5 text-xs text-slate-800">{current.description}</dd>
			</div>
		</dl>

		<div class="mt-3 rounded-xl border border-[#2563EB]/20 bg-[#2563EB]/10 p-2.5">
			<p class="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#1d4ed8]">Parcours operationnel</p>
			<p class="mt-0.5 text-xs text-slate-600">1. Scan QR 2. Rapport 3. Upload photos/PDF 4. Validation locale</p>
		</div>
	</section>

	<section class="mt-3 grid grid-cols-1 gap-3 lg:grid-cols-2">
		<QRScannerMock />
		<ReportForm />
	</section>

	<section class="mt-3 grid grid-cols-1 gap-3 lg:grid-cols-2">
		<FileUploader
			label="Upload photos"
			accept="image/*"
			helper="Formats images autorises, ajout multiple possible."
		/>
		<FileUploader
			label="Upload PDF"
			accept="application/pdf"
			helper="Ajouter le rapport PDF de controle terrain."
		/>
	</section>

	<button
		type="button"
		on:click={() => (showModal = true)}
		class="mt-4 rounded-xl bg-[#22C55E] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#16a34a]"
	>
		Valider l'intervention
	</button>

	<Modal open={showModal} title="Intervention validee" on:close={() => (showModal = false)}>
		<p>L'intervention <strong>{current.id}</strong> est marquee comme validee dans cette simulation statique.</p>
		<a href="/interventions" class="mt-3 inline-block rounded-lg bg-[#2563EB] px-3 py-2 text-xs font-semibold text-white hover:bg-[#1d4ed8]">
			Retour a la liste
		</a>
	</Modal>

	<BottomNav />
</div>
