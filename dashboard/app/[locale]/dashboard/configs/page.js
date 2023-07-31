'use client';

import { useState } from 'react';
import API from '@/services/API';
import { SimpleGrid, Button, Divider } from '@mantine/core';
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
  // B. Fetch data

  //
  // C. Setup form

  //
  // D. Handle safe updates

  const handleUpdateAllStops = async () => {
    openConfirmModal({
      title: <Text size='h2'>{t('operations.update_stops.title')}</Text>,
      centered: true,
      closeOnClickOutside: true,
      children: <Text size='h3'>{t('operations.update_stops.description')}</Text>,
      labels: { confirm: t('operations.update_stops.confirm'), cancel: t('operations.update_stops.cancel') },
      onConfirm: async () => {
        try {
          setIsImporting(true);
          notify('update-stops', 'loading', t('operations.update_stops.loading'));
          await API({ service: 'configs/updates/stops', method: 'GET' });
          notify('update-stops', 'success', t('operations.update_stops.success'));
          setIsImporting(false);
        } catch (err) {
          console.log(err);
          setIsImporting(false);
          notify('update-stops', 'error', err.message || t('operations.update_stops.error'));
        }
      },
    });
  };

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
          notify('path-travel-time', 'loading', 'Loading');
          await API({ service: 'configs/refactors/pathTravelTime', method: 'GET' });
          notify('path-travel-time', 'success', 'success');
        } catch (err) {
          console.log(err);
          notify('path-travel-time', 'error', err.message || 'Error');
        }
      },
    });
  };

  const handleRefactorPatternPathPresetVelocity = async () => {
    openConfirmModal({
      title: <Text size='h2'>Update pattern preset velocities?</Text>,
      centered: true,
      closeOnClickOutside: true,
      children: <Text size='h3'>Are you sure?</Text>,
      labels: { confirm: 'Yes, update velocities', cancel: 'Cancel' },
      confirmProps: { color: 'red' },
      onConfirm: async () => {
        try {
          setIsImporting(true);
          notify('update-preset-velocities', 'loading', 'Loading');
          await API({ service: 'configs/refactors/setPathVelocity', method: 'GET' });
          notify('update-preset-velocities', 'success', 'success');
          setIsImporting(false);
        } catch (err) {
          console.log(err);
          setIsImporting(false);
          notify('update-preset-velocities', 'error', err.message || 'Error');
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
          notify('import-shapes', 'loading', 'Loading');
          await API({ service: 'configs/imports/shapes', method: 'GET' });
          notify('import-shapes', 'success', 'success');
          setIsImporting(false);
        } catch (err) {
          console.log(err);
          setIsImporting(false);
          notify('import-shapes', 'error', err.message || 'Error');
        }
      },
    });
  };

  const handleStartImportAlerts = async () => {
    openConfirmModal({
      title: <Text size='h2'>Import Alerts</Text>,
      centered: true,
      closeOnClickOutside: true,
      children: <Text size='h3'>Are you sure?</Text>,
      labels: { confirm: 'Yes, import Alerts', cancel: 'Cancel' },
      confirmProps: { color: 'red' },
      onConfirm: async () => {
        try {
          setIsImporting(true);
          notify('import-alerts', 'loading', 'Loading');
          await API({ service: 'configs/imports/alerts', method: 'GET' });
          notify('import-alerts', 'success', 'success');
          setIsImporting(false);
        } catch (err) {
          console.log(err);
          setIsImporting(false);
          notify('import-alerts', 'error', err.message || 'Error');
        }
      },
    });
  };

  //
  // E. Render components

  return (
    <AuthGate scope='configs' permission='admin' redirect>
      <Pannel>
        <Section>
          <div>
            <Text size='h2'>{t('sections.safe_updates.title')}</Text>
            <Text size='h4'>{t('sections.safe_updates.description')}</Text>
          </div>
          <SimpleGrid cols={3}>
            <Button onClick={handleUpdateAllStops} color='green' disabled={isImporting}>
              {t('operations.update_stops.title')}
            </Button>
          </SimpleGrid>
        </Section>

        <Divider />

        <Section>
          <Text size='h2'>Imports</Text>
          <SimpleGrid cols={4}>
            <Button onClick={handleStartImportLines} disabled={isImporting}>
              Import Lines
            </Button>
            <Button onClick={handleStartImportRoutes} disabled={isImporting}>
              Import Routes
            </Button>
            <Button onClick={handleStartImportPatterns} disabled={isImporting}>
              Import Patterns & Calendars
            </Button>
            <Button onClick={handleStartImportShapes} disabled={isImporting}>
              Import Shapes
            </Button>
            <Button onClick={handleStartImportAlerts} disabled={isImporting}>
              Import Alerts
            </Button>
          </SimpleGrid>
        </Section>
        <Section>
          <Text size='h2'>Refactors</Text>
          <SimpleGrid cols={4}>
            <Button onClick={handleRefactorPatternPathTravelTime} disabled={isImporting}>
              Update Travel Times
            </Button>
            <Button onClick={handleRefactorPatternPathPresetVelocity} disabled={isImporting}>
              Update Preset Velocities
            </Button>
          </SimpleGrid>
        </Section>
      </Pannel>
    </AuthGate>
  );
}
