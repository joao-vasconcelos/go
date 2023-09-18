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

  const handleImportLines = async () => {
    openConfirmModal({
      title: <Text size="h2">Import Lines?</Text>,
      centered: true,
      closeOnClickOutside: true,
      children: <Text size="h3">Are you sure?</Text>,
      labels: { confirm: 'Yes, import Lines', cancel: 'Cancel' },
      confirmProps: { color: 'red' },
      onConfirm: async () => {
        try {
          setIsImporting(true);
          notify('import-lines', 'loading', 'Loading');
          await API({ service: 'configs/imports/lines', method: 'GET' });
          notify('import-lines', 'success', 'success');
          setIsImporting(false);
        } catch (err) {
          console.log(err);
          notify('import-lines', 'error', err.message || 'Error');
          setIsImporting(false);
        }
      },
    });
  };

  const handleImportRoutes = async () => {
    openConfirmModal({
      title: <Text size="h2">Import Routes?</Text>,
      centered: true,
      closeOnClickOutside: true,
      children: <Text size="h3">Are you sure?</Text>,
      labels: { confirm: 'Yes, import Routes', cancel: 'Cancel' },
      confirmProps: { color: 'red' },
      onConfirm: async () => {
        try {
          setIsImporting(true);
          notify('import-routes', 'loading', 'Loading');
          await API({ service: 'configs/imports/routes', method: 'GET' });
          notify('import-routes', 'success', 'success');
          setIsImporting(false);
        } catch (err) {
          console.log(err);
          notify('import-routes', 'error', err.message || 'Error');
          setIsImporting(false);
        }
      },
    });
  };

  const handleImportPatterns = async () => {
    openConfirmModal({
      title: <Text size="h2">Import Patterns?</Text>,
      centered: true,
      closeOnClickOutside: true,
      children: <Text size="h3">Are you sure?</Text>,
      labels: { confirm: 'Yes, import Patterns', cancel: 'Cancel' },
      confirmProps: { color: 'red' },
      onConfirm: async () => {
        try {
          setIsImporting(true);
          notify('import-patterns', 'loading', 'Loading');
          await API({ service: 'configs/imports/patterns', method: 'GET' });
          notify('import-patterns', 'success', 'success');
          setIsImporting(false);
        } catch (err) {
          console.log(err);
          notify('import-patterns', 'error', err.message || 'Error');
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
            <Button onClick={handleImportLines} color="red">
              Import Lines
            </Button>
            <Button onClick={handleImportRoutes} color="red">
              Import Routes
            </Button>
            <Button onClick={handleImportPatterns} color="red">
              Import Patterns
            </Button>
          </SimpleGrid>
        </Section>
      </Pannel>
    </AuthGate>
  );
}
