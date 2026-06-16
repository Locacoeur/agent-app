<script lang="ts">
	import { goto } from '$app/navigation';
	import { Html5QrcodeScanner } from 'html5-qrcode';
	import { onMount } from 'svelte';
	import { resolve } from '$app/paths';
	import type { PageProps } from './$types';
	import { updateData, loadData } from '$lib/db';
	import { normalizeBarcode, detectScannedElement, parseGs1ExpiryDate } from '$lib/scan';

	const { params }: PageProps = $props();
	let message = 'Scannez la batterie. Le code ne doit pas contenir d’IA 17.';

	async function onScanSuccess(decodedText: string) {
		const element = detectScannedElement(decodedText);
		if (element !== 'battery') {
			alert('Erreur : scannez une batterie. Ce code ne correspond pas à l’élément attendu.');
			return;
		}

		if (parseGs1ExpiryDate(decodedText)) {
			alert('Ce code contient une date d’expiration. Scannez une batterie valide sans IA 17.');
			return;
		}

		const normalized = normalizeBarcode(decodedText);
		const existing = await loadData(params.id);
		if (existing?.battery === normalized) {
			alert('Erreur : même batterie déjà scannée.');
			return;
		}

		if (confirm(`Batterie détectée : ${normalized}\nConfirmer ?`)) {
			await html5QrcodeScanner.clear();
			await updateData({ battery: normalized }, params.id);
			await goto(resolve('/intervention/[id]/4', { id: params.id }));
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
		<h1 class="text-heading text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">Batterie</h1>
		<p class="mt-3 text-sm text-slate-600">{message}</p>
		<div id="reader" class="mt-6"></div>
	</section>
</div>
