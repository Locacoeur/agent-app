<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import type { PageProps } from './$types';

	const { params }: PageProps = $props();

	//TODO: update zoho-infos pour changer le label en "terminé"
</script>

<button onclick={() => goto(resolve('/'))}> Retour aux interventions </button>
