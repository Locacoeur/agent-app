<script lang="ts">
	import type { PageProps } from './$types.js';
	import { goto } from '$app/navigation';
	import { Html5QrcodeScanner } from 'html5-qrcode';
	import { onMount } from 'svelte';
	import { resolve } from '$app/paths';
	import { GS1Parser, type DecodeResult } from '@valentynb/gs1-parser';
	import { loadData, updateData } from '$lib/db';
	import { normalizeBarcode, detectScannedElement, parseGs1ExpiryDate, isGs1ExpiryExpired } from '$lib/scan';

	const { params }: PageProps = $props();

	const gs1Parser = new GS1Parser({
		lotMaxLength: 20,
		fncChar: String.fromCodePoint(29)
	});

	let result = $state<DecodeResult>();
	let message = 'Scannez l’électrode. Le code doit contenir une date de péremption (AI 17).';

	async function onScanSuccess(decodedText: string) {
		const element = detectScannedElement(decodedText);
		if (element !== 'electrode') {
			alert('Erreur : code non valide. Scannez une électrode.');
			return;
		}

		const expiry = parseGs1ExpiryDate(decodedText);
		if (!expiry) {
			alert('Aucune date de péremption trouvée. Ce code ne correspond pas à une électrode.');
			return;
		}

		if (isGs1ExpiryExpired(decodedText)) {
			alert('Électrode périmée. Le code ne peut pas être utilisé.');
			return;
		}

		try {
			result = gs1Parser.decode(decodedText);
		} catch (error) {
			console.error('Barcode parsing failed:', error);
			alert('Impossible de décoder le code GS1. Vérifiez le scan et réessayez.');
			return;
		}

		const normalized = normalizeBarcode(decodedText);
		const existing = await loadData(params.id);
		if (existing?.electrodes === normalized || existing?.electrodes === decodedText) {
			alert('Erreur : même électrode déjà scannée durant cette intervention.');
			return;
		}

		if (confirm(`Électrode détectée : ${normalized}\nDate d'expiration : ${expiry}\nConfirmer ?`)) {
			await updateData({ electrodes: normalized }, params.id);
			await html5QrcodeScanner.clear();
			await goto(resolve('/intervention/[id]/3', { id: params.id }));
		}
	}

	function isMobileDevice(): boolean {
		return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
	}

	let qrboxFunction = function (viewfinderWidth: number, viewfinderHeight: number) {
		let minEdgePercentage = 0.7;
		let minEdgeSize = Math.min(viewfinderWidth, viewfinderHeight);
		let qrboxSize = Math.floor(minEdgeSize * minEdgePercentage);
		return {
			width: qrboxSize,
			height: qrboxSize
		};
	};

	let html5QrcodeScanner: Html5QrcodeScanner;

	onMount(() => {
		html5QrcodeScanner = new Html5QrcodeScanner('reader', {
			fps: 10,
			qrbox: qrboxFunction,
			aspectRatio: isMobileDevice() ? 16 / 9 : 4 / 3,
			useBarCodeDetectorIfSupported: true
		}, false);
		html5QrcodeScanner.render(onScanSuccess, () => {});
	});
</script>

<div class="mx-auto min-h-screen w-full max-w-3xl px-4 sm:px-6 lg:px-8">
	<section class="min-h-screen content-center rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
		<h1 class="text-heading text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">Électrode</h1>
		<p class="mt-3 text-sm text-slate-600">{message}</p>
		<div id="reader" class="mt-6"></div>
	</section>
</div>
