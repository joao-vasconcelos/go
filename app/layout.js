//
// ROOT LAYOUT

// Layouts must accept a children prop.
export const metadata = {
  title: 'Home',
  description: 'Welcome to Next.js',
};

import '../styles/reset.css';
import '../styles/defaults.css';
import { Inter } from 'next/font/google';
import { ServerStylesheet } from './stitches';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
});

// Layouts must accept a children prop.
// This will be populated with nested layouts or pages
export default function RootLayout({ children }) {
  //

  return (
    <html lang='en' className={inter.className}>
      <body>
        <ServerStylesheet>{children}</ServerStylesheet>
      </body>
    </html>
  );
}
