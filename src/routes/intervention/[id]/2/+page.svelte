<script lang="ts">
	import type { PageProps } from './$types.js';
	import { goto } from '$app/navigation';
	import { Html5QrcodeScanner } from 'html5-qrcode';
	import GS1DigitalLinkToolkit from '$lib/GS1DigitalLinkToolkit.js';
	import { DateTime, Settings } from 'luxon';
	import { onMount } from 'svelte';
	import { resolve } from '$app/paths';
	import { updateData } from '$lib/db';
	import Modal from '$lib/components/Modal.svelte';

	Settings.twoDigitCutoffYear = 90;

	const { params }: PageProps = $props();
	let isOpenInfos = $state(false);
	let isOpen = $state(false);

	let result = $state<any>();

	// Calcule la date d'expiration à partir du qr code
	const expDate = $derived.by(() => {
		if (!result?.['17']) return null;

		const value = result?.['17'];
		return DateTime.fromFormat(value, 'yyMMdd', { locale: 'fr' });
	});

	// Récupère le numéro de série de l'électrode
	const serialNumber = $derived.by(() => {
		if (!result?.['10']) return null;
		return result['10'];
	});

	// Si on a bien scanné le QR code
	async function onScanSuccess(decodedText: string) {
		// parse GS1 format (for electrodes)
		try {
			const gs1 = new GS1DigitalLinkToolkit();

			// Parse les informations à partir du scan (format GS1)
			result = gs1.extractFromGS1elementStrings(decodedText.replaceAll(' ', ''));

			if (!result?.['17']) {
				alert('Aucune date de péremption trouvée. Ce code ne correspond pas à une électrode.');
				return;
			}

			if (expDate! < DateTime.now()) {
				alert('Électrode périmée. Le code ne peut pas être utilisé.');
				return;
			}
		} catch (error) {
			alert(error);
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

	// Maths shenanigans to set QR Code square on screen
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
			{ electrodes: { expiration_date: expDate?.toISODate(), serial_number: serialNumber } },
			params.id
		);
		await html5QrcodeScanner.clear();
		await goto(resolve('/intervention/[id]/3', { id: params.id }));
	};

	const onchange = async () => {
		await updateData(
			{ electrodes: { expiration_date: expDate?.toISODate(), serial_number: serialNumber } },
			params.id
		);
		await html5QrcodeScanner.clear();
		await goto(resolve('/intervention/[id]/2/add', { id: params.id }));
	};

	const onconfirminfos = async () => {
		if (expDate && expDate?.minus({ months: 2 }) <= DateTime.now()) {
			isOpen = true;
		} else {
			await onconfirm();
		}
	};
</script>

<div class="mx-auto min-h-screen w-full max-w-3xl px-4 sm:px-6 lg:px-8">
	<section
		class="min-h-screen content-center rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
	>
		<h1 class="text-heading text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
			Électrode
		</h1>
		<div id="reader" class="mt-6"></div>
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
		<li>Date de peremption: <b>{expDate?.toFormat('yyyy-MM-dd')}</b></li>
	</ul>
</Modal>
<Modal
	bind:open={isOpen}
	title="Attention"
	confirmLabel="Changer la batterie"
	onconfirm={onchange}
	oncancel={() => html5QrcodeScanner.resume()}
>
	La date de peremption des electrodes arrive dans moins de <b>2 mois.</b> <br />
	Veuillez procéder à un changement. <br /><br />
	<button
		class="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-[#2563EB] hover:text-[#2563EB] disabled:cursor-not-allowed disabled:opacity-50"
		onclick={onconfirm}>Passer</button
	>
</Modal>
