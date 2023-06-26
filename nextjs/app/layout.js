//
// ROOT LAYOUT

import '../styles/reset.css';
import '../styles/defaults.css';
import '../styles/colors.css';
import { Inter } from 'next/font/google';
import Providers from './providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Home',
  description: 'Welcome to Next.js',
};

export default function RootLayout({ children }) {
  return (
    <html className={inter.className}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}