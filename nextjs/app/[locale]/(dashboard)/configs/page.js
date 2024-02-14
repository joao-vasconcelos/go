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
import AuthGate from '@/components/AuthGate/AuthGate';

/* * */

export default function Page() {
  //

  //
  // A. Setup variables

  const [isImporting, setIsImporting] = useState(false);

  //
  // D. Handle actiona

  //   const handleMigrateFares = async () => {
  //     openConfirmModal({
  //       title: <Text size="h2">Migrate Fares?</Text>,
  //       centered: true,
  //       closeOnClickOutside: true,
  //       children: <Text size="h3">Are you sure?</Text>,
  //       labels: { confirm: 'Yes, Migrate Fares', cancel: 'Cancel' },
  //       confirmProps: { color: 'red' },
  //       onConfirm: async () => {
  //         try {
  //           setIsImporting(true);
  //           notify('migrateFares', 'loading', 'Loading');
  //           await API({ service: 'configs/refactors/migrateFares', method: 'GET' });
  //           notify('migrateFares', 'success', 'success');
  //           setIsImporting(false);
  //         } catch (err) {
  //           console.log(err);
  //           notify('migrateFares', 'error', err.message || 'Error');
  //           setIsImporting(false);
  //         }
  //       },
  //     });
  //   };

  //
  // C. Render components

  return (
    <AuthGate scope="configs" permission="admin" redirect>
      <Pannel>
        <Section>
          <Text size="h2">No operations available</Text>
          {/* <SimpleGrid cols={3}>
            <Button onClick={handleMigrateFares} color="red" loading={isImporting}>
              Migrate Fares
            </Button>
          </SimpleGrid> */}
        </Section>
      </Pannel>
    </AuthGate>
  );

  //
}
