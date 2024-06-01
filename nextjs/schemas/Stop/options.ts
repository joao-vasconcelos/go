/* * */

export enum StopPropertyOperationalStatus {
	Active = 'ACTIVE',
	Inactive = 'INACTIVE',
	Provisional = 'PROVISIONAL',
	Seasonal = 'SEASONAL',
	Voided = 'VOIDED',
}

export enum StopPropertyHasPole {
	Damaged = 'DAMAGED',
	Missing = 'MISSING',
	No = 'NO',
	Unknown = 'UNKNOWN',
	Yes = 'YES',
}

export enum StopPropertyHasCover {
	Damaged = 'DAMAGED',
	Missing = 'MISSING',
	No = 'NO',
	Unknown = 'UNKNOWN',
	Yes = 'YES',
}

export enum StopPropertyHasShelter {
	Damaged = 'DAMAGED',
	Missing = 'MISSING',
	No = 'NO',
	Unknown = 'UNKNOWN',
	Yes = 'YES',
}

export enum StopPropertyHasMupi {
	Damaged = 'DAMAGED',
	Missing = 'MISSING',
	No = 'NO',
	Unknown = 'UNKNOWN',
	Yes = 'YES',
}

export enum StopPropertyHasBench {
	Damaged = 'DAMAGED',
	Missing = 'MISSING',
	No = 'NO',
	Unknown = 'UNKNOWN',
	Yes = 'YES',
}

export enum StopPropertyHasTrashBin {
	Damaged = 'DAMAGED',
	Missing = 'MISSING',
	No = 'NO',
	Unknown = 'UNKNOWN',
	Yes = 'YES',
}

export enum StopPropertyHasLighting {
	Confortable = 'CONFORTABLE',
	Damaged = 'DAMAGED',
	Insuficient = 'INSUFICIENT',
	Moderate = 'MODERATE',
	Unavailable = 'UNAVAILABLE',
	Unknown = 'UNKNOWN',
}

export enum StopPropertyHasElectricity {
	No = 'NO',
	Unknown = 'UNKNOWN',
	Yes = 'YES',
}

export enum StopPropertyDockingBayType {
	Bay = 'BAY',
	Island = 'ISLAND',
	Peninsula = 'PENINSULA',
	RoadMarks = 'ROAD_MARKS',
	Simple = 'SIMPLE',
	Unknown = 'UNKNOWN',
}

export enum StopPropertyHasFlag {
	Damaged = 'DAMAGED',
	Missing = 'MISSING',
	No = 'NO',
	Unknown = 'UNKNOWN',
	Yes = 'YES',
}

export enum StopPropertyHasPipStatic {
	Legacy = 'LEGACY',
	No = 'NO',
	Type1 = 'TYPE_1',
	Type2 = 'TYPE_2',
	Unknown = 'UNKNOWN',
}

export enum StopPropertyHasPipAudio {
	Legacy = 'LEGACY',
	No = 'NO',
	Type1 = 'TYPE_1',
	Type2 = 'TYPE_2',
	Unknown = 'UNKNOWN',
}

export enum StopPropertyHasPipRealtime {
	Legacy = 'LEGACY',
	No = 'NO',
	Type1 = 'TYPE_1',
	Type2 = 'TYPE_2',
	Unknown = 'UNKNOWN',
}

export enum StopPropertyHasH2oaSignage {
	Damaged = 'DAMAGED',
	Missing = 'MISSING',
	No = 'NO',
	Unknown = 'UNKNOWN',
	Yes = 'YES',
}

export enum StopPropertyHasSchedules {
	Damaged = 'DAMAGED',
	Missing = 'MISSING',
	Unknown = 'UNKNOWN',
	Yes = 'YES',
}

export enum StopPropertyHasTactileSchedules {
	Damaged = 'DAMAGED',
	Missing = 'MISSING',
	No = 'NO',
	Unknown = 'UNKNOWN',
	Yes = 'YES',
}

export enum StopPropertyHasNetworkMap {
	Damaged = 'DAMAGED',
	Missing = 'MISSING',
	No = 'NO',
	Unknown = 'UNKNOWN',
	Yes = 'YES',
}

export enum StopPropertyHasSidewalk {
	No = 'NO',
	Type1 = 'TYPE_1',
	Type2 = 'TYPE_2',
	Unknown = 'UNKNOWN',
}

export enum StopPropertyHasCrossing {
	Damaged = 'DAMAGED',
	Missing = 'MISSING',
	No = 'NO',
	Unknown = 'UNKNOWN',
	Yes = 'YES',
}

export enum StopPropertyHasFlatAccess {
	No = 'NO',
	Unknown = 'UNKNOWN',
	Yes = 'YES',
}

export enum StopPropertyHasWideAccess {
	No = 'NO',
	Unknown = 'UNKNOWN',
	Yes = 'YES',
}

export enum StopPropertyHasTactileAccess {
	Damaged = 'DAMAGED',
	Missing = 'MISSING',
	No = 'NO',
	Unknown = 'UNKNOWN',
	Yes = 'YES',
}

export enum StopPropertyHasAbusiveParking {
	AbusiveIllegal = 'ABUSIVE_ILLEGAL',
	AbusiveLegal = 'ABUSIVE_LEGAL',
	No = 'NO',
	Unknown = 'UNKNOWN',
}

export enum StopPropertyWheelchairBoarding {
	No = 'NO',
	Unknown = 'UNKNOWN',
	Yes = 'YES',
}

/* * */

export const StopOptions = {
	//

	/*
   * STORAGE SCOPE
   */

	docking_bay_type: Object.values(StopPropertyDockingBayType),

	/*
   * MINIMUM STOP NAME LENGTH
   */

	has_abusive_parking: Object.values(StopPropertyHasAbusiveParking),

	/*
   * MAXIMUM STOP NAME LENGTH
   */

	has_bench: Object.values(StopPropertyHasBench),

	/*
   * MAXIMUM STOP SHORT NAME LENGTH
   */

	has_cover: Object.values(StopPropertyHasShelter),

	/*
   * STOP NAME ABBREVIATIONS
   * Lista de abreviaturas recomendadas pelos CTT
   * https://pt.wikipedia.org/wiki/Lista_de_abreviaturas_recomendadas_pelos_CTT
   * Obrigado @ricardojorgerm pela sugestão.
   */

	has_crossing: Object.values(StopPropertyHasCrossing),

	/*
   * OPERATIONAL STATUS
   */

	has_electricity: Object.values(StopPropertyHasElectricity),

	/*
   * INFRASTRUCTURE
   */

	has_flag: Object.values(StopPropertyHasFlag),

	has_flat_access: Object.values(StopPropertyHasFlatAccess),

	has_h2oa_signage: Object.values(StopPropertyHasH2oaSignage),

	has_lighting: Object.values(StopPropertyHasLighting),

	has_mupi: Object.values(StopPropertyHasMupi),

	has_network_map: Object.values(StopPropertyHasNetworkMap),

	has_pip_audio: Object.values(StopPropertyHasPipAudio),

	has_pip_realtime: Object.values(StopPropertyHasPipRealtime),

	has_pip_static: Object.values(StopPropertyHasPipStatic),

	/*
   * PUBLIC INFORMATION
   */

	has_pole: Object.values(StopPropertyHasPole),

	has_schedules: Object.values(StopPropertyHasSchedules),

	has_shelter: Object.values(StopPropertyHasShelter),

	has_sidewalk: Object.values(StopPropertyHasSidewalk),

	has_tactile_access: Object.values(StopPropertyHasTactileAccess),

	has_tactile_schedules: Object.values(StopPropertyHasTactileSchedules),

	has_trash_bin: Object.values(StopPropertyHasTrashBin),

	has_wide_access: Object.values(StopPropertyHasWideAccess),

	/*
   * ACCESSIBILITY
   */

	max_stop_name_length: 100,

	max_stop_short_name_length: 55,

	min_stop_name_length: 5,

	name_abbreviations: [
		//
		// TML: Street & Place names
		{ enabled: true, phrase: 'Quinta', replacement: 'Qta.' },
		{ enabled: true, phrase: 'Largo', replacement: 'Lgo.' },
		{ enabled: true, phrase: 'Estrada Municipal', replacement: 'EM' },
		{ enabled: true, phrase: 'Estrada Nacional', replacement: 'EN' },
		// TML: People
		{ enabled: true, phrase: 'Santo', replacement: 'Sto.' },
		{ enabled: true, phrase: 'Santa', replacement: 'Sta.' },
		// TML: Facilities
		{ enabled: true, phrase: 'Cooperativa', replacement: 'Coop.' },
		{ enabled: true, phrase: 'Câmara Municipal', replacement: 'CM' },
		{ enabled: false, phrase: 'Hospital', replacement: 'Hosp.' },
		{ enabled: false, phrase: 'Escola', replacement: 'Esc.' },
		//
		// CTT: Tipo de artéria
		{ enabled: true, phrase: 'Alameda', replacement: 'Al.' },
		{ enabled: true, phrase: 'Avenida', replacement: 'Av.' },
		{ enabled: true, phrase: 'Azinhaga', replacement: 'Az.' },
		{ enabled: true, phrase: 'Bairro', replacement: 'Br.' },
		{ enabled: true, phrase: 'Beco', replacement: 'Bc.' },
		{ enabled: true, phrase: 'Calçada', replacement: 'Cc.' },
		{ enabled: true, phrase: 'Calçadinha', replacement: 'Ccnh.' },
		{ enabled: true, phrase: 'Caminho', replacement: 'Cam.' },
		{ enabled: true, phrase: 'Casa', replacement: 'Cs.' },
		{ enabled: true, phrase: 'Conjunto', replacement: 'Cj.' },
		{ enabled: true, phrase: 'Escadas', replacement: 'Esc.' },
		{ enabled: true, phrase: 'Escadinhas', replacement: 'Escnh.' },
		{ enabled: true, phrase: 'Estrada', replacement: 'Estr.' },
		{ enabled: true, phrase: 'Jardim', replacement: 'Jd.' },
		{ enabled: true, phrase: 'Loteamento', replacement: 'Lot.' },
		{ enabled: true, phrase: 'Parque', replacement: 'Pq.' },
		{ enabled: true, phrase: 'Pátio', replacement: 'Pat.' },
		{ enabled: true, phrase: 'Praça', replacement: 'Pc.' },
		{ enabled: true, phrase: 'Praceta', replacement: 'Pct.' },
		{ enabled: true, phrase: 'Prolongamento', replacement: 'Prl.' },
		{ enabled: true, phrase: 'Quadra', replacement: 'Qd.' },
		{ enabled: true, phrase: 'Rotunda', replacement: 'Rot.' },
		{ enabled: true, phrase: 'Rua', replacement: 'R.' },
		{ enabled: true, phrase: 'Transversal', replacement: 'Transv.' },
		{ enabled: true, phrase: 'Travessa', replacement: 'Tv.' },
		{ enabled: true, phrase: 'Urbanização', replacement: 'Urb.' },
		{ enabled: true, phrase: 'Vila', replacement: 'Vl.' },
		{ enabled: true, phrase: 'Zona', replacement: 'Zn.' },
		// CTT: Tipo de alojamento
		{ enabled: true, phrase: 'Cave', replacement: 'Cv.' },
		{ enabled: true, phrase: 'Direito', replacement: 'Dto.' },
		{ enabled: true, phrase: 'Esquerdo', replacement: 'Esq.' },
		{ enabled: true, phrase: 'Frente', replacement: 'Ft.' },
		{ enabled: true, phrase: 'Fundos', replacement: 'Fds.' },
		{ enabled: true, phrase: 'Habitação', replacement: 'Hab.' },
		{ enabled: true, phrase: 'Loja', replacement: 'Lj.' },
		{ enabled: true, phrase: 'Rés-do-chão', replacement: 'R/C' },
		{ enabled: true, phrase: 'Sobreloja', replacement: 'Slj.' },
		{ enabled: true, phrase: 'Subcave', replacement: 'Scv.' },
		// CTT: Tipo de porta
		{ enabled: true, phrase: 'Apartamento', replacement: 'Apto.' },
		{ enabled: true, phrase: 'Bloco', replacement: 'Bl.' },
		{ enabled: true, phrase: 'Edifício', replacement: 'Edf.' },
		{ enabled: true, phrase: 'Lote', replacement: 'Lt.' },
		{ enabled: true, phrase: 'Torre', replacement: 'Tr.' },
		{ enabled: true, phrase: 'Vivenda', replacement: 'Vv.' },
		// CTT: Abreviatura de título
		{ enabled: true, phrase: 'Alferes', replacement: 'Alf.' },
		{ enabled: true, phrase: 'Almirante', replacement: 'Alm.' },
		{ enabled: true, phrase: 'Arquiteto', replacement: 'Arq.' },
		{ enabled: true, phrase: 'Brigadeiro', replacement: 'Brig.' },
		{ enabled: true, phrase: 'Capitão', replacement: 'Cap.' },
		{ enabled: true, phrase: 'Comandante', replacement: 'Cmdt.' },
		{ enabled: true, phrase: 'Comendador', replacement: 'Comend.' },
		{ enabled: true, phrase: 'Conselheiro', replacement: 'Cons.' },
		{ enabled: true, phrase: 'Coronel', replacement: 'Cel.' },
		{ enabled: true, phrase: 'Dom', replacement: 'D.' },
		{ enabled: true, phrase: 'Dona', replacement: 'Da.' },
		{ enabled: true, phrase: 'Doutor', replacement: 'Dr.' },
		{ enabled: true, phrase: 'Doutora', replacement: 'Dr.' },
		{ enabled: true, phrase: 'Duque', replacement: 'Dq.' },
		{ enabled: true, phrase: 'Embaixador', replacement: 'Emb.' },
		{ enabled: true, phrase: 'Engenheira', replacement: 'Eng.' },
		{ enabled: true, phrase: 'Engenheiro', replacement: 'Eng.' },
		{ enabled: true, phrase: 'Frei', replacement: 'Fr.' },
		{ enabled: true, phrase: 'General', replacement: 'Gen.' },
		{ enabled: true, phrase: 'Infante', replacement: 'Inf.' },
		{ enabled: true, phrase: 'Marquês', replacement: 'Mq.' },
		{ enabled: true, phrase: 'Presidente', replacement: 'Pres.' },
		{ enabled: true, phrase: 'Professor', replacement: 'Prof.' },
		{ enabled: true, phrase: 'Professora', replacement: 'Prof.' },
		{ enabled: true, phrase: 'São', replacement: 'S.' },
		{ enabled: true, phrase: 'Sargento', replacement: 'Sarg.' },
		{ enabled: true, phrase: 'Tenente', replacement: 'Ten.' },
		{ enabled: true, phrase: 'Visconde', replacement: 'Visc.' },
		// CTT: Diversos
		{ enabled: true, phrase: 'Associação', replacement: 'Ass.' },
		{ enabled: true, phrase: 'Instituto', replacement: 'Inst.' },
		{ enabled: true, phrase: 'Lugar', replacement: 'Lug.' },
		{ enabled: true, phrase: 'Ministério', replacement: 'Min.' },
		{ enabled: true, phrase: 'Ministério', replacement: 'Min.' },
		{ enabled: true, phrase: 'Projetada', replacement: 'Proj.' },
		{ enabled: true, phrase: 'Sala', replacement: 'Sl.' },
		{ enabled: true, phrase: 'Sem Número', replacement: 'S/N' },
		{ enabled: true, phrase: 'Sociedade', replacement: 'Soc.' },
		{ enabled: false, phrase: 'Universidade', replacement: 'Univ.' },
		//
	],

	operational_status: Object.values(StopPropertyOperationalStatus),

	storage_scope: 'stops',

	wheelchair_boarding: Object.values(StopPropertyWheelchairBoarding),

	//
};
