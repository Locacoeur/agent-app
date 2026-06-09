<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>OpsTrack Terrain</title>
</svelte:head>

<div class="relative min-h-screen overflow-x-hidden bg-slate-50 text-slate-900">
	<div class="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,#dbeafe_0%,#f8fafc_55%)]"></div>
	<div class="pointer-events-none absolute inset-0 opacity-50 [background-image:linear-gradient(#dbe1ea_1px,transparent_1px),linear-gradient(90deg,#dbe1ea_1px,transparent_1px)] [background-size:24px_24px]"></div>
	<div class="relative z-10">
		<slot />
	</div>
</div>
