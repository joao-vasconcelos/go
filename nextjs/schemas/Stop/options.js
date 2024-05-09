/* * */

export const StopOptions = {
	//

	/*
   * STORAGE SCOPE
   */

	storage_scope: 'stops',

	/*
   * MINIMUM STOP NAME LENGTH
   */

	min_stop_name_length: 5,

	/*
   * MAXIMUM STOP NAME LENGTH
   */

	max_stop_name_length: 100,

	/*
   * MAXIMUM STOP SHORT NAME LENGTH
   */

	max_stop_short_name_length: 55,

	/*
   * STOP NAME ABBREVIATIONS
   * Lista de abreviaturas recomendadas pelos CTT
   * https://pt.wikipedia.org/wiki/Lista_de_abreviaturas_recomendadas_pelos_CTT
   * Obrigado @ricardojorgerm pela sugestão.
   */

	name_abbreviations: [
		//
		// TML: Street & Place names
		{ phrase: 'Quinta', replacement: 'Qta.', enabled: true },
		{ phrase: 'Largo', replacement: 'Lgo.', enabled: true },
		{ phrase: 'Estrada Municipal', replacement: 'EM', enabled: true },
		{ phrase: 'Estrada Nacional', replacement: 'EN', enabled: true },
		// TML: People
		{ phrase: 'Santo', replacement: 'Sto.', enabled: true },
		{ phrase: 'Santa', replacement: 'Sta.', enabled: true },
		// TML: Facilities
		{ phrase: 'Cooperativa', replacement: 'Coop.', enabled: true },
		{ phrase: 'Câmara Municipal', replacement: 'CM', enabled: true },
		{ phrase: 'Hospital', replacement: 'Hosp.', enabled: false },
		{ phrase: 'Escola', replacement: 'Esc.', enabled: false },
		//
		// CTT: Tipo de artéria
		{ phrase: 'Alameda', replacement: 'Al.', enabled: true },
		{ phrase: 'Avenida', replacement: 'Av.', enabled: true },
		{ phrase: 'Azinhaga', replacement: 'Az.', enabled: true },
		{ phrase: 'Bairro', replacement: 'Br.', enabled: true },
		{ phrase: 'Beco', replacement: 'Bc.', enabled: true },
		{ phrase: 'Calçada', replacement: 'Cc.', enabled: true },
		{ phrase: 'Calçadinha', replacement: 'Ccnh.', enabled: true },
		{ phrase: 'Caminho', replacement: 'Cam.', enabled: true },
		{ phrase: 'Casa', replacement: 'Cs.', enabled: true },
		{ phrase: 'Conjunto', replacement: 'Cj.', enabled: true },
		{ phrase: 'Escadas', replacement: 'Esc.', enabled: true },
		{ phrase: 'Escadinhas', replacement: 'Escnh.', enabled: true },
		{ phrase: 'Estrada', replacement: 'Estr.', enabled: true },
		{ phrase: 'Jardim', replacement: 'Jd.', enabled: true },
		{ phrase: 'Loteamento', replacement: 'Lot.', enabled: true },
		{ phrase: 'Parque', replacement: 'Pq.', enabled: true },
		{ phrase: 'Pátio', replacement: 'Pat.', enabled: true },
		{ phrase: 'Praça', replacement: 'Pc.', enabled: true },
		{ phrase: 'Praceta', replacement: 'Pct.', enabled: true },
		{ phrase: 'Prolongamento', replacement: 'Prl.', enabled: true },
		{ phrase: 'Quadra', replacement: 'Qd.', enabled: true },
		{ phrase: 'Rotunda', replacement: 'Rot.', enabled: true },
		{ phrase: 'Rua', replacement: 'R.', enabled: true },
		{ phrase: 'Transversal', replacement: 'Transv.', enabled: true },
		{ phrase: 'Travessa', replacement: 'Tv.', enabled: true },
		{ phrase: 'Urbanização', replacement: 'Urb.', enabled: true },
		{ phrase: 'Vila', replacement: 'Vl.', enabled: true },
		{ phrase: 'Zona', replacement: 'Zn.', enabled: true },
		// CTT: Tipo de alojamento
		{ phrase: 'Cave', replacement: 'Cv.', enabled: true },
		{ phrase: 'Direito', replacement: 'Dto.', enabled: true },
		{ phrase: 'Esquerdo', replacement: 'Esq.', enabled: true },
		{ phrase: 'Frente', replacement: 'Ft.', enabled: true },
		{ phrase: 'Fundos', replacement: 'Fds.', enabled: true },
		{ phrase: 'Habitação', replacement: 'Hab.', enabled: true },
		{ phrase: 'Loja', replacement: 'Lj.', enabled: true },
		{ phrase: 'Rés-do-chão', replacement: 'R/C', enabled: true },
		{ phrase: 'Sobreloja', replacement: 'Slj.', enabled: true },
		{ phrase: 'Subcave', replacement: 'Scv.', enabled: true },
		// CTT: Tipo de porta
		{ phrase: 'Apartamento', replacement: 'Apto.', enabled: true },
		{ phrase: 'Bloco', replacement: 'Bl.', enabled: true },
		{ phrase: 'Edifício', replacement: 'Edf.', enabled: true },
		{ phrase: 'Lote', replacement: 'Lt.', enabled: true },
		{ phrase: 'Torre', replacement: 'Tr.', enabled: true },
		{ phrase: 'Vivenda', replacement: 'Vv.', enabled: true },
		// CTT: Abreviatura de título
		{ phrase: 'Alferes', replacement: 'Alf.', enabled: true },
		{ phrase: 'Almirante', replacement: 'Alm.', enabled: true },
		{ phrase: 'Arquiteto', replacement: 'Arq.', enabled: true },
		{ phrase: 'Brigadeiro', replacement: 'Brig.', enabled: true },
		{ phrase: 'Capitão', replacement: 'Cap.', enabled: true },
		{ phrase: 'Comandante', replacement: 'Cmdt.', enabled: true },
		{ phrase: 'Comendador', replacement: 'Comend.', enabled: true },
		{ phrase: 'Conselheiro', replacement: 'Cons.', enabled: true },
		{ phrase: 'Coronel', replacement: 'Cel.', enabled: true },
		{ phrase: 'Dom', replacement: 'D.', enabled: true },
		{ phrase: 'Dona', replacement: 'Da.', enabled: true },
		{ phrase: 'Doutor', replacement: 'Dr.', enabled: true },
		{ phrase: 'Doutora', replacement: 'Dr.', enabled: true },
		{ phrase: 'Duque', replacement: 'Dq.', enabled: true },
		{ phrase: 'Embaixador', replacement: 'Emb.', enabled: true },
		{ phrase: 'Engenheira', replacement: 'Eng.', enabled: true },
		{ phrase: 'Engenheiro', replacement: 'Eng.', enabled: true },
		{ phrase: 'Frei', replacement: 'Fr.', enabled: true },
		{ phrase: 'General', replacement: 'Gen.', enabled: true },
		{ phrase: 'Infante', replacement: 'Inf.', enabled: true },
		{ phrase: 'Marquês', replacement: 'Mq.', enabled: true },
		{ phrase: 'Presidente', replacement: 'Pres.', enabled: true },
		{ phrase: 'Professor', replacement: 'Prof.', enabled: true },
		{ phrase: 'Professora', replacement: 'Prof.', enabled: true },
		{ phrase: 'São', replacement: 'S.', enabled: true },
		{ phrase: 'Sargento', replacement: 'Sarg.', enabled: true },
		{ phrase: 'Tenente', replacement: 'Ten.', enabled: true },
		{ phrase: 'Visconde', replacement: 'Visc.', enabled: true },
		// CTT: Diversos
		{ phrase: 'Associação', replacement: 'Ass.', enabled: true },
		{ phrase: 'Instituto', replacement: 'Inst.', enabled: true },
		{ phrase: 'Lugar', replacement: 'Lug.', enabled: true },
		{ phrase: 'Ministério', replacement: 'Min.', enabled: true },
		{ phrase: 'Ministério', replacement: 'Min.', enabled: true },
		{ phrase: 'Projetada', replacement: 'Proj.', enabled: true },
		{ phrase: 'Sala', replacement: 'Sl.', enabled: true },
		{ phrase: 'Sem Número', replacement: 'S/N', enabled: true },
		{ phrase: 'Sociedade', replacement: 'Soc.', enabled: true },
		{ phrase: 'Universidade', replacement: 'Univ.', enabled: false },
		//
	],

	/*
   * OPERATIONAL STATUS
   * 1 = Active
   * 2 = Temporarily Deactivated
   * 3 = Temporarily Activated
   * 4 = Marked for Deletion
   */

	operational_status: ['active', 'provisional', 'seasonal', 'inactive', 'voided'],

	/*
   * HAS POLE
   * 0 = Not Applicable
   * 1 = Does not exist, but should be installed
   * 2 = Exists, but is damaged
   * 3 = Exists and is OK
   */

	has_pole: ['0', '1', '2', '3'],

	/*
   * HAS SHELTER
   * 0 = Not Applicable
   * 1 = Does not exist, but should be installed
   * 2 = Exists, but is damaged
   * 3 = Exists and is OK
   */

	has_shelter: ['0', '1', '2', '3'],

	/*
   * HAS MUPI
   * 0 = Not Applicable
   * 1 = Does not exist, but should be installed
   * 2 = Exists, but is damaged
   * 3 = Exists and is OK
   */

	has_mupi: ['0', '1', '2', '3'],

	/*
   * HAS BENCH
   * 0 = Not Applicable
   * 1 = Does not exist, but should be installed
   * 2 = Exists, but is damaged
   * 3 = Exists and is OK
   */

	has_bench: ['0', '1', '2', '3'],

	/*
   * HAS TRASH BIN
   * 0 = Not Applicable
   * 1 = Does not exist, but should be installed
   * 2 = Exists, but is damaged
   * 3 = Exists and is OK
   */

	has_trash_bin: ['0', '1', '2', '3'],

	/*
   * HAS LIGHTING
   * 0 = No lighting available
   * 1 = Insuficient lighting
   * 2 = Surroundings are visible
   * 3 = Reading is possible and confortable
   */

	has_lighting: ['0', '1', '2', '3'],

	/*
   * HAS ELECTRICITY
   * 0 = No
   * 1 = Yes
   */

	has_electricity: ['0', '1'],

	/*
   * DOCKING BAY TYPE
   * 1 = Simple interaction (no changes to road profile)
   * 2 = Simple docking bay, no road marks
   * 3 = Simple docking bay, with road marks
   * 4 = Road Island
   * 5 = Penisula
   */

	docking_bay_type: ['1', '2', '3', '4', '5'],

	/*
   * HAS STOP SIGN
   * 1 = Does not exist, but should be installed
   * 2 = Exists, but is damaged
   * 3 = Exists and is OK
   */

	has_stop_sign: ['1', '2', '3'],

	/*
   * HAS POLE FRAME
   * 0 = Not Applicable
   * 1 = Does not exist, but should be installed
   * 2 = Exists, but is damaged
   * 3 = Exists and is OK
   */

	has_pole_frame: ['0', '1', '2', '3'],

	//
};