'use client';

/* * */

import { Alert, TextInput } from '@mantine/core';
import { useTranslations } from 'next-intl';
import styles from './StopsExplorerNewStopWizardSteps1Form.module.css';
import { useStopsExplorerNewStopWizardContext } from '@/contexts/StopsExplorerNewStopWizardContext';
import { IconCheck, IconX } from '@tabler/icons-react';
import { StopOptions } from '@/schemas/Stop/options';

/* * */

export default function StopsExplorerNewStopWizardSteps1Form() {
  //

  //
  // A. Setup variables

  const t = useTranslations('StopsExplorerNewStopWizardSteps1Form');
  const stopsExplorerNewStopWizardContext = useStopsExplorerNewStopWizardContext();

  //
  // B. Render components

  return (
    <div className={styles.container}>
      <TextInput
        label={t('name.label')}
        description={t('name.description')}
        placeholder={t('name.placeholder')}
        value={stopsExplorerNewStopWizardContext.newStop.name}
        onChange={(event) => stopsExplorerNewStopWizardContext.setNewStopName(event.currentTarget.value)}
        rightSection={stopsExplorerNewStopWizardContext.newStop.name.length >= StopOptions.min_stop_name_length && stopsExplorerNewStopWizardContext.newStop.name.length <= StopOptions.max_stop_name_length ? <IconCheck size={20} color="green" /> : <IconX size={20} color="red" />}
      />
      <TextInput
        label={t('short_name.label')}
        description={t('short_name.description')}
        placeholder={t('short_name.placeholder')}
        value={stopsExplorerNewStopWizardContext.newStop.short_name}
        rightSection={<div className={`${styles.shortNameLength} ${stopsExplorerNewStopWizardContext.newStop.short_name.length >= StopOptions.max_stop_short_name_length && styles.shortNameLengthTooLong}`}>{stopsExplorerNewStopWizardContext.newStop.short_name.length}</div>}
        readOnly={true}
      />

      <Alert>
        <TextInput label={t('locality.label')} description={t('locality.description')} placeholder={t('locality.placeholder')} value={stopsExplorerNewStopWizardContext.newStop.locality} onChange={(event) => stopsExplorerNewStopWizardContext.setNewStopLocality(event.currentTarget.value)} />
      </Alert>
    </div>
  );

  //
}
