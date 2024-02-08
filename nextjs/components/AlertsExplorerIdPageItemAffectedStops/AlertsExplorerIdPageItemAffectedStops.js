'use client';

/* * */

import useSWR from 'swr';
import { useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { ActionIcon, Button, Select, Tooltip } from '@mantine/core';
import { useAlertsExplorerContext } from '@/contexts/AlertsExplorerContext';
import { AlertAffectedStopDefault } from '@/schemas/Alert/default';
import { IconTrash } from '@tabler/icons-react';
import styles from './AlertsExplorerIdPageItemAffectedStops.module.css';
import Standout from '@/components/Standout/Standout';
import NoDataLabel from '@/components/NoDataLabel/NoDataLabel';

/* * */

export default function AlertsExplorerIdPageItemAffectedStops() {
  //

  //
  // A. Setup variables

  const t = useTranslations('AlertsExplorerIdPageItemAffectedStops');
  const alertsExplorerContext = useAlertsExplorerContext();

  //
  // B. Fetch data

  const { data: allLiveStopsData } = useSWR('https://api.carrismetropolitana.pt/stops');

  //
  // C. Transform data

  const availableLiveStops = useMemo(() => {
    if (!allLiveStopsData) return [];
    return allLiveStopsData.map((item) => {
      return { value: item.id, label: `[${item.id}] ${item.name}` };
    });
  }, [allLiveStopsData]);

  //
  // D. Handle actions

  const handleInsertAffectedStop = () => {
    alertsExplorerContext.form.insertListItem('affected_stops', AlertAffectedStopDefault);
  };

  const handleRemoveAffectedStop = (index) => {
    console.log(index);
    alertsExplorerContext.form.removeListItem('affected_stops', index);
  };

  //
  // E. Render components

  return (
    <div className={styles.container}>
      {alertsExplorerContext.form.values.affected_stops.length > 0 ? (
        alertsExplorerContext.form.values.affected_stops.map((affectedStop, index) => (
          <Standout
            key={index}
            title={t('title')}
            icon={
              <Tooltip label={t('operations.remove.label')} withArrow>
                <ActionIcon variant="subtle" color="gray" size="sm" onClick={() => handleRemoveAffectedStop(index)} disabled={alertsExplorerContext.page.is_read_only}>
                  <IconTrash size={18} />
                </ActionIcon>
              </Tooltip>
            }
          >
            <Select
              placeholder={t('form.affected_stops.placeholder')}
              nothingFoundMessage={t('form.affected_stops.nothingFound')}
              {...alertsExplorerContext.form.getInputProps(`affected_stops.${index}.stop_id`)}
              limit={100}
              data={availableLiveStops}
              readOnly={alertsExplorerContext.page.is_read_only}
              searchable
              clearable
              w="100%"
            />
          </Standout>
        ))
      ) : (
        <Standout>
          <NoDataLabel text={t('no_data')} />
        </Standout>
      )}
      <Button variant="light" onClick={handleInsertAffectedStop} disabled={alertsExplorerContext.page.is_read_only}>
        {t('operations.insert.label')}
      </Button>
    </div>
  );

  //
}
