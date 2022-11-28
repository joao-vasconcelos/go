import useSWR from 'swr';
import { Button, TextInput, Table } from '@mantine/core';
import PageContainer from '../../components/PageContainer';
import { useRouter } from 'next/router';
import { useState } from 'react';
import Toolbar from '../../components/Toolbar';
import TableSort from '../../components/TableSort';

import { TbPlus, TbSearch } from 'react-icons/tb';

export default function StopsList() {
  //
  const router = useRouter();
  const { data: stops } = useSWR('/api/stops/');

  const [searchQuery, setSearchQuery] = useState('');

  function handleCreateCustomer() {
    router.push('/stops/create');
  }

  function handleSearchQueryChange({ currentTarget }) {
    const value = currentTarget.value;
    setSearchQuery(value);
    // setSortedData(sortData(data, { sortBy, reversed: reverseSortDirection, search: value }));
  }

  function filterData(data, search) {
    const query = search.toLowerCase().trim();
    if (query.length > 0) {
      return data.filter((item) => {
        return keys(data[0]).some((key) => {
          return item[key].toLowerCase().includes(query);
        });
      });
    } else {
      return data;
    }
  }

  return (
    <PageContainer title={'Stops'}>
      <Toolbar>
        <Button leftIcon={<TbPlus />} onClick={handleCreateCustomer}>
          Create New Stop
        </Button>
      </Toolbar>
      <TextInput
        placeholder='Search by any field'
        icon={<TbSearch />}
        value={searchQuery}
        onChange={handleSearchQueryChange}
      />
      <Table>
        <thead>
          <tr>
            <th>Element position</th>
            <th>Element name</th>
            <th>Symbol</th>
            <th>Atomic mass</th>
          </tr>
        </thead>
        {/* <tbody>{rows}</tbody> */}
      </Table>
      {/* {stops && <TableSort data={stops} />} */}
    </PageContainer>
  );
}
