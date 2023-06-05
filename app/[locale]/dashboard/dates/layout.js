import { OneFullColumn } from '@/components/Layouts/Layouts';
import AuthGate from '@/components/AuthGate/AuthGate';

export default function Layout({ children }) {
  return (
    <AuthGate scope='dates' permission='view' redirect>
      <OneFullColumn first={children} />
    </AuthGate>
  );
}
