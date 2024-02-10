'use client';

/* * */

import { StopsExplorerNewStopWizardContextProvider } from '@/contexts/StopsExplorerNewStopWizardContext';
import StopsExplorerLayout from '@/components/StopsExplorerLayout/StopsExplorerLayout';

/* * */

export default function Layout({ children }) {
  return (
    <StopsExplorerNewStopWizardContextProvider>
      <StopsExplorerLayout>{children}</StopsExplorerLayout>
    </StopsExplorerNewStopWizardContextProvider>
  );
}
