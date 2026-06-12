# Documentation

L'app agents est une application web (PWA) qui sert aux agents à optimiser la maintenance. Elle utilise une connexion API à Zoho pour récupérer, pour un agent donné, les missions du jour à faire sur Zoho.

Elle est codée avec Sveltekit en Typescrit avec TailwindCSS, et utilise une base de données PostGreSQL (uniquement pour better auth).

| Modules utilisés      | Utilité                                                                                                                                          |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| Sveltekit 5           | Application                                                                                                                                      |
| Vitest & playwrite    | Testing                                                                                                                                          |
| html5-qrcode          | Lecture de QR code & code barre                                                                                                                  |
| idb                   | Interface IndexedDB                                                                                                                              |
| luxon                 | Gestion des DateTime                                                                                                                             |
| GS1DigitalLinkToolkit | Parsing du format [GS1](https://fr.wikipedia.org/wiki/GS1) basé sur [ce repository](https://github.com/gs1/GS1DigitalLinkToolkit.js/tree/master) |
| unpdf                 | Lecture de pdf                                                                                                                                   |

## File structure

Sur sveltekit, une route est un dossier dans le dossier `/src/routes` qui contient un fichier `+page.svelte`. Si on veut un id dynamique (par exemple `/intervention/1`, `/intervention/2`, `/intervention/3`...), on crée une arborescence comme ceci:

```
routes/
├─ interventions/
│  ├─ [id]/
│  │  ├─ +page.svelte
```

> Si on veut aussi une route `/intervention`, il suffit d'ajouter un fichier `+page.svelte` dans le dossier `/intervention`

Pour récupérer par appel API une ressource au chargement d'une page, on crée un fichier `+page.ts` dans le même dossier que le fichier `+page.svelte` (voir [ici](../src/routes/+page.ts) pour la structure).

Si on veut ajouter un fichier qui n'est pas une route (comme un service par exemple, ou des composants), on l'ajoute dans le dossier `src/lib` et on l'importe dans le code comme ceci:

```typescript
import ... from '$lib/...'
```

## Le fichier +page.svelte

Il comporte 2 (ou 3) parties: une balise `<script lang="ts">` qui permet d'écrire du code pour interragir avec le html, une partie style éventuellement, et enfin une partie html classique, avec possibilité d'interragir via le code plus haut.

> Voir documentation sveltekit pour plus d'informations.
