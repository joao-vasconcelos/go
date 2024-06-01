/* * */

import '@/styles/reset.css';
import '@/styles/defaults.css';
import '@/styles/colors.css';

/* * */

import { ColorSchemeScript } from '@mantine/core';
import { Inter } from 'next/font/google';

import Providers from './providers';

/* * */

const inter = Inter({
	display: 'swap',
	subsets: ['latin'],
	variable: '--font-inter',
	weight: ['400', '500', '600', '700', '800'],
});

export const metadata = {
	description: 'Construção da rede Carris Metropolitana',
	metadataBase: process.env.VERCEL_URL ? new URL(`https://${process.env.VERCEL_URL}`) : new URL(`http://0.0.0.0:${process.env.PORT || 3000}`),
	title: 'GO | Gestor de Oferta',
};

/* * */

export default function RootLayout({ children }) {
	return (
		<html className={inter.variable}>
			<head>
				<ColorSchemeScript />
			</head>
			<body>
				<Providers>{children}</Providers>
			</body>
		</html>
	);
}
