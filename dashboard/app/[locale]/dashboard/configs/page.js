'use client';

import { useState } from 'react';
import API from '@/services/API';
import { SimpleGrid, Button } from '@mantine/core';
import Pannel from '@/components/Pannel/Pannel';
import Text from '@/components/Text/Text';
import { Section } from '@/components/Layouts/Layouts';
import notify from '@/services/notify';
import { openConfirmModal } from '@mantine/modals';
import AuthGate from '@/components/AuthGate/AuthGate';
import { useTranslations } from 'next-intl';

export default function Page() {
  //

  //
  // A. Setup variables
  const t = useTranslations('configs');
  const [isImporting, setIsImporting] = useState(false);

  //
  // D. Handle refactors

  const handleSetRouteBasePathAndVariant = async () => {
    openConfirmModal({
      title: <Text size="h2">Set Route Base Path and Variant?</Text>,
      centered: true,
      closeOnClickOutside: true,
      children: <Text size="h3">Are you sure?</Text>,
      labels: { confirm: 'Yes, Set Route Base Path and Variant', cancel: 'Cancel' },
      confirmProps: { color: 'red' },
      onConfirm: async () => {
        try {
          setIsImporting(true);
          notify('fix-calendars', 'loading', 'Loading');
          await API({ service: 'configs/refactors/setRouteBasePathsAndVariants', method: 'GET' });
          notify('fix-calendars', 'success', 'success');
          setIsImporting(false);
        } catch (err) {
          console.log(err);
          notify('fix-calendars', 'error', err.message || 'Error');
          setIsImporting(false);
        }
      },
    });
  };

  //
  // E. Render components

  return (
    <AuthGate scope="configs" permission="admin" redirect>
      <Pannel>
        <Section>
          <Text size="h2">No operations available</Text>
          <SimpleGrid cols={3}>
            <Button onClick={handleSetRouteBasePathAndVariant} color="red">
              Set Route Base Path and Variant
            </Button>
          </SimpleGrid>
        </Section>
      </Pannel>
    </AuthGate>
  );
}
