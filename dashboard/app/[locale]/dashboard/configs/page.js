'use client';

import useSWR from 'swr';
import { useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { useRouter } from 'next-intl/client';
import { useForm, yupResolver } from '@mantine/form';
import API from '@/services/API';
import { Validation as AgencyValidation } from '@/schemas/Agency/validation';
import { Default as AgencyDefault } from '@/schemas/Agency/default';
import { Tooltip, Select, SimpleGrid, TextInput, ActionIcon, Button } from '@mantine/core';
import { IconTrash } from '@tabler/icons-react';
import Pannel from '@/components/Pannel/Pannel';
import Text from '@/components/Text/Text';
import { Section } from '@/components/Layouts/Layouts';
import AutoSave from '@/components/AutoSave/AutoSave';
import notify from '@/services/notify';
import { openConfirmModal } from '@mantine/modals';
import { useTranslations } from 'next-intl';
import { useSession } from 'next-auth/react';
import AuthGate, { isAllowed } from '@/components/AuthGate/AuthGate';
import { Yeseva_One } from 'next/font/google';

export default function Page() {
  //

  //
  // A. Setup variables
  const [isImporting, setIsImporting] = useState(false);

  //
  // B. Fetch data

  //
  // C. Setup form

  //
  // D. Handle imports

  const handleStartImportLines = async () => {
    openConfirmModal({
      title: <Text size='h2'>Import Lines</Text>,
      centered: true,
      closeOnClickOutside: true,
      children: <Text size='h3'>Are you sure?</Text>,
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
          setIsImporting(false);
          notify('import-lines', 'error', err.message || 'Error');
        }
      },
    });
  };

  const handleStartImportRoutes = async () => {
    openConfirmModal({
      title: <Text size='h2'>Import Routes</Text>,
      centered: true,
      closeOnClickOutside: true,
      children: <Text size='h3'>Are you sure?</Text>,
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
          setIsImporting(false);
          notify('import-routes', 'error', err.message || 'Error');
        }
      },
    });
  };

  const handleStartImportPatterns = async () => {
    openConfirmModal({
      title: <Text size='h2'>Import Patterns</Text>,
      centered: true,
      closeOnClickOutside: true,
      children: <Text size='h3'>Are you sure?</Text>,
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
          setIsImporting(false);
          notify('import-patterns', 'error', err.message || 'Error');
        }
      },
    });
  };

  //
  // D. Handle deletes

  const handleDeleteLines = async () => {
    openConfirmModal({
      title: <Text size='h2'>Delete Lines</Text>,
      centered: true,
      closeOnClickOutside: true,
      children: <Text size='h3'>Are you sure?</Text>,
      labels: { confirm: 'Yes, delete all Lines', cancel: 'Cancel' },
      confirmProps: { color: 'red' },
      onConfirm: async () => {
        try {
          setIsImporting(true);
          notify('delete-lines', 'loading', 'Loading');
          await API({ service: 'configs/deletes/lines', method: 'GET' });
          notify('delete-lines', 'success', 'success');
          setIsImporting(false);
        } catch (err) {
          console.log(err);
          setIsImporting(false);
          notify('delete-lines', 'error', err.message || 'Error');
        }
      },
    });
  };

  const handleDeleteRoutes = async () => {};

  const handleDeletePatterns = async () => {};

  //
  // E. Render components

  return (
    <Pannel>
      <Section>
        <Text size='h2'>Imports</Text>
        <SimpleGrid cols={3}>
          <Button onClick={handleStartImportLines}>Import Lines</Button>
          <Button onClick={handleStartImportRoutes}>Import Routes</Button>
          <Button onClick={handleStartImportPatterns}>Import Patterns</Button>
        </SimpleGrid>
        <SimpleGrid cols={3}>
          <Button onClick={handleDeleteLines} color='red'>
            Delete All Lines
          </Button>
          <Button onClick={handleDeleteRoutes} color='red' disabled>
            Delete All Routes
          </Button>
          <Button onClick={handleDeletePatterns} color='red' disabled>
            Delete All Patterns
          </Button>
        </SimpleGrid>
      </Section>
    </Pannel>
  );
}
