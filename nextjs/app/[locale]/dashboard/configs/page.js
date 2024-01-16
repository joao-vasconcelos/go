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

  //   const handleModifyOfferForSpecialCalendars = async () => {
  //     openConfirmModal({
  //       title: <Text size="h2">Modify Offer for Special Calendars (Carnaval)?</Text>,
  //       centered: true,
  //       closeOnClickOutside: true,
  //       children: <Text size="h3">Are you sure?</Text>,
  //       labels: { confirm: 'Yes, Modify Offer for Special Calendars (Carnaval)', cancel: 'Cancel' },
  //       confirmProps: { color: 'red' },
  //       onConfirm: async () => {
  //         try {
  //           setIsImporting(true);
  //           notify('replace-calendar', 'loading', 'Loading');
  //           await API({ service: 'configs/refactors/modifyOfferForSpecialCalendars', method: 'GET' });
  //           notify('replace-calendar', 'success', 'success');
  //           setIsImporting(false);
  //         } catch (err) {
  //           console.log(err);
  //           notify('replace-calendar', 'error', err.message || 'Error');
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
            <Button onClick={handleModifyOfferForSpecialCalendars} color="red" loading={isImporting}>
              Modify Offer for Special Calendars (Carnaval)
            </Button>
          </SimpleGrid> */}
        </Section>
      </Pannel>
    </AuthGate>
  );

  //
}
