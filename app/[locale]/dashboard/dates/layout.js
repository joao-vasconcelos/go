'use client';

import { OneFullColumn } from '../../../../components/Layouts/Layouts';
import AuthGate from '../../../../components/AuthGate/AuthGate';

export default function Layout({ children }) {
  return (
    <AuthGate permission='calendars_view' redirect>
      <OneFullColumn first={children} />
    </AuthGate>
  );
}
