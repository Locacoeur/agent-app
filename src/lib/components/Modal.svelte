<script lang="ts">
	import { tick } from 'svelte';

	type Props = {
		open?: boolean;
		title?: string;
		description?: string;
		confirmLabel?: string;
		cancelLabel?: string;
		variant?: 'default' | 'danger';
		onconfirm?: () => void | Promise<void>;
		oncancel?: () => void;
		children?: import('svelte').Snippet;
	};

	let {
		open = $bindable(false),
		title = 'Confirmation',
		description = '',
		confirmLabel = 'Confirmer',
		cancelLabel = 'Annuler',
		variant = 'default',
		onconfirm,
		oncancel,
		children
	}: Props = $props();

	let loading = $state(false);
	let dialogEl = $state<HTMLDialogElement | null>(null);

	const confirmColors = {
		default: 'bg-[#2563EB] hover:bg-[#1d4ed8] focus-visible:ring-[#2563EB]',
		danger: 'bg-[#DC2626] hover:bg-[#b91c1c] focus-visible:ring-[#DC2626]'
	};

	async function handleConfirm() {
		if (!onconfirm) {
			open = false;
			return;
		}
		loading = true;
		try {
			await onconfirm();
		} finally {
			loading = false;
			open = false;
		}
	}

	function handleCancel() {
		oncancel?.();
		open = false;
	}

	function handleBackdrop(e: MouseEvent) {
		if (e.target === dialogEl) handleCancel();
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') handleCancel();
	}

	$effect(() => {
		if (open) {
			tick().then(() => dialogEl?.showModal());
		} else {
			dialogEl?.close();
		}
	});
</script>

<dialog
	bind:this={dialogEl}
	onclose={handleCancel}
	onclick={handleBackdrop}
	onkeydown={handleKeydown}
	class="fixed inset-0 z-50 m-0 h-full w-full max-w-none border-none bg-transparent p-0 backdrop:bg-slate-900/40 backdrop:backdrop-blur-sm"
>
	<div class="flex min-h-full items-end justify-center px-4 pt-4 pb-4 sm:items-center sm:p-6">
		<!-- Panel -->
		<div
			role="dialog"
			tabindex="-1"
			aria-modal="true"
			aria-labelledby="modal-title"
			onclick={(e) => e.stopPropagation()}
			onkeydown={handleKeydown}
			class="w-full max-w-sm rounded-2xl border border-slate-200 bg-white shadow-sm"
		>
			<!-- Header -->
			<div class="flex items-start justify-between gap-3 border-b border-slate-100 p-4">
				<div>
					<p class="text-[11px] font-semibold tracking-[0.1em] text-slate-500 uppercase">
						Action requise
					</p>
					<h2 id="modal-title" class="mt-1 text-sm font-bold text-slate-900">
						{title}
					</h2>
				</div>
				<button
					type="button"
					onclick={handleCancel}
					aria-label="Fermer"
					class="rounded-xl border border-slate-200 bg-slate-50 p-1.5 text-slate-400 transition hover:border-slate-300 hover:text-slate-600 active:scale-95"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-3.5 w-3.5"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2.5"
						stroke-linecap="round"
						stroke-linejoin="round"
					>
						<path d="M18 6 6 18M6 6l12 12" />
					</svg>
				</button>
			</div>

			<!-- Body -->
			<div class="p-4">
				{#if description}
					<p class="text-xs leading-relaxed text-slate-600">{description}</p>
				{/if}
				{#if children}
					<div class="text-xs text-slate-600">
						{@render children()}
					</div>
				{/if}
			</div>

			<!-- Footer -->
			<div class="grid grid-cols-2 gap-2 border-t border-slate-100 p-4">
				<button
					type="button"
					onclick={handleCancel}
					disabled={loading}
					class="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-[#2563EB] hover:text-[#2563EB] disabled:cursor-not-allowed disabled:opacity-50"
				>
					{cancelLabel}
				</button>
				<button
					type="button"
					onclick={handleConfirm}
					disabled={loading}
					class="rounded-xl px-3 py-2 text-xs font-semibold text-white shadow-sm transition focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60 {confirmColors[
						variant
					]}"
				>
					{#if loading}
						<span class="flex items-center justify-center gap-1.5">
							<svg
								class="h-3 w-3 animate-spin"
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
							>
								<circle
									class="opacity-25"
									cx="12"
									cy="12"
									r="10"
									stroke="currentColor"
									stroke-width="4"
								/>
								<path
									class="opacity-75"
									fill="currentColor"
									d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
								/>
							</svg>
							Chargement…
						</span>
					{:else}
						{confirmLabel}
					{/if}
				</button>
			</div>
		</div>
	</div>
</dialog>
