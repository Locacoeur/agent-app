<script lang="ts">
	import { fade, scale } from 'svelte/transition';

	type Props = {
		open?: boolean;
		title?: string;
		closeOnBackdrop?: boolean;
		closeOnEscape?: boolean;
		showCloseButton?: boolean;
		onClose?: () => void;
	};

	let {
		open = $bindable(false),
		title = 'Modal',
		closeOnBackdrop = true,
		closeOnEscape = true,
		showCloseButton = true,
		onClose
	}: Props = $props();

	function closeModal() {
		open = false;
		onClose?.();
	}

	function handleBackdropClick() {
		if (closeOnBackdrop) {
			closeModal();
		}
	}

	function handleKeyDown(event: KeyboardEvent) {
		if (open && closeOnEscape && event.key === 'Escape') {
			event.preventDefault();
			closeModal();
		}
	}
</script>

<svelte:window onkeydown={handleKeyDown} />

{#if open}
	<div
		class="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4"
		role="presentation"
		onclick={handleBackdropClick}
		in:fade={{ duration: 140 }}
		out:fade={{ duration: 140 }}
	>
		<div
			class="relative w-full max-w-lg rounded-2xl border border-slate-200 bg-white shadow-2xl"
			role="dialog"
			aria-modal="true"
			aria-label={title}
			onclick={(event) => event.stopPropagation()}
			in:scale={{ start: 0.96, duration: 140 }}
			out:scale={{ start: 0.98, duration: 110 }}
		>
			<header class="flex items-center justify-between border-b border-slate-200 px-5 py-4">
				<h2 class="text-base font-bold text-slate-900">{title}</h2>
				{#if showCloseButton}
					<button
						type="button"
						class="rounded-lg border border-slate-200 px-2 py-1 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
						onclick={closeModal}
						aria-label="Fermer"
					>
						×
					</button>
				{/if}
			</header>

			<section class="px-5 py-4">
				<slot />
			</section>

			<footer class="flex justify-end gap-2 border-t border-slate-200 px-5 py-4">
				<slot name="actions">
					<button
						type="button"
						class="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
						onclick={closeModal}
					>
						Fermer
					</button>
				</slot>
			</footer>
		</div>
	</div>
{/if}
