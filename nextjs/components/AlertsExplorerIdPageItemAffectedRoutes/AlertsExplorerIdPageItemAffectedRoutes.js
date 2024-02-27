'use client';

/* * */

import useSWR from 'swr';
import { useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { ActionIcon, Button, MultiSelect, Select, Tooltip } from '@mantine/core';
import { useAlertsExplorerContext } from '@/contexts/AlertsExplorerContext';
import { AlertAffectedRouteDefault } from '@/schemas/Alert/default';
import { IconTrash } from '@tabler/icons-react';
import Standout from '@/components/Standout/Standout';
import NoDataLabel from '@/components/NoDataLabel/NoDataLabel';
import styles from './AlertsExplorerIdPageItemAffectedRoutes.module.css';
import AlertsExplorerIdPageItemAffectedRoutesRouteStops from '@/components/AlertsExplorerIdPageItemAffectedRoutesRouteStops/AlertsExplorerIdPageItemAffectedRoutesRouteStops';

/* * */

export default function AlertsExplorerIdPageItemAffectedRoutes() {
  //

  //
  // A. Setup variables

  const t = useTranslations('AlertsExplorerIdPageItemAffectedRoutes');
  const alertsExplorerContext = useAlertsExplorerContext();

  //
  // B. Fetch data

  const { data: allLiveRoutesData } = useSWR('https://api.carrismetropolitana.pt/routes');

  //
  // C. Transform data

  const availableLiveRoutes = useMemo(() => {
    if (!allLiveRoutesData) return [];
    return allLiveRoutesData.map((item) => {
      return { value: item.id, label: `[${item.id}] ${item.long_name}` };
    });
  }, [allLiveRoutesData]);

  //
  // D. Handle actions

  const handleInsertAffectedRoute = () => {
    alertsExplorerContext.form.insertListItem('affected_routes', AlertAffectedRouteDefault);
  };

  const handleRemoveAffectedRoute = (affectedRouteIndex) => {
    alertsExplorerContext.form.removeListItem('affected_routes', affectedRouteIndex);
  };

  //
  // E. Render components

  return (
    <div className={styles.container}>
      {alertsExplorerContext.form.values.affected_routes.length > 0 ? (
        alertsExplorerContext.form.values.affected_routes.map((affectedRoute, affectedRouteIndex) => (
          <Standout
            key={affectedRouteIndex}
            title={t('form.affected_routes.label')}
            icon={
              <Tooltip label={t('operations.remove.label')} withArrow>
                <ActionIcon variant="subtle" color="gray" size="sm" onClick={() => handleRemoveAffectedRoute(affectedRouteIndex)} disabled={alertsExplorerContext.page.is_read_only}>
                  <IconTrash size={18} />
                </ActionIcon>
              </Tooltip>
            }
          >
            <Select
              placeholder={t('form.affected_routes.placeholder')}
              nothingFoundMessage={t('form.affected_routes.nothingFound')}
              {...alertsExplorerContext.form.getInputProps(`affected_routes.${affectedRouteIndex}.route_id`)}
              limit={100}
              data={availableLiveRoutes}
              readOnly={alertsExplorerContext.page.is_read_only}
              searchable
              clearable
              w="100%"
            />
            <AlertsExplorerIdPageItemAffectedRoutesRouteStops affectedRouteIndex={affectedRouteIndex} />
          </Standout>
        ))
      ) : (
        <Standout>
          <NoDataLabel text={t('form.affected_routes.no_data')} />
        </Standout>
      )}
      <Button variant="light" onClick={handleInsertAffectedRoute} disabled={alertsExplorerContext.page.is_read_only}>
        {t('operations.insert.label')}
      </Button>
    </div>
  );

  //
}
