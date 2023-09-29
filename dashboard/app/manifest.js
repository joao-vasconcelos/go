export default function manifest() {
  return {
    name: 'GO | Gestor de Oferta',
    short_name: 'Gestor de Oferta',
    description: 'Construção da rede Carris Metropolitana',
    start_url: '/',
    theme_color: '#000000',
    background_color: '#000000',
    display: 'standalone',
    icons: [
      {
        src: '/icon.svg',
        type: 'image/svg+xml',
        sizes: '512x512',
      },
      {
        src: 'icon1.png',
        type: 'image/png',
        sizes: '192x192',
      },
      {
        src: 'icon2.png',
        type: 'image/png',
        sizes: '512x512',
      },
    ],
  };
}
