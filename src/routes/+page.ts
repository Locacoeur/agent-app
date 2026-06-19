import type { PageLoad } from './$types';
import { saveData, loadData } from '$lib/db';
import type { Intervention } from '$lib/types/intervention';

export const load: PageLoad = async () => {
	try {
		// Simule un fetch pour récupérer les données (qui sera fait sur Zoho ensuite)
		const data = [
			{ id: 'INT-2026-021', client: 'Arcelor Lille', label: 'A faire' },
			{ id: 'INT-2026-017', client: 'Pharma Nord', label: 'En cours' },
			{ id: 'INT-2026-019', client: 'AgriTech Hub', label: 'A traiter' },
			{ id: 'INT-2026-004', client: 'DataCooling DC2', label: 'Terminee' }
		];

		// const infos: (Intervention & { state: string })[] | undefined = await loadData('zoho-infos');

		// for (const interv of data) {
		// 	const existing = infos?.find((elem: Intervention) => elem.id === interv.id);
		// 	if (!existing) {
		// 		continue;
		// 	} else {
		// 		//TODO: finir
		// 		infos?.push({ ...interv, state: 'A faire' });
		// 		await saveData(infos, 'zoho-infos');
		// 	}
		// }

		await saveData(data, 'zoho-infos');
		return data;
		// return infos;
	} catch {
		return await loadData('zoho-infos');
	}
};
