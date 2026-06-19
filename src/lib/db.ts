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
	return await db.get(STORE, key);
}

export async function deleteData(key: string) {
	await db.delete(STORE, key);
}

export async function updateData(data: object, key: string) {
	const d = await db.get(STORE, key);
	if (d === undefined) {
		throw Error(`${key} is not in idb storage yet`);
	}
	await db.put(STORE, { ...d, ...data }, key);
}

export async function updateOrCreateData(data: object, key: string) {
	const d = await db.get(STORE, key);
	await db.put(STORE, { ...(d ?? {}), ...data }, key);
}
