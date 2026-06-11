<script lang="ts">
	import { updateData } from '$lib/db';
	import { Html5QrcodeScanner } from 'html5-qrcode';
	import { onMount } from 'svelte';
	import type { PageProps } from './$types';

	const { params }: PageProps = $props();

	async function onScanSuccess(decodedText: string) {
		// handle the scanned code as you like, for example:

		if (confirm(decodedText)) {
			await updateData({ electrodes: decodedText }, params.id);
			await html5QrcodeScanner.clear();
		}
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
			height: qrboxSize / 4
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
		html5QrcodeScanner.render(onScanSuccess, () => {});
	});
</script>

<div class="mx-auto min-h-screen w-full max-w-3xl px-4 sm:px-6 lg:px-8">
	<section
		class="min-h-screen content-center rounded-2xl border border-slate-200 bg-white p-3 shadow-sm"
	>
		<h1
			class="text-heading mb-22 justify-self-center text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl"
		>
			Défibrillateur
		</h1>
		<div id="reader"></div>
	</section>
</div>
