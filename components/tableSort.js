import { useState, useEffect } from 'react';
import { styled } from '@stitches/react';
import { Table, Group, TextInput } from '@mantine/core';
import { keys } from '@mantine/utils';
import { TbSearch, TbSelector, TbChevronDown, TbChevronUp } from 'react-icons/tb';

const TableHeaderColumn = styled('th', {
  cursor: 'pointer',
  backgroundColor: '$gray1',
  '&:hover': {
    color: '$gray12',
    backgroundColor: '$gray3',
  },
  variants: {
    isSorted: {
      true: {
        color: '$info5 !important',
      },
    },
  },
});

const TableBodyRow = styled('tr', {
  cursor: 'pointer',
  '&:hover': {
    color: '$info5',
    backgroundColor: '$info1',
  },
  '& td': {
    padding: '$md $sm !important',
  },
});

//

function formatData(data, sortKey, reversedSort, searchQuery) {
  //
  let filteredData = data;

  // 1. Filter data based on search
  const query = searchQuery.toLowerCase().trim();
  if (query.length > 0) {
    filteredData = data.filter((item) => {
      return keys(data[0]).some((key) => {
        return String(item[key]).toLowerCase().includes(query);
      });
    });
  }

  // 2. Sort the data
  const sortedData = [...filteredData].sort((a, b) => {
    if (reversedSort) {
      return String(b[sortKey]).localeCompare(String(a[sortKey]));
    } else {
      return String(a[sortKey]).localeCompare(String(b[sortKey]));
    }
  });

  return sortedData;
}

export default function TableSort(props) {
  //
  const [searchQuery, setSearchQuery] = useState('');
  const [sortKey, setSortKey] = useState(null);
  const [reverseSortDirection, setReverseSortDirection] = useState(false);
  const [formattedData, setFormattedData] = useState(props.data);

  useEffect(() => {
    setFormattedData(props.data);
  }, [props.data]);

  const handleSortChange = (colKey) => {
    const reversed = colKey === sortKey ? !reverseSortDirection : false;
    setReverseSortDirection(reversed);
    setSortKey(colKey);
    setFormattedData(formatData(props.data, colKey, reversed, searchQuery));
  };

  const handleSearchQueryChange = (event) => {
    const { value } = event.currentTarget;
    setSearchQuery(value);
    setFormattedData(formatData(props.data, sortKey, reverseSortDirection, value));
  };

  return (
    <>
      <TextInput
        placeholder={props.searchFieldPlaceholder}
        icon={<TbSearch />}
        value={searchQuery}
        onChange={handleSearchQueryChange}
      />
      <Table withBorder>
        <thead>
          <tr>
            {props.columns.map((col, index) => (
              <TableHeaderColumn key={index} isSorted={sortKey === col.key} onClick={() => handleSortChange(col.key)}>
                <Group position='apart'>
                  {col.label}
                  {sortKey === col.key ? reverseSortDirection ? <TbChevronUp /> : <TbChevronDown /> : <TbSelector />}
                </Group>
              </TableHeaderColumn>
            ))}
          </tr>
        </thead>
        <tbody>
          {formattedData?.length ? (
            formattedData.map((row, index) => (
              <TableBodyRow key={index} onClick={() => props.onRowClick(row)}>
                {props.columns.map((col, index) => (
                  <td key={index}>{row[col.key] || '-'}</td>
                ))}
              </TableBodyRow>
            ))
          ) : (
            <p>Nenhum dado disponível</p>
          )}
        </tbody>
      </Table>
    </>
  );
}
