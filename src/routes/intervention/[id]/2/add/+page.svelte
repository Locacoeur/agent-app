<script lang="ts">
	import type { PageProps } from './$types.js';
	import { goto } from '$app/navigation';
	import { Html5QrcodeScanner } from 'html5-qrcode';
	import GS1DigitalLinkToolkit from '$lib/GS1DigitalLinkToolkit.js';
	import { DateTime, Settings } from 'luxon';
	import { onMount } from 'svelte';
	import { resolve } from '$app/paths';
	import { updateData } from '$lib/db';
	import { Modal } from '$lib/components';

	Settings.twoDigitCutoffYear = 90;

	const { params }: PageProps = $props();
	let isOpen = $state(false);

	let result = $state<any>();

	const expDate = $derived.by(() => {
		if (!result?.['17']) return null;

		const value = result?.['17'];

		return DateTime.fromFormat(value, 'yyMMdd', { locale: 'fr' });
		// return new Date(
		// 	2000 + Number(value.slice(0, 2)),
		// 	Number(value.slice(2, 4)) - 1,
		// 	Number(value.slice(4, 6))
		// );
	});
	const serialNumber = $derived.by(() => {
		if (!result?.['10']) return null;
		return result['10'];
	});

	async function onScanSuccess(decodedText: string) {
		// handle the scanned code as you like, for example:

		// parse GS1 format (for electrodes)
		try {
			const gs1 = new GS1DigitalLinkToolkit();

			// returns a DecodeResult object or throws an Error in case of parsing errors
			result = gs1.extractFromGS1elementStrings(decodedText.replaceAll(' ', '')); //new GS1Reader(decodedText).lookup;
		} catch (error) {
			alert(error);
			console.error('Barcode parsing failed:', error);
			return;
		}

		isOpen = true;
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
		//TODO
		await updateData({ electrodes2: { expDate, serialNumber } }, params.id);
		await html5QrcodeScanner.clear();
		await goto(resolve('/intervention/[id]/3', { id: params.id }));
	};
</script>

<div class="mx-auto min-h-screen w-full max-w-3xl px-4 sm:px-6 lg:px-8">
	<section
		class="min-h-screen content-center rounded-2xl border border-slate-200 bg-white p-3 shadow-sm"
	>
		<h1
			class="text-heading mb-22 justify-self-center text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl"
		>
			Ajouter une electrode
		</h1>
		<div id="reader"></div>
	</section>
</div>
<Modal
	bind:open={isOpen}
	title="Vérifier les informations"
	confirmLabel="Valider"
	{onconfirm}
	oncancel={() => html5QrcodeScanner.resume()}
>
	Vérifier les informations: <br />
	<ul>
		<li>Numéro de série: <b>{serialNumber}</b></li>
		<li>Date de peremption: <b>{expDate?.toFormat('yyyy-MM-dd')}</b></li>
	</ul>
</Modal>
