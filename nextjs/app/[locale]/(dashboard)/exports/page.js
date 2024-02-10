/* * */

import AuthGate from '@/components/AuthGate/AuthGate';
import { TwoEvenColumns } from '@/components/Layouts/Layouts';
import ExportsExplorerQueue from '@/components/ExportsExplorerQueue/ExportsExplorerQueue';
import ExportsExplorerForm from '@/components/ExportsExplorerForm/ExportsExplorerForm';

/* * */

export default function Page() {
  return (
    <AuthGate scope="exports" permission="view" redirect>
      <TwoEvenColumns first={<ExportsExplorerQueue />} second={<ExportsExplorerForm />} />
    </AuthGate>
  );
}
