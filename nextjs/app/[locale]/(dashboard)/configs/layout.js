/* * */

import { OneFullColumn } from '@/components/Layouts/Layouts';
import AppAuthenticationCheck from '@/components/AppAuthenticationCheck/AppAuthenticationCheck';

/* * */

export default function Layout({ children }) {
  return (
    <AppAuthenticationCheck permissions={[{ scope: 'configs', action: 'admin' }]} redirect>
      <OneFullColumn first={children} />
    </AppAuthenticationCheck>
  );
}
