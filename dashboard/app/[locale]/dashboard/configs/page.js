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
    <AuthGate scope='configs' permission='admin' redirect>
      <Pannel>
        <Section>
          <Text size='h2'>Imports</Text>
          <SimpleGrid cols={4}>
            <Button onClick={handleStartImportLines}>Import Lines</Button>
            <Button onClick={handleStartImportRoutes}>Import Routes</Button>
            <Button onClick={handleStartImportPatterns}>Import Patterns & Calendars</Button>
            <Button onClick={handleStartImportStops}>Import Stops</Button>
            <Button onClick={handleStartImportShapes}>Import Shapes</Button>
            <Button onClick={handleStartImportAlerts}>Import Alerts</Button>
          </SimpleGrid>
        </Section>
        <Section>
          <Text size='h2'>Refactors</Text>
          <SimpleGrid cols={4}>
            <Button onClick={handleRefactorPatternPathTravelTime}>Update Travel Times</Button>
            <Button onClick={handleRefactorPatternPathPresetVelocity}>Update Preset Velocities</Button>
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
    </AuthGate>
  );
}
