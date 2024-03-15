/* * */

export const StopOptions = {
  //

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

  //
};
