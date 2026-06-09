<script lang="ts">
	let timeSpent = '';
	let comments = '';
	let equipmentState = 'Operationnel';
	let replacedParts = '';
	let observations = '';
	let saved = false;

	function submitForm(event: Event) {
		event.preventDefault();
		saved = true;
	}
</script>

<section class="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
	<h3 class="text-sm font-semibold text-slate-900">Rapport d'intervention</h3>

	<form class="mt-2 space-y-2.5" on:submit={submitForm}>
		<div>
			<label for="timeSpent" class="mb-1 block text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-600">Temps passe (minutes)</label>
			<input
				id="timeSpent"
				type="number"
				bind:value={timeSpent}
				class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/15"
				required
			/>
		</div>

		<div>
			<label for="comments" class="mb-1 block text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-600">Commentaires</label>
			<textarea
				id="comments"
				bind:value={comments}
				rows="2"
				class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/15"
			></textarea>
		</div>

		<div>
			<label for="equipmentState" class="mb-1 block text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-600">Etat de l'equipement</label>
			<select
				id="equipmentState"
				bind:value={equipmentState}
				class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/15"
			>
				<option value="Operationnel">Operationnel</option>
				<option value="Degrade">Degrade</option>
				<option value="Hors service">Hors service</option>
			</select>
		</div>

		<div>
			<label for="replacedParts" class="mb-1 block text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-600">Pieces remplacees</label>
			<input
				id="replacedParts"
				type="text"
				bind:value={replacedParts}
				placeholder="Ex: Joint torique, filtre pression"
				class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/15"
			/>
		</div>

		<div>
			<label for="observations" class="mb-1 block text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-600">Observations</label>
			<textarea
				id="observations"
				bind:value={observations}
				rows="2"
				class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/15"
			></textarea>
		</div>

		<button type="submit" class="w-full rounded-xl bg-[#22C55E] px-3 py-2 text-sm font-semibold text-white transition hover:bg-[#16a34a]">
			Enregistrer le rapport
		</button>
	</form>

	{#if saved}
		<p class="mt-2 rounded-xl bg-[#22C55E]/12 px-3 py-2 text-sm font-medium text-[#15803d]">
			Rapport enregistre localement (mode mock).
		</p>
	{/if}
</section>
