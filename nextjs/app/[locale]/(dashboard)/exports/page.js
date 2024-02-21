/* * */

import { TwoEvenColumns } from '@/components/Layouts/Layouts';
import ExportsExplorerQueue from '@/components/ExportsExplorerQueue/ExportsExplorerQueue';
import ExportsExplorerForm from '@/components/ExportsExplorerForm/ExportsExplorerForm';
import AppAuthenticationCheck from '@/components/AppAuthenticationCheck/AppAuthenticationCheck';

/* * */

export default function Page() {
  return (
    <AppAuthenticationCheck permissions={[{ scope: 'exports', action: 'navigate' }]} redirect>
      <TwoEvenColumns first={<ExportsExplorerQueue />} second={<ExportsExplorerForm />} />
    </AppAuthenticationCheck>
  );
}
