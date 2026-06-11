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
