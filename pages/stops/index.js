import useSWR from 'swr';
import { styled } from '../../stitches.config';
import { Button, TextInput, Table, LoadingOverlay } from '@mantine/core';
import PageContainer from '../../components/PageContainer';
import { useRouter } from 'next/router';
import { useState } from 'react';
import Toolbar from '../../components/Toolbar';
import TableSort from '../../components/TableSort';
import { TbPlus, TbSearch } from 'react-icons/tb';

const TableRow = styled('tr', {
  backgroundColor: '$gray1',
});

const TableRowColumn = styled('td', {
  backgroundColor: '0',
});

export default function StopsList() {
  //

  const router = useRouter();
  const { data: stops } = useSWR('/api/stops/');

  const [searchQuery, setSearchQuery] = useState('');
  const [formattedTableData, setFormattedTableData] = useState(stops);

  function handleCreateStop() {
    router.push('/stops/create');
  }

  function handleRowClick(row) {
    router.push(`/stops/${row._id}`);
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

  const ths = (
    <tr>
      <th>Element position</th>
      <th>Element name</th>
      <th>Symbol</th>
      <th>Atomic mass</th>
    </tr>
  );

  // const rows = elements.map((element) => (
  //   <tr key={element.name}>
  //     <td>{element.position}</td>
  //     <td>{element.name}</td>
  //     <td>{element.symbol}</td>
  //     <td>{element.mass}</td>
  //   </tr>
  // ));

  return (
    <PageContainer title={'Stops'}>
      <Toolbar>
        <Button leftIcon={<TbPlus />} onClick={handleCreateStop}>
          Create New Stop
        </Button>
      </Toolbar>
      <TextInput
        placeholder='Search by any field'
        icon={<TbSearch />}
        value={searchQuery}
        onChange={handleSearchQueryChange}
      />
      {stops ? (
        <Table>
          <thead>{ths}</thead>
          <tbody>
            {stops.length ? (
              stops.map((row) => {
                return (
                  <TableRow key={row._id} onClick={() => handleRowClick(row)}>
                    <TableRowColumn>{row._id}</TableRowColumn>
                    <TableRowColumn>{row.name}</TableRowColumn>
                  </TableRow>
                );
              })
            ) : (
              <tr>
                <td colSpan={2}>Nothing found</td>
              </tr>
            )}
          </tbody>
        </Table>
      ) : (
        <LoadingOverlay visible overlayBlur={2} />
      )}
      {/* {stops && <TableSort data={stops} />} */}
    </PageContainer>
  );
}
