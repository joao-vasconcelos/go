/* * */

import AuthGate from '@/components/AuthGate/AuthGate';
import { OneFullColumn } from '@/components/Layouts/Layouts';
import ExportsExplorerForm from '@/components/ExportsExplorerForm/ExportsExplorerForm';

/* * */

export default function Page() {
  return (
    <AuthGate scope="configs" permission="admin" redirect>
      <OneFullColumn first={<ExportsExplorerForm />} />
    </AuthGate>
  );
}
