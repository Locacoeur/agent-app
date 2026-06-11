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
	const d = db.get(STORE, key);
	await db.add(STORE, { ...d, ...data });
}
