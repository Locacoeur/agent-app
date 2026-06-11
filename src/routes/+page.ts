import type { PageLoad } from './$types';
import { saveData, loadData } from '$lib/db';

export const load: PageLoad = async () => {
	try {
		const data = [
			{ id: 'INT-2026-021', client: 'Arcelor Lille', label: 'A faire' },
			{ id: 'INT-2026-017', client: 'Pharma Nord', label: 'En cours' },
			{ id: 'INT-2026-019', client: 'AgriTech Hub', label: 'A traiter' },
			{ id: 'INT-2026-004', client: 'DataCooling DC2', label: 'Terminee' }
		];
		await saveData(data, 'zoho-infos');
		return data;
	} catch {
		return await loadData('zoho-infos');
	}
};
