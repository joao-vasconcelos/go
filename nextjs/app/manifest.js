/* * */

export default function manifest() {
	return {
		background_color: '#ffffff',
		description: 'Construção da rede Carris Metropolitana',
		display: 'standalone',
		icons: [
			{
				sizes: '192x192',
				src: '/android-chrome-192x192.png',
				type: 'image/png',
			},
			{
				sizes: '512x512',
				src: '/android-chrome-512x512.png',
				type: 'image/png',
			},
		],
		name: 'GO | Gestor de Oferta',
		short_name: 'Gestor de Oferta',
		start_url: '/',
		theme_color: '#ffffff',
	};
}
