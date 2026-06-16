<script lang="ts">
	import type { PageProps } from './$types.js';
	import { goto } from '$app/navigation';
	import { Html5QrcodeScanner } from 'html5-qrcode';
	import GS1DigitalLinkToolkit from '$lib/GS1DigitalLinkToolkit.js';
	import { DateTime } from 'luxon';
	import { Settings } from 'luxon';
	import { onMount } from 'svelte';
	import { resolve } from '$app/paths';
	import { updateData } from '$lib/db';
	import Modal from '$lib/components/Modal.svelte';

	Settings.twoDigitCutoffYear = 90;

	const { params }: PageProps = $props();
	let isOpenInfos = $state(false);
	let isOpen = $state(false);

	let result = $state<any>();

	const serialNumber = $derived.by(() => {
		if (!result?.['10']) return null;
		return result['10'];
	});

	// Calcule la date de fabrication
	const fabricationDate = $derived.by(() => {
		if (!result?.['11']) return null;

		const value = result?.['11'];

		return DateTime.fromFormat(value, 'yyMMdd', { locale: 'fr' });
	});

	async function onScanSuccess(decodedText: string) {
		// handle the scanned code as you like, for example:

		// parse GS1 format (for electrodes)
		try {
			const gs1 = new GS1DigitalLinkToolkit();

			// Parse les informations à partir du scan (format GS1)
			result = gs1.extractFromGS1elementStrings(decodedText.replaceAll(' ', ''));
		} catch (error) {
			alert('failed');
			console.error('Barcode parsing failed:', error);
			return;
		}

		isOpenInfos = true;
		html5QrcodeScanner.pause(true);
	}

	function isMobileDevice(): boolean {
		return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
			navigator.userAgent
		);
	}

	let qrboxFunction = function (viewfinderWidth: number, viewfinderHeight: number) {
		let minEdgePercentage = 0.7; // 70%
		let minEdgeSize = Math.min(viewfinderWidth, viewfinderHeight);
		let qrboxSize = Math.floor(minEdgeSize * minEdgePercentage);
		return {
			width: qrboxSize,
			height: qrboxSize
		};
	};

	let html5QrcodeScanner: Html5QrcodeScanner;

	onMount(() => {
		html5QrcodeScanner = new Html5QrcodeScanner(
			'reader',
			{
				fps: 10,
				qrbox: qrboxFunction,
				aspectRatio: isMobileDevice() ? 16 / 9 : 4 / 3,
				useBarCodeDetectorIfSupported: true
			},
			/* verbose= */ false
		);
		html5QrcodeScanner.render(onScanSuccess, undefined);
	});

	const onconfirm = async () => {
		await updateData(
			{ battery: { fabricationDate: fabricationDate?.toISODate(), serialNumber } },
			params.id
		);
		await html5QrcodeScanner.clear();
		await goto(resolve('/intervention/[id]/4', { id: params.id }));
	};

	const onconfirminfos = async () => {
		// TODO
		// const aed_report = await loadData(params.id);
		// if (aed_report && aed_report?.aed_report?.['Pourcentage de la batterie'] <= 15) {
		// 	isOpen = true;
		// } else {
		// 	await onconfirm();
		// }
		await onconfirm();
	};
</script>

<div class="mx-auto min-h-screen w-full max-w-3xl px-4 sm:px-6 lg:px-8">
	<section
		class="min-h-screen content-center rounded-2xl border border-slate-200 bg-white p-3 shadow-sm"
	>
		<h1
			class="text-heading mb-22 justify-self-center text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl"
		>
			Batterie
		</h1>
		<div id="reader"></div>
	</section>
</div>
<Modal
	bind:open={isOpenInfos}
	title="Vérifier les informations"
	confirmLabel="Valider"
	onconfirm={onconfirminfos}
	oncancel={() => html5QrcodeScanner.resume()}
>
	Vérifier les informations: <br />
	<ul>
		<li>Numéro de série: <b>{serialNumber}</b></li>
		<li>Date de fabrication: <b>{fabricationDate?.toFormat('yyyy-MM-dd')}</b></li>
		<!-- TODO -->
		<!-- <li>
			Pourcentage de batterie: <b
				>{(await loadData(params.id)).aed_report?.['Pourcentage de la batterie']}</b
			>
		</li> -->
	</ul>
</Modal>
<Modal
	bind:open={isOpen}
	title="Attention"
	confirmLabel="Passer"
	{onconfirm}
	oncancel={() => html5QrcodeScanner.resume()}
>
	La batterie est chargée à moins de <b>15%.</b> <br />
	Veuillez procéder à un changement. <br /><br />
	<button
		class="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-[#2563EB] hover:text-[#2563EB] disabled:cursor-not-allowed disabled:opacity-50"
		onclick={onconfirm}>Passer</button
	>
</Modal>
