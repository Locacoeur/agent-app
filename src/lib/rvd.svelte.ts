interface RVD {
	id: string;
	aed: object;
	electrodes: string;
}

export const rvd = $state<RVD>({
	id: '',
	aed: {},
	electrodes: ''
});
