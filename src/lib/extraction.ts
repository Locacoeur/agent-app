export async function extractAedG3Data(
	text: string
): Promise<Record<string, string | number | [string, string][]>> {
	/**
	 * Extrait des mots-clés spécifiques d'un texte de rapport AED.
	 *
	 * @param text - Texte extrait du rapport AED.
	 * @returns Dictionnaire contenant les valeurs extraites pour chaque mot-clé
	 *          et une liste des erreurs sous la clé 'errors'.
	 */

	// Liste des mots-clés à extraire
	const keywords = [
		'Série DSA',
		'Dernier échec de DSA',
		'Numéro de lot',
		'Date de mise en service',
		'Autotest'
	];

	// Dictionnaire pour stocker les résultats
	const results: Record<string, string | number | [string, string][]> = {};

	try {
		// Extraction des valeurs pour les mots-clés standards
		for (const key of keywords) {
			const patternEscaped = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
			const pattern = new RegExp(`${patternEscaped}\\s*:\\s*([^\\n]+)`);

			const match = text.match(pattern);
			if (match) {
				let value = match[1].trim();

				if (key === 'Série DSA' && value && value[0] === '0') {
					value = value.slice(1);
				}

				if (key === 'Numéro de lot' && value.length > 5) {
					value = value.slice(0, 5) + '-' + value.slice(5);
				}

				results[key] = value;
			} else {
				results[key] = '';
			}
		}

		// Extraction et conversion des capacités de batterie
		const matchInitial = text.match(/Capacité initiale de la batterie 12V\s*:\s*(\d+)\s*mAh/);
		const matchRemaining = text.match(/Capacité restante de la batterie 12V\s*:\s*(\d+)\s*mAh/);

		if (matchInitial && matchRemaining) {
			const initialMAh = parseFloat(matchInitial[1]);
			const remainingMAh = parseFloat(matchRemaining[1]);

			// Conversion en volts
			const initialV = initialMAh / 625; // Approximate conversion
			const remainingV = remainingMAh / 625;

			// Calcul du pourcentage de batterie restante
			const batteryPercentage = (remainingMAh / initialMAh) * 100;

			results['Capacité initiale de la batterie'] = initialV.toFixed(2);
			results['Capacité restante de la batterie'] = remainingV.toFixed(2);
			results['Pourcentage de la batterie'] = batteryPercentage.toFixed(2);
		} else {
			results['Capacité initiale de la batterie'] = '';
			results['Capacité restante de la batterie'] = '';
			results['Pourcentage de la batterie'] = '';
		}

		// Extraction des erreurs (codes d'erreur avec date/heure)
		const errorPattern = /(Code d'erreur \w+)\s+(\d{2}\/\d{2}\/\d{4})\s+(\d{2}:\d{2}:\d{2})/g;
		const errors: [string, string][] = [];
		let errorMatch: RegExpExecArray | null;

		while ((errorMatch = errorPattern.exec(text)) !== null) {
			const [, code, date, time] = errorMatch;
			errors.push([`${date} ${time}`, code]);
		}
		results['errors'] = errors;

		// Extraction de la dernière date d'installation depuis "Aucune erreur trouvée"
		const datePattern = /Aucune erreur trouvée\s*(\d{2}\/\d{2}\/\d{4})\s+(\d{2}:\d{2}:\d{2})/g;
		const datesFound: [string, string][] = [];
		let dateMatch: RegExpExecArray | null;

		while ((dateMatch = datePattern.exec(text)) !== null) {
			datesFound.push([dateMatch[1], dateMatch[2]]);
		}

		if (datesFound.length > 0) {
			const [lastDate, lastTime] = datesFound[datesFound.length - 1];
			results['Date installation'] = `${lastDate} ${lastTime}`;
		} else {
			results['Date installation'] = '';
		}

		return results;
	} catch (e) {
		console.error('Data extraction error:', e);
		return { erreur: e instanceof Error ? e.message : String(e) };
	}
}

export async function extractAedG5Data(text: string): Promise<Record<string, any>> {
	/**
	 * Extract relevant data and errors from AED G5 text.
	 *
	 * @param text Text extracted from the AED G5 PDF.
	 * @returns Object containing extracted data and errors.
	 */

	const keywords = [
		'N° série DAE',
		'Capacité restante de la batterie',
		"Date d'installation :",
		'Rapport DAE - Erreurs en cours',
		'Date / Heure:'
	];

	const results: Record<string, any> = {};

	// Extract keyword data
	for (const keyword of keywords) {
		const escapedKeyword = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
		const pattern = new RegExp(`${escapedKeyword}[\\s:]*([^\\n]*)`);
		const match = text.match(pattern);

		if (match) {
			results[keyword] = match[1].trim();
		}
	}

	// Extract errors
	const errorPattern = /(\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}:\d{2})\s+(0x[0-9A-Fa-f]+)/g;

	const errors: Array<[string, string]> = [];
	let match: RegExpExecArray | null;

	while ((match = errorPattern.exec(text)) !== null) {
		errors.push([match[1], match[2]]);
	}

	results.errors = errors;

	// Log error information
	if (errors.length > 0) {
		console.info(`Errors found: ${errors.length}`);

		for (const [dateTime, errorId] of errors) {
			console.info(`Date/Time: ${dateTime}, Error ID: ${errorId}`);
		}
	} else {
		console.debug('No errors found in the section.');
	}

	return results;
}
