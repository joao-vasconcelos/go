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

  //   const handleStandardizeCalendars = async () => {
  //     openConfirmModal({
  //       title: <Text size="h2">Standardize Calendars (A1)?</Text>,
  //       centered: true,
  //       closeOnClickOutside: true,
  //       children: <Text size="h3">Are you sure?</Text>,
  //       labels: { confirm: 'Yes, Standardize Calendars (A1)', cancel: 'Cancel' },
  //       confirmProps: { color: 'red' },
  //       onConfirm: async () => {
  //         try {
  //           setIsImporting(true);
  //           notify('standardizeCalendars', 'loading', 'Loading');
  //           await API({ service: 'configs/refactors/standardizeCalendars', method: 'GET' });
  //           notify('standardizeCalendars', 'success', 'success');
  //           setIsImporting(false);
  //         } catch (err) {
  //           console.log(err);
  //           notify('standardizeCalendars', 'error', err.message || 'Error');
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
            <Button onClick={handleStandardizeCalendars} color="red" loading={isImporting}>
              Standardize Calendars (A1)
            </Button>
          </SimpleGrid> */}
        </Section>
      </Pannel>
    </AuthGate>
  );

  //
}