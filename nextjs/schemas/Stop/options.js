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
   */

  name_abbreviations: [
    // Street & Place names
    { phrase: 'Rua', replacement: 'R.' },
    { phrase: 'Avenida', replacement: 'Av.' },
    { phrase: 'Praça', replacement: 'Pç.' },
    { phrase: 'Estrada', replacement: 'Estr.' },
    { phrase: 'Quinta', replacement: 'Qta.' },
    { phrase: 'Bairro', replacement: 'Bº' },
    { phrase: 'Praceta', replacement: 'Prçt.' },
    { phrase: 'Rotunda', replacement: 'Rot.' },
    { phrase: 'Alameda', replacement: 'Alm.' },
    { phrase: 'Beco', replacement: 'Bc.' },
    { phrase: 'Largo', replacement: 'Lgo.' },
    { phrase: 'Lote', replacement: 'Lt.' },
    // People
    { phrase: 'Dom', replacement: 'D.' },
    { phrase: 'Professor', replacement: 'Prof.' },
    { phrase: 'Engenheiro', replacement: 'Engº.' },
    { phrase: 'Engenheira', replacement: 'Engª.' },
    { phrase: 'Professor', replacement: 'Prof.' },
    { phrase: 'Professora', replacement: 'Profª.' },
    { phrase: 'Doutor', replacement: 'Dr.' },
    { phrase: 'Santo', replacement: 'Sto.' },
    { phrase: 'Santa', replacement: 'Sta.' },
    { phrase: 'General', replacement: 'Gen.' },
    { phrase: 'Almirante', replacement: 'Almr.' },
    // Facilities
    { phrase: 'Associação', replacement: 'Assoc.' },
    { phrase: 'Cooperativa', replacement: 'Coop.' },
    { phrase: 'Câmara Municipal', replacement: 'CM' },
    // { phrase: 'Hospital', replacement: 'Hosp.' },
    // { phrase: 'Escola', replacement: 'Esc.' },
  ],

  /*
   * CURRENT STATUS
   * 1 = Active
   * 2 = Temporarily Deactivated
   * 3 = Temporarily Activated
   * 4 = Marked for Deletion
   */

  current_status: ['1', '2', '3', '4'],

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
