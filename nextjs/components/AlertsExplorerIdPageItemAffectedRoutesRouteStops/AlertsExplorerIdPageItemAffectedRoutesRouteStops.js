'use client';

/* * */

import useSWR from 'swr';
import { useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { ActionIcon, Button, Select, SimpleGrid, Tooltip } from '@mantine/core';
import { useAlertsExplorerContext } from '@/contexts/AlertsExplorerContext';
import { AlertAffectedStopDefault } from '@/schemas/Alert/default';
import { IconTrash } from '@tabler/icons-react';
import Standout from '@/components/Standout/Standout';
import NoDataLabel from '@/components/NoDataLabel/NoDataLabel';

/* * */

export default function AlertsExplorerIdPageItemAffectedRoutesRouteStops({ affectedRouteIndex }) {
  //

  //
  // A. Setup variables

  const t = useTranslations('AlertsExplorerIdPageItemAffectedRoutesRouteStops');
  const alertsExplorerContext = useAlertsExplorerContext();

  //
  // B. Fetch data

  const { data: allLiveStopsData } = useSWR('https://api.carrismetropolitana.pt/stops');

  //
  // C. Transform data

  const availableLiveRouteStops = useMemo(() => {
    if (!allLiveStopsData || !alertsExplorerContext.form.values.affected_routes[affectedRouteIndex].route_id) return [];
    return allLiveStopsData
      .filter((item) => {
        const stopRoutes = new Set(item.routes);
        return stopRoutes.has(alertsExplorerContext.form.values.affected_routes[affectedRouteIndex].route_id);
      })
      .map((item) => {
        return { value: item.id, label: `[${item.id}] ${item.name}` };
      });
  }, [affectedRouteIndex, alertsExplorerContext.form.values.affected_routes, allLiveStopsData]);

  //
  // D. Handle actions

  const handleInsertAffectedRouteStop = (affectedRouteIndex) => {
    alertsExplorerContext.form.insertListItem(`affected_routes.${affectedRouteIndex}.route_stops`, AlertAffectedStopDefault);
  };

  const handleRemoveAffectedRouteStop = (affectedRouteIndex, affectedRouteStopIndex) => {
    alertsExplorerContext.form.removeListItem(`affected_routes.${affectedRouteIndex}.route_stops`, affectedRouteStopIndex);
  };

  //
  // E. Render components

  return (
    <SimpleGrid>
      {alertsExplorerContext.form.values.affected_routes[affectedRouteIndex].route_stops.length > 0 ? (
        alertsExplorerContext.form.values.affected_routes[affectedRouteIndex].route_stops.map((affectedRouteStop, affectedRouteStopIndex) => (
          <Standout
            key={affectedRouteStopIndex}
            title={t('form.route_stops.label')}
            icon={
              <Tooltip label={t('operations.remove_route_stop.label')} withArrow>
                <ActionIcon variant="subtle" color="gray" size="sm" onClick={() => handleRemoveAffectedRouteStop(affectedRouteIndex, affectedRouteStopIndex)} disabled={alertsExplorerContext.page.is_read_only}>
                  <IconTrash size={18} />
                </ActionIcon>
              </Tooltip>
            }
          >
            <Select
              placeholder={t('form.route_stops.placeholder')}
              nothingFoundMessage={t('form.route_stops.nothingFound')}
              {...alertsExplorerContext.form.getInputProps(`affected_routes.${affectedRouteIndex}.route_stops.${affectedRouteStopIndex}.stop_id`)}
              limit={100}
              data={availableLiveRouteStops}
              readOnly={alertsExplorerContext.page.is_read_only}
              searchable
              clearable
              w="100%"
            />
          </Standout>
        ))
      ) : (
        <Standout>
          <NoDataLabel text={t('form.route_stops.no_data')} />
        </Standout>
      )}
      <Button variant="light" onClick={() => handleInsertAffectedRouteStop(affectedRouteIndex)} disabled={!alertsExplorerContext.form.values.affected_routes[affectedRouteIndex].route_id || alertsExplorerContext.page.is_read_only}>
        {t('operations.insert_route_stop.label')}
      </Button>
    </SimpleGrid>
  );

  //
}
