<script lang="ts">
	import type { PageProps } from './$types.js';
	import { goto } from '$app/navigation';
	import { Html5QrcodeScanner } from 'html5-qrcode';
	import { onMount } from 'svelte';
	import { resolve } from '$app/paths';
	import { loadData, updateData } from '$lib/db';
	import Modal from '$lib/components/Modal.svelte';

	const { params }: PageProps = $props();
	let isOpen = $state(false);

	let result = $state<any>();

	async function onScanSuccess(decodedText: string) {
		if ((await loadData(params.id))?.device_model == 'g5' && decodedText[1] === 'D') {
			alert('Le numéro de série ne correspond pas à un G5. Veuillez recommencer.');
			return;
		}
		// handle the scanned code as you like, for example:

		// parse GS1 format (for electrodes)
		result = decodedText;

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
		html5QrcodeScanner.render(onScanSuccess, undefined);
	});

	const onconfirm = async () => {
		await updateData({ aed: { serial_number: result } }, params.id);
		await html5QrcodeScanner.clear();
		await goto(resolve('/intervention/[id]/end', { id: params.id }));
	};
</script>

<div class="mx-auto min-h-screen w-full max-w-3xl px-4 sm:px-6 lg:px-8">
	<section
		class="min-h-screen content-center rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
	>
		<h1 class="text-heading text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
			Défibrillateur
		</h1>
		<div id="reader" class="mt-6"></div>
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
		<li>Numéro de série: <b>{result}</b></li>
	</ul>
</Modal>
