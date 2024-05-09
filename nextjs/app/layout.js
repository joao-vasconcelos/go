/* * */

import '@/styles/reset.css';
import '@/styles/defaults.css';
import '@/styles/colors.css';

/* * */

import Providers from './providers';
import { Inter } from 'next/font/google';
import { ColorSchemeScript } from '@mantine/core';

/* * */

const inter = Inter({
	weight: ['400', '500', '600', '700', '800'],
	subsets: ['latin'],
	variable: '--font-inter',
	display: 'swap',
});

export const metadata = {
	metadataBase: process.env.VERCEL_URL ? new URL(`https://${process.env.VERCEL_URL}`) : new URL(`http://0.0.0.0:${process.env.PORT || 3000}`),
	title: 'GO | Gestor de Oferta',
	description: 'Construção da rede Carris Metropolitana',
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