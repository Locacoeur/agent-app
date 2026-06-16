import { openDB } from 'idb';

const STORE = 'data';

export const db = await openDB('locacoeur-app-agents', 1, {
	upgrade(db) {
		db.createObjectStore(STORE);
	}
});

export async function saveData(data: any, key: string) {
	await db.put(STORE, data, key);
}

export async function loadData(key: string) {
	return db.get(STORE, key);
}

export async function updateData(data: object, key: string) {
	const existing = await db.get(STORE, key);
	await db.put(STORE, { ...existing, ...data }, key);
}

export async function seedFakeInterventionData() {
	const interventions = [
		{ id: 'INT-2026-200', client: 'Test Client Alpha', label: 'A faire' },
		{ id: 'INT-2026-201', client: 'Test Client Bravo', label: 'En cours' },
		{ id: 'INT-2026-202', client: 'Test Client Charlie', label: 'A traiter' }
	];

	await saveData(interventions, 'zoho-infos');

	const details = {
		'INT-2026-200': {
			id: 'INT-2026-200',
			deviceModel: 'g5',
			batteryLow: true,
			aed_report: {
				'Série DSA': 'D123456789',
				'Dernier échec de DSA': 'Aucun',
				'Numéro de lot': 'ABC12-345',
				'Date de mise en service': '2026-05-20',
				'Capacité initiale de la batterie': '12.00',
				'Capacité restante de la batterie': '1.80',
				'Pourcentage de la batterie': '15.00',
				'Date installation': '2026-06-01 12:30:00',
				errors: []
			},
			electrodes: '(17)260630(10)AP1234',
			battery: 'BAT-TEST-200',
			defibrillator: { raw: 'D987654321', serial: 'D987654321', model: 'g5' }
		},
		'INT-2026-201': {
			id: 'INT-2026-201',
			deviceModel: 'g3',
			batteryLow: false,
			aed_report: {
				'Série DSA': 'G3-12345',
				'Dernier échec de DSA': 'Aucun',
				'Numéro de lot': 'XYZ98-765',
				'Date de mise en service': '2026-05-15',
				'Capacité initiale de la batterie': '12.00',
				'Capacité restante de la batterie': '10.50',
				'Pourcentage de la batterie': '87.50',
				'Date installation': '2026-06-05 09:20:00',
				errors: []
			},
			electrodes: '(17)270101(10)BR5678',
			battery: 'BAT-TEST-201',
			defibrillator: { raw: 'G31234', serial: 'G31234', model: 'g3' }
		},
		'INT-2026-202': {
			id: 'INT-2026-202',
			deviceModel: 'g5',
			batteryLow: false,
			aed_report: {
				'Série DSA': 'D112233445',
				'Dernier échec de DSA': 'Aucun',
				'Numéro de lot': 'LOT55-444',
				'Date de mise en service': '2026-05-10',
				'Capacité initiale de la batterie': '12.00',
				'Capacité restante de la batterie': '11.40',
				'Pourcentage de la batterie': '95.00',
				'Date installation': '2026-06-08 16:45:00',
				errors: []
			},
			electrodes: '(17)280101(10)CC9012',
			battery: 'BAT-TEST-202',
			defibrillator: { raw: 'D123450987', serial: 'D123450987', model: 'g5' }
		}
	};

	for (const [key, value] of Object.entries(details)) {
		await saveData(value, key);
		await saveData({ id: key, summary: value, readyAt: new Date().toISOString() }, `intervention-summary-${key}`);
	}

	return interventions;
}
