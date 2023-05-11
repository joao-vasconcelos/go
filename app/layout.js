//
// ROOT LAYOUT

export const metadata = {
  title: 'Home',
  description: 'Welcome to Next.js',
};

import '../styles/reset.css';
import '../styles/defaults.css';
import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
});

export default function RootLayout({ children }) {
  return (
    <html className={inter.className}>
      <body>{children}</body>
    </html>
  );
}
