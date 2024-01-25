'use client';

/* * */

import { useTranslations } from 'next-intl';
import { useRealtimeExplorerContext } from '@/contexts/RealtimeExplorerContext';
import { SimpleGrid, Table, TextInput } from '@mantine/core';
import { useMemo, useState } from 'react';
import { IconSearch } from '@tabler/icons-react';
import { Section } from '@/components/Layouts/Layouts';

/* * */

export default function RealtimeExplorerResultOverviewTable() {
  //

  //
  // A. Setup variables

  const t = useTranslations('RealtimeExplorerResultOverviewTable');
  const realtimeExplorerContext = useRealtimeExplorerContext();

  const [search, setSearch] = useState('');

  //
  // B. Transform data

  const tableDataInitial = useMemo(() => {
    // Return empty if data is not ready
    if (!realtimeExplorerContext.request.unique_trips) return [];
    // Map each trip into a table row
    return realtimeExplorerContext.request.unique_trips.map((trip) => ({ pattern_id: trip.pattern_id, trip_id: trip.trip_id, events_count: trip.raw_events.length }));
    //
  }, [realtimeExplorerContext.request.unique_trips]);

  const tableDataFiltered = useMemo(() => {
    const query = search.toLowerCase().trim();
    return tableDataInitial.filter((item) => Object.values(item).join(' ').toLowerCase().includes(query));
    //
  }, [search, tableDataInitial]);

  //
  // C. Handle actions

  const handleSearchChange = ({ currentTarget }) => {
    setSearch(currentTarget.value);
  };

  const handleRowClick = (row) => {
    realtimeExplorerContext.selectTripId(row.trip_id);
  };

  //
  // B. Render components

  return (
    <Section>
      <SimpleGrid cols={1}>
        <TextInput placeholder="Search by any field" leftSection={<IconSearch size={20} />} value={search} onChange={handleSearchChange} />
        {/* <Table data={tableData} highlightOnHover withTableBorder /> */}
        <Table highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Pattern ID</Table.Th>
              <Table.Th>Trip ID</Table.Th>
              <Table.Th>Events Count</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {tableDataFiltered.map((row) => (
              <Table.Tr key={row.trip_id} onClick={() => handleRowClick(row)}>
                <Table.Td>{row.pattern_id}</Table.Td>
                <Table.Td>{row.trip_id}</Table.Td>
                <Table.Td>{row.events_count}</Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </SimpleGrid>
    </Section>
  );

  //
}
