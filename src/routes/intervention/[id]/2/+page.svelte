<script lang="ts">
	import { rvd } from '$lib/rvd.svelte';
	import type { PageProps } from './$types.js';
	import { goto } from '$app/navigation';
	import { Html5QrcodeScanner } from 'html5-qrcode';
	import { onMount } from 'svelte';
	import { GS1Parser, type DecodeResult } from '@valentynb/gs1-parser';
	import { resolve } from '$app/paths';
	import { updateData } from '$lib/db';

	const { params }: PageProps = $props();

	const gs1Parser = new GS1Parser({
		// If not specified, no limit is applied, except the one in the GS1 specs
		lotMaxLength: 20,

		// If not specified, the GS char is used
		fncChar: String.fromCodePoint(29)
	});

	let result = $state<DecodeResult>();

	async function onScanSuccess(decodedText: string) {
		// handle the scanned code as you like, for example:

		// parse GS1 format (for electrodes)
		try {
			// returns a DecodeResult object or throws an Error in case of parsing errors
			result = gs1Parser.decode(decodedText);
		} catch (error) {
			alert('failed');
			console.error('Barcode parsing failed:', error);
			return;
		}

		if (confirm(result.denormalized)) {
			await updateData({ electrodes: result.denormalized }, params.id);
			rvd.electrodes = result.denormalized;
			await html5QrcodeScanner.clear();
			await goto(resolve('/intervention/[id]/3', { id: params.id }));
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
			Electrodes
		</h1>
		<div id="reader"></div>
	</section>
</div>
