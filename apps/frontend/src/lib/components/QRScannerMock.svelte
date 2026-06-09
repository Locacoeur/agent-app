<script lang="ts">
	let scanning = false;
	let validated = false;
	let validatedAt = '';

	function simulateScan() {
		scanning = true;
		setTimeout(() => {
			scanning = false;
			validated = true;
			validatedAt = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
		}, 900);
	}
</script>

<section class="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
	<h3 class="text-sm font-semibold text-slate-900">Validation QR Code</h3>
	<div class="mt-2 rounded-2xl border border-[#2563EB]/30 bg-slate-950 p-3">
		<div class="relative mx-auto flex h-40 w-full max-w-xs items-center justify-center overflow-hidden rounded-xl bg-slate-900">
			<div class="absolute inset-0 opacity-30 [background-image:linear-gradient(#38bdf8_1px,transparent_1px),linear-gradient(90deg,#38bdf8_1px,transparent_1px)] [background-size:20px_20px]"></div>
			<div class="pointer-events-none absolute inset-5 rounded-xl border border-[#22C55E]/60"></div>
			<div class="text-center text-xs text-slate-200">
				<p class="font-semibold">Zone de lecture</p>
				<p class="mt-1 text-slate-400">Cadrez le QR equipement</p>
			</div>
		</div>
	</div>

	<button
		type="button"
		on:click={simulateScan}
		disabled={scanning}
		class="mt-3 w-full rounded-xl bg-[#2563EB] px-3 py-2 text-sm font-semibold text-white transition hover:bg-[#1d4ed8] disabled:cursor-not-allowed disabled:opacity-60"
	>
		{#if scanning}
			Simulation en cours...
		{:else}
			Simuler le scan
		{/if}
	</button>

	{#if validated}
		<p class="mt-2 rounded-xl bg-[#22C55E]/12 px-3 py-2 text-sm font-medium text-[#15803d]">
			Presence validee sur site a {validatedAt}.
		</p>
	{/if}
</section>
