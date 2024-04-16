'use client';

/* * */

import { useState } from 'react';
import API from '@/services/API';
import { SimpleGrid, Button } from '@mantine/core';
import Pannel from '@/components/Pannel/Pannel';
import Text from '@/components/Text/Text';
import { Section } from '@/components/Layouts/Layouts';
import notify from '@/services/notify';
import { openConfirmModal } from '@mantine/modals';
import AppAuthenticationCheck from '@/components/AppAuthenticationCheck/AppAuthenticationCheck';

/* * */

export default function Page() {
  //

  //
  // A. Setup variables

  const [isImporting, setIsImporting] = useState(false);

  //
  // D. Handle actiona

  const handleDeleteDeletedStop = async () => {
    openConfirmModal({
      title: <Text size="h2">Delete Deleted Stop?</Text>,
      centered: true,
      closeOnClickOutside: true,
      children: <Text size="h3">Are you sure?</Text>,
      labels: { confirm: 'Yes, Delete Deleted Stop', cancel: 'Cancel' },
      confirmProps: { color: 'red' },
      onConfirm: async () => {
        try {
          setIsImporting(true);
          notify('deleteDeletedStop', 'loading', 'Loading');
          await API({ service: 'configs/refactors/deleteDeletedStop', method: 'GET' });
          notify('deleteDeletedStop', 'success', 'success');
          setIsImporting(false);
        } catch (err) {
          console.log(err);
          notify('deleteDeletedStop', 'error', err.message || 'Error');
          setIsImporting(false);
        }
      },
    });
  };

  //
  // C. Render components

  return (
    <AppAuthenticationCheck permissions={[{ scope: 'configs', action: 'admin' }]} redirect>
      <Pannel>
        <Section>
          <Text size="h2">No operations available</Text>
          <SimpleGrid cols={3}>
            <Button onClick={handleDeleteDeletedStop} color="red" loading={isImporting}>
              Delete Deleted Stop
            </Button>
          </SimpleGrid>
        </Section>
      </Pannel>
    </AppAuthenticationCheck>
  );

  //
}
