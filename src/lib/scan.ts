export function normalizeBarcode(text: string): string {
	return text.replace(/\u001D/g, '').replace(/[\(\)\{\}]/g, '').trim();
}

function findAiValue(barcode: string, ai: string, exactLength?: number): string | null {
	const normalized = barcode.replace(/\u001D/g, '');
	const pattern = new RegExp(`(?:\\(|\\{)?${ai}(?:\\)|\\})?([0-9A-Za-z]+)`);
	const match = normalized.match(pattern);
	if (!match) return null;
	const value = match[1].trim();
	if (exactLength && value.length !== exactLength) return null;
	return value;
}

function parseGs1Date(value: string): string | null {
	if (value.length !== 6 || !/^\d{6}$/.test(value)) return null;
	const year = 2000 + Number(value.slice(0, 2));
	const month = Number(value.slice(2, 4));
	const day = Number(value.slice(4, 6));
	if (month < 1 || month > 12 || day < 1 || day > 31) return null;
	return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

export function parseGs1ExpiryDate(barcode: string): string | null {
	const value = findAiValue(barcode, '17', 6);
	if (!value) return null;
	return parseGs1Date(value);
}

export function hasGs1Expiry(barcode: string): boolean {
	return parseGs1ExpiryDate(barcode) !== null;
}

export function isGs1ExpiryExpired(barcode: string): boolean {
	const date = parseGs1ExpiryDate(barcode);
	if (!date) return false;
	const expiry = new Date(date + 'T23:59:59');
	const now = new Date();
	return expiry < now;
}

export function detectScannedElement(barcode: string): 'battery' | 'electrode' | 'unknown' {
	if (hasGs1Expiry(barcode)) {
		return 'electrode';
	}

	const normalized = normalizeBarcode(barcode);
	const hasProductCode = /(?:\(|\{)?01(?:\)|\})?\d{14}/.test(barcode) || /(?:\(|\{)?21(?:\)|\})?[0-9A-Za-z]+/.test(barcode);
	return hasProductCode ? 'battery' : 'unknown';
}

export function extractDefibrillatorSerial(barcode: string): string | null {
	const ai21 = findAiValue(barcode, '21');
	const candidate = ai21 || normalizeBarcode(barcode);
	if (!candidate) return null;
	const trimmed = candidate.trim().toUpperCase();
	if (/^D\d+$/.test(trimmed)) return trimmed;
	if (/^[A-Z0-9]{4,12}$/.test(trimmed) && !/^D\d+$/.test(trimmed)) return trimmed;
	return null;
}

export function isG5Serial(serial: string): boolean {
	return /^D\d+$/.test(serial);
}

export function isG3Serial(serial: string): boolean {
	return /^[A-Z0-9]{4,12}$/.test(serial) && !/^D\d+$/.test(serial);
}
