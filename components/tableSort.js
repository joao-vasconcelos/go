import { useState } from 'react';

import { createStyles, Table, ScrollArea, UnstyledButton, Group, Text, Center, TextInput } from '@mantine/core';
import { keys } from '@mantine/utils';
import { IconSelector, IconChevronDown, IconChevronUp, IconSearch } from '@tabler/icons';

const useStyles = createStyles((theme) => ({
  th: {
    padding: '0 !important',
  },

  control: {
    width: '100%',
    padding: `${theme.spacing.xs}px ${theme.spacing.md}px`,

    '&:hover': {
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
    },
  },

  icon: {
    width: 21,
    height: 21,
    borderRadius: 21,
  },
}));

//

function Th({ children, reversed, sorted, onSort }) {
  const { classes } = useStyles();
  const Icon = sorted ? (reversed ? IconChevronUp : IconChevronDown) : IconSelector;
  return (
    <th className={classes.th}>
      <UnstyledButton onClick={onSort} className={classes.control}>
        <Group position='apart'>
          <Text weight={500} size='sm'>
            {children}
          </Text>
          <Center className={classes.icon}>
            <Icon size={14} stroke={1.5} />
          </Center>
        </Group>
      </UnstyledButton>
    </th>
  );
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

function sortData(data, payload) {
  const { sortBy } = payload;

  if (!sortBy) {
    return filterData(data, payload.search);
  }

  return filterData(
    [...data].sort((a, b) => {
      if (payload.reversed) {
        return b[sortBy].localeCompare(a[sortBy]);
      }

      return a[sortBy].localeCompare(b[sortBy]);
    }),
    payload.search
  );
}

export default function TableSort({ data }) {
  //

  const [search, setSearch] = useState('');
  const [sortedData, setSortedData] = useState(data);
  const [sortBy, setSortBy] = useState(null);
  const [reverseSortDirection, setReverseSortDirection] = useState(false);

  const setSorting = (field) => {
    const reversed = field === sortBy ? !reverseSortDirection : false;
    setReverseSortDirection(reversed);
    setSortBy(field);
    setSortedData(sortData(data, { sortBy: field, reversed, search }));
  };

  const handleSearchChange = (event) => {
    const { value } = event.currentTarget;
    setSearch(value);
    setSortedData(sortData(data, { sortBy, reversed: reverseSortDirection, search: value }));
  };

  const handleRowClick = (row) => {
    console.log(row);
  };

  return (
    <>
      {/* <TextInput
        placeholder='Search by any field'
        mb='md'
        icon={<IconSearch size={14} stroke={1.5} />}
        value={search}
        onChange={handleSearchChange}
      /> */}
      <Table highlightOnHover>
        <thead>
          <tr>
            <Th sorted={sortBy === 'stop_code'} reversed={reverseSortDirection} onSort={() => setSorting('stop_code')}>
              Stop Code
            </Th>
            <Th sorted={sortBy === 'stop_name'} reversed={reverseSortDirection} onSort={() => setSorting('stop_name')}>
              Stop Name
            </Th>
          </tr>
        </thead>
        <tbody>
          {sortedData.length ? (
            sortedData.map((row) => {
              return (
                <tr key={row._id} onClick={handleRowClick}>
                  <td>{row._id}</td>
                  <td>{row.name}</td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan={2}>
                <Text weight={500} align='center'>
                  Nothing found
                </Text>
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </>
  );
}
