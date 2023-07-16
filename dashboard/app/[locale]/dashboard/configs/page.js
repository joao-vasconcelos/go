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
  // D. Handle refactors

  const handleRefactorPatternPathTravelTime = async () => {
    openConfirmModal({
      title: <Text size='h2'>Calculate Travel Time for All Patterns?</Text>,
      centered: true,
      closeOnClickOutside: true,
      children: <Text size='h3'>Are you sure?</Text>,
      labels: { confirm: 'Yes, calculate travel times', cancel: 'Cancel' },
      confirmProps: { color: 'red' },
      onConfirm: async () => {
        try {
          setIsImporting(true);
          notify('path-travel-time', 'loading', 'Loading');
          await API({ service: 'configs/refactors/pathTravelTime', method: 'GET' });
          notify('path-travel-time', 'success', 'success');
          setIsImporting(false);
        } catch (err) {
          console.log(err);
          setIsImporting(false);
          notify('path-travel-time', 'error', err.message || 'Error');
        }
      },
    });
  };

  const handleRefactorConvertPatternShapesToMeters = async () => {
    openConfirmModal({
      title: <Text size='h2'>Convert all shapes to meters?</Text>,
      centered: true,
      closeOnClickOutside: true,
      children: <Text size='h3'>Are you sure?</Text>,
      labels: { confirm: 'Yes, convert shapes to meters', cancel: 'Cancel' },
      confirmProps: { color: 'red' },
      onConfirm: async () => {
        try {
          setIsImporting(true);
          notify('convert-shapes-to-meters', 'loading', 'Loading');
          await API({ service: 'configs/refactors/convertShapes', method: 'GET' });
          notify('convert-shapes-to-meters', 'success', 'success');
          setIsImporting(false);
        } catch (err) {
          console.log(err);
          setIsImporting(false);
          notify('convert-shapes-to-meters', 'error', err.message || 'Error');
        }
      },
    });
  };

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

  const handleStartImportStops = async () => {
    openConfirmModal({
      title: <Text size='h2'>Import Stops</Text>,
      centered: true,
      closeOnClickOutside: true,
      children: <Text size='h3'>Are you sure?</Text>,
      labels: { confirm: 'Yes, import Stops', cancel: 'Cancel' },
      confirmProps: { color: 'red' },
      onConfirm: async () => {
        try {
          setIsImporting(true);
          notify('import-stops', 'loading', 'Loading');
          await API({ service: 'configs/imports/stops', method: 'GET' });
          notify('import-stops', 'success', 'success');
          setIsImporting(false);
        } catch (err) {
          console.log(err);
          setIsImporting(false);
          notify('import-stops', 'error', err.message || 'Error');
        }
      },
    });
  };

  const handleStartImportShapes = async () => {
    openConfirmModal({
      title: <Text size='h2'>Import Shapes</Text>,
      centered: true,
      closeOnClickOutside: true,
      children: <Text size='h3'>Are you sure?</Text>,
      labels: { confirm: 'Yes, import Shapes', cancel: 'Cancel' },
      confirmProps: { color: 'red' },
      onConfirm: async () => {
        try {
          setIsImporting(true);
          notify('import-stops', 'loading', 'Loading');
          await API({ service: 'configs/imports/shapes', method: 'GET' });
          notify('import-stops', 'success', 'success');
          setIsImporting(false);
        } catch (err) {
          console.log(err);
          setIsImporting(false);
          notify('import-stops', 'error', err.message || 'Error');
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

  const handleDeleteRoutes = async () => {
    openConfirmModal({
      title: <Text size='h2'>Delete Routes</Text>,
      centered: true,
      closeOnClickOutside: true,
      children: <Text size='h3'>Are you sure?</Text>,
      labels: { confirm: 'Yes, delete all Routes', cancel: 'Cancel' },
      confirmProps: { color: 'red' },
      onConfirm: async () => {
        try {
          setIsImporting(true);
          notify('delete-routes', 'loading', 'Loading');
          await API({ service: 'configs/deletes/routes', method: 'GET' });
          notify('delete-routes', 'success', 'success');
          setIsImporting(false);
        } catch (err) {
          console.log(err);
          setIsImporting(false);
          notify('delete-routes', 'error', err.message || 'Error');
        }
      },
    });
  };

  const handleDeletePatterns = async () => {
    openConfirmModal({
      title: <Text size='h2'>Delete Patterns</Text>,
      centered: true,
      closeOnClickOutside: true,
      children: <Text size='h3'>Are you sure?</Text>,
      labels: { confirm: 'Yes, delete all Patterns', cancel: 'Cancel' },
      confirmProps: { color: 'red' },
      onConfirm: async () => {
        try {
          setIsImporting(true);
          notify('delete-patterns', 'loading', 'Loading');
          await API({ service: 'configs/deletes/patterns', method: 'GET' });
          notify('delete-patterns', 'success', 'success');
          setIsImporting(false);
        } catch (err) {
          console.log(err);
          setIsImporting(false);
          notify('delete-patterns', 'error', err.message || 'Error');
        }
      },
    });
  };

  const handleDeleteCalendars = async () => {
    openConfirmModal({
      title: <Text size='h2'>Delete Calendars</Text>,
      centered: true,
      closeOnClickOutside: true,
      children: <Text size='h3'>Are you sure?</Text>,
      labels: { confirm: 'Yes, delete all Calendars', cancel: 'Cancel' },
      confirmProps: { color: 'red' },
      onConfirm: async () => {
        try {
          setIsImporting(true);
          notify('delete-calendars', 'loading', 'Loading');
          await API({ service: 'configs/deletes/calendars', method: 'GET' });
          notify('delete-calendars', 'success', 'success');
          setIsImporting(false);
        } catch (err) {
          console.log(err);
          setIsImporting(false);
          notify('delete-calendars', 'error', err.message || 'Error');
        }
      },
    });
  };

  const handleDeleteStops = async () => {
    openConfirmModal({
      title: <Text size='h2'>Delete Stops</Text>,
      centered: true,
      closeOnClickOutside: true,
      children: <Text size='h3'>Are you sure?</Text>,
      labels: { confirm: 'Yes, delete all Stops', cancel: 'Cancel' },
      confirmProps: { color: 'red' },
      onConfirm: async () => {
        try {
          setIsImporting(true);
          notify('delete-stops', 'loading', 'Loading');
          await API({ service: 'configs/deletes/stops', method: 'GET' });
          notify('delete-stops', 'success', 'success');
          setIsImporting(false);
        } catch (err) {
          console.log(err);
          setIsImporting(false);
          notify('delete-stops', 'error', err.message || 'Error');
        }
      },
    });
  };

  //
  // E. Render components

  return (
    <Pannel>
      <Section>
        <Text size='h2'>Imports</Text>
        <SimpleGrid cols={4}>
          <Button onClick={handleStartImportLines}>Import Lines</Button>
          <Button onClick={handleStartImportRoutes}>Import Routes</Button>
          <Button onClick={handleStartImportPatterns}>Import Patterns & Calendars</Button>
          <Button onClick={handleStartImportStops}>Import Stops</Button>
          <Button onClick={handleStartImportShapes}>Import Shapes</Button>
        </SimpleGrid>
      </Section>
      <Section>
        <Text size='h2'>Refactors</Text>
        <SimpleGrid cols={4}>
          <Button onClick={handleRefactorPatternPathTravelTime}>Update Travel Times</Button>
          <Button onClick={handleRefactorConvertPatternShapesToMeters}>Convert Shapes to Meters</Button>
        </SimpleGrid>
      </Section>
      <Section>
        <Text size='h2'>Deletes</Text>
        <SimpleGrid cols={5}>
          <Button onClick={handleDeleteLines} color='red'>
            Delete All Lines
          </Button>
          <Button onClick={handleDeleteRoutes} color='red'>
            Delete All Routes
          </Button>
          <Button onClick={handleDeletePatterns} color='red'>
            Delete All Patterns
          </Button>
          <Button onClick={handleDeleteCalendars} color='red'>
            Delete All Calendars
          </Button>
          <Button onClick={handleDeleteStops} color='red'>
            Delete All Stops
          </Button>
        </SimpleGrid>
      </Section>
    </Pannel>
  );
}
