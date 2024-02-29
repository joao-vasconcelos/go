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

  const handleModifyDatesTypes = async () => {
    openConfirmModal({
      title: <Text size="h2">Modify Dates Types?</Text>,
      centered: true,
      closeOnClickOutside: true,
      children: <Text size="h3">Are you sure?</Text>,
      labels: { confirm: 'Yes, Modify Dates Types', cancel: 'Cancel' },
      confirmProps: { color: 'red' },
      onConfirm: async () => {
        try {
          setIsImporting(true);
          notify('afetacao', 'loading', 'Loading');
          await API({ service: 'configs/refactors/modifyDatesTypes', method: 'GET' });
          notify('afetacao', 'success', 'success');
          setIsImporting(false);
        } catch (err) {
          console.log(err);
          notify('afetacao', 'error', err.message || 'Error');
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
            <Button onClick={handleModifyDatesTypes} color="red" loading={isImporting}>
              Modify Dates Types
            </Button>
          </SimpleGrid>
        </Section>
      </Pannel>
    </AppAuthenticationCheck>
  );

  //
}
