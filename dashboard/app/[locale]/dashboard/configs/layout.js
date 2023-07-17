import { OneFullColumn } from '@/components/Layouts/Layouts';
import AuthGate from '@/components/AuthGate/AuthGate';

export default function Layout({ children }) {
  return (
    <AuthGate scope='configs' permission='admin' redirect>
      <OneFullColumn first={children} />
    </AuthGate>
  );
}
