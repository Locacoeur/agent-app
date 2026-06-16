<script lang="ts">
	import { updateData, loadData } from '$lib/db';
	import { Html5QrcodeScanner } from 'html5-qrcode';
	import { onMount } from 'svelte';
	import { resolve } from '$app/paths';
	import type { PageProps } from './$types';
	import { extractDefibrillatorSerial, isG5Serial, isG3Serial, normalizeBarcode } from '$lib/scan';

	const { params }: PageProps = $props();
	let message = 'Scannez le défibrillateur. Le numéro de série doit correspondre au modèle sélectionné.';

	async function onScanSuccess(decodedText: string) {
		const serial = extractDefibrillatorSerial(decodedText);
		if (!serial) {
			alert('Erreur : aucun numéro de série valide trouvé. Le numéro doit commencer par D et contenir uniquement des chiffres pour un G5, ou être un serial court pour G3.');
			return;
		}

		const existing = await loadData(params.id);
		const model = existing?.deviceModel ?? 'g5';

		if (model === 'g5' && !isG5Serial(serial)) {
			alert('Modèle G5 attendu : le numéro de série doit commencer par D suivi uniquement de chiffres.');
			return;
		}

		if (model === 'g3' && !isG3Serial(serial)) {
			alert('Modèle G3 attendu : numéro de série plus court sans le préfixe D.');
			return;
		}

		await updateData({ defibrillator: { raw: normalizeBarcode(decodedText), serial, model } }, params.id);
		await html5QrcodeScanner.clear();
		await goto(resolve('/intervention/[id]/5', { id: params.id }));
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
			height: qrboxSize / 4
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
		<h1 class="text-heading text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">Défibrillateur</h1>
		<p class="mt-3 text-sm text-slate-600">{message}</p>
		<div id="reader" class="mt-6"></div>
	</section>
</div>
