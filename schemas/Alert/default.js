/* * */
/* DOCUMENT TYPE: FARE */
/* Explanation needed. */
/* * */

/* * */
/* A. Default Values */
export const Default = {
  published: false,
  title: '',
  start_time: '',
  end_time: '',
  municipalities: [],
  lines: [],
  stops: [],
  cause: null,
  consequence: null,
  description: '',
  image: [],
  link: '',
  user: null,
};

const example = {
  id: 'CarrisMetropolitanaGTFSAlerts-5239',
  alert: {
    active_period: {
      start: 1687824000,
      end: 1687910400,
    },
    informed_entity: [
      {
        municipality_id: '18',
      },
      {
        route_id: '2325_0',
      },
      {
        route_id: '2537_0',
      },
      {
        route_id: '2538_0',
      },
      {
        route_id: '2796_0',
      },
      {
        route_id: '2797_0',
      },
      {
        stop_id: '180735',
      },
      {
        stop_id: '180736',
      },
    ],
    cause: 'CONSTRUCTION',
    effect: 'DETOUR',
    url: '',
    pid: 'https://www.carrismetropolitana.pt/alert/5239/',
    header_text: [
      {
        translation: {
          language: 'pt',
          text: 'Vila Franca de Xira: desvio das linhas 2325, 2537, 2538, 2796 e 2797',
        },
      },
    ],
    description_text: [
      {
        translation: {
          language: 'pt',
          text: 'Durante o dia 27 de junho a Rua Miguel Torga, na Quinta da Maranhota, estará parcialmente cortada para obras entre os cruzamentos desta com Av. Carlos Arrojado e R. Olival Santo. Desta forma, a paragem R Miguel Torga (Qta Maranhota) ficará sem serviço das linhas 2325, 2537, 2538, 2796 e 2797 durante este dia. ',
        },
      },
    ],
    image: [
      {
        localized_image: {
          language: 'pt',
          media_type: '',
          url: '',
        },
      },
    ],
    style: {
      icon_url: 'https://www.carrismetropolitana.pt/wp-content/themes/carrismetropolitana/images/alerts/icon-alert-DETOUR.svg',
    },
  },
};
