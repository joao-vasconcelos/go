export default function manifest() {
  return {
    name: 'GO | Gestor de Oferta',
    short_name: 'Gestor de Oferta',
    description: 'Construção da rede Carris Metropolitana',
    start_url: '/',
    theme_color: '#ffffff',
    background_color: '#ffffff',
    display: 'standalone',
    icons: [
      {
        src: '/icon.svg',
        type: 'image/svg+xml',
        sizes: '512x512',
      },
      {
        src: 'icon-32.png',
        type: 'image/png',
        sizes: '32x32',
      },
      {
        src: 'icon-64.png',
        type: 'image/png',
        sizes: '64x64',
      },
      {
        src: 'icon-192.png',
        type: 'image/png',
        sizes: '192x192',
      },
      {
        src: 'icon-512.png',
        type: 'image/png',
        sizes: '512x512',
      },
    ],
  };
}
