/* * */

import { OneFullColumn } from '@/components/Layouts/Layouts';
import AppAuthenticationCheck from '@/components/AppAuthenticationCheck/AppAuthenticationCheck';

/* * */

export default function Layout({ children }) {
  return (
    <AppAuthenticationCheck permissions={[{ scope: 'dates', action: 'navigate' }]} redirect>
      <OneFullColumn first={children} />
    </AppAuthenticationCheck>
  );
}
