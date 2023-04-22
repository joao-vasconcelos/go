//
// ROOT LAYOUT

// Layouts must accept a children prop.
export const metadata = {
  title: 'Home',
  description: 'Welcome to Next.js',
};

import '../styles/reset.css';
import { ServerStylesheet } from './stitches';

// Layouts must accept a children prop.
// This will be populated with nested layouts or pages
export default function RootLayout({ children }) {
  //

  return (
    <html lang='en'>
      <body>
        <ServerStylesheet>{children}</ServerStylesheet>
      </body>
    </html>
  );
}
