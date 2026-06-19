export interface Produit {
	emplacement: string;
	date_dernier_entretien: string;
	date_peremption: string;
	code_aed: string;
	dae_serial: string;
	type: string;
	nomenclature: string;
	en_service: boolean;
	type_dae: string;
	date_fabrication_dae: string;
	module_ta: string;
	serial_ta: string;
	id_ta: string;
	tel_ta: string;
	ta_contrapp_1: string;
	ta_contrapp_2: string;
}

export interface Intervention {
	id: string;
	date_planifiee: string;
	site: string;
	adresse: string;
	tel: string;
	produit: Produit;
	contrats: string[];
	agent_affecte: string;
	agent_intervenant: string;
	type_intervention: string;
	intitule: string;
}
