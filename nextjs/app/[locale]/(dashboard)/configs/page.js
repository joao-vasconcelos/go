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

  const handleImportAfetacao = async () => {
    openConfirmModal({
      title: <Text size="h2">Import Afetacao A1?</Text>,
      centered: true,
      closeOnClickOutside: true,
      children: <Text size="h3">Are you sure?</Text>,
      labels: { confirm: 'Yes, Import Afetacao A1', cancel: 'Cancel' },
      confirmProps: { color: 'red' },
      onConfirm: async () => {
        try {
          setIsImporting(true);
          notify('afetacao', 'loading', 'Loading');
          await API({ service: 'configs/imports/afetacao', method: 'GET' });
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

  const handleSetupFares = async () => {
    openConfirmModal({
      title: <Text size="h2">Setup Fares?</Text>,
      centered: true,
      closeOnClickOutside: true,
      children: <Text size="h3">Are you sure?</Text>,
      labels: { confirm: 'Yes, Setup Fares', cancel: 'Cancel' },
      confirmProps: { color: 'red' },
      onConfirm: async () => {
        try {
          setIsImporting(true);
          notify('setupFares', 'loading', 'Loading');
          await API({ service: 'configs/refactors/setupFares', method: 'GET' });
          notify('setupFares', 'success', 'success');
          setIsImporting(false);
        } catch (err) {
          console.log(err);
          notify('setupFares', 'error', err.message || 'Error');
          setIsImporting(false);
        }
      },
    });
  };

  const handleMigrateUsers = async () => {
    openConfirmModal({
      title: <Text size="h2">Migrate Users?</Text>,
      centered: true,
      closeOnClickOutside: true,
      children: <Text size="h3">Are you sure?</Text>,
      labels: { confirm: 'Yes, Migrate Users', cancel: 'Cancel' },
      confirmProps: { color: 'red' },
      onConfirm: async () => {
        try {
          setIsImporting(true);
          notify('migrateUsers', 'loading', 'Loading');
          await API({ service: 'configs/refactors/migrateUsers', method: 'GET' });
          notify('migrateUsers', 'success', 'success');
          setIsImporting(false);
        } catch (err) {
          console.log(err);
          notify('migrateUsers', 'error', err.message || 'Error');
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
            <Button onClick={handleImportAfetacao} color="red" loading={isImporting}>
              Import Afetacao A1
            </Button>
            <Button onClick={handleSetupFares} color="red" loading={isImporting}>
              Setup Fares
            </Button>
            <Button onClick={handleMigrateUsers} color="red" loading={isImporting}>
              Migrate Users
            </Button>
          </SimpleGrid>
        </Section>
      </Pannel>
    </AppAuthenticationCheck>
  );

  //
}
