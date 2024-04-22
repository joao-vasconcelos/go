'use client';

/* * */

import { useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { IconSearch, IconX } from '@tabler/icons-react';
import { Section } from '@/components/Layouts/Layouts';
import { ActionIcon, SimpleGrid, Table, TextInput } from '@mantine/core';
import { useReportsExplorerRealtimeContext } from '@/contexts/ReportsExplorerRealtimeContext';
import styles from './ReportsExplorerRealtimeResultSummaryTable.module.css';

/* * */

export default function ReportsExplorerRealtimeResultSummaryTable() {
  //

  //
  // A. Setup variables

  const t = useTranslations('ReportsExplorerRealtimeResultSummaryTable');
  const reportsExplorerRealtimeContext = useReportsExplorerRealtimeContext();

  //
  // B. Transform data

  const tableDataFiltered = useMemo(() => {
    // Return empty if data is not ready
    if (!reportsExplorerRealtimeContext.request.summary) return [];
    // uniformize the search query
    const query = reportsExplorerRealtimeContext.form.table_search_query.toLowerCase().trim();
    // Filter the table data by the search query
    return reportsExplorerRealtimeContext.request.summary.filter((item) => Object.values(item).join(' ').toLowerCase().includes(query));
    //
  }, [reportsExplorerRealtimeContext.form.table_search_query, reportsExplorerRealtimeContext.request.summary]);

  //
  // C. Handle actions

  const handleTableSearchQueryChange = ({ currentTarget }) => {
    reportsExplorerRealtimeContext.updateTableSearchQuery(currentTarget.value);
  };

  const handleClearSearchChange = ({ currentTarget }) => {
    reportsExplorerRealtimeContext.updateTableSearchQuery(currentTarget.value);
  };

  const handleRowClick = (row) => {
    reportsExplorerRealtimeContext.selectTripId(row.trip_id);
  };

  //
  // B. Render components

  return (
    <Section>
      <SimpleGrid cols={1}>
        <TextInput
          placeholder={t('search.placeholder')}
          leftSection={<IconSearch size={20} />}
          value={reportsExplorerRealtimeContext.form.table_search_query}
          onChange={handleTableSearchQueryChange}
          rightSection={
            reportsExplorerRealtimeContext.form.table_search_query.length > 0 && (
              <ActionIcon onClick={handleClearSearchChange} variant="subtle" color="gray">
                <IconX size={20} />
              </ActionIcon>
            )
          }
        />
        <Table highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>{t('table.header.pattern_id.title')}</Table.Th>
              <Table.Th>{t('table.header.trip_id.title')}</Table.Th>
              <Table.Th>{t('table.header.num_events.title')}</Table.Th>
              <Table.Th>{t('table.header.vehicle_id.title')}</Table.Th>
              <Table.Th>{t('table.header.driver_id.title')}</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {tableDataFiltered.map((row) => (
              <Table.Tr key={row.trip_id} onClick={() => handleRowClick(row)} className={styles.tableRow}>
                <Table.Td>{row.pattern_id}</Table.Td>
                <Table.Td>{row.trip_id}</Table.Td>
                <Table.Td>{row.num_events}</Table.Td>
                <Table.Td>{row.vehicle_id.join(', ')}</Table.Td>
                <Table.Td>{row.driver_id.join(', ')}</Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </SimpleGrid>
    </Section>
  );

  //
}
