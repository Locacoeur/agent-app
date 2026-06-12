# La base de données

L'application étant une PWA, elle utilise la [IndexedDB](https://developer.mozilla.org/fr/docs/Web/API/IndexedDB_API) du navigateur pour stocker les données. On utilise [idb](https://github.com/jakearchibald/idb) pour interragir de manière simple avec la database, et le service utilisé est situé [ici](../src/lib/db.ts).

Les données stockées:

| Clé               | Type                                                                                                                                                                                                                                          | Commentaire                                                                   |
| ----------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| zoho-infos        | {id: string, client: string, label: string}[]                                                                                                                                                                                                 | Récupéré de Zoho, informations pour l'intervention du jour **pour un client** |
| [intervention-id] | {[intervention-id]: {aed_report: object, aed: {serialNumber: string}, battery: {fabricationDate: string, serialNumber: string}, electrodes: {expDate: string, serialNumber: string}, electrodes2: {expDate: string, serialNumber: string}, }} | Données récupérées lors d'une intervention                                    |
