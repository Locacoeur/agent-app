<script lang="ts">
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';

	let currentPath = '';

	onMount(() => {
		if (browser) {
			currentPath = window.location.pathname;
		}
	});

	const links = [
		{ href: '/', label: 'Dashboard', tone: 'blue' },
		{ href: '/interventions', label: 'Interventions', tone: 'green' },
		{ href: '/login', label: 'Compte', tone: 'orange' }
	];

	function activeClass(tone: string): string {
		if (tone === 'green') return 'bg-[#22C55E] text-white shadow-sm';
		if (tone === 'orange') return 'bg-[#F59E0B] text-white shadow-sm';
		return 'bg-[#2563EB] text-white shadow-sm';
	}

	function isActive(href: string): boolean {
		if (href === '/') return currentPath === '/';
		return currentPath.startsWith(href);
	}
</script>

<nav class="fixed bottom-3 left-1/2 z-40 w-[calc(100%-1.5rem)] -translate-x-1/2 rounded-2xl border border-slate-200 bg-white/95 p-1.5 shadow-lg backdrop-blur sm:bottom-4 sm:max-w-md">
	<ul class="grid grid-cols-3 gap-2">
		{#each links as link}
			<li>
				<a
					href={link.href}
					class={`block rounded-xl px-3 py-2 text-center text-xs font-semibold transition sm:text-sm ${
						isActive(link.href)
							? activeClass(link.tone)
							: 'text-slate-600 hover:bg-slate-100'
					}`}
				>
					{link.label}
				</a>
			</li>
		{/each}
	</ul>
</nav>
