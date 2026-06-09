<script lang="ts">
	export let status: string;

	function getClasses(value: string): string {
		const normalized = value.toLowerCase();
		if (normalized.includes('term') || normalized.includes('valide')) {
				return 'bg-[#22C55E]/12 text-[#15803d] border border-[#22C55E]/30';
		}
		if (normalized.includes('cours') || normalized.includes('controle')) {
				return 'bg-[#F59E0B]/12 text-[#b45309] border border-[#F59E0B]/30';
		}
		if (normalized.includes('retard') || normalized.includes('bloque')) {
				return 'bg-[#EF4444]/12 text-[#b91c1c] border border-[#EF4444]/30';
		}
		return 'bg-[#2563EB]/12 text-[#1d4ed8] border border-[#2563EB]/30';
	}
</script>

	<span class={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold ${getClasses(status)}`}>
	{status}
</span>
