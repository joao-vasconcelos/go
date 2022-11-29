import useSWR from 'swr';
import { useRouter } from 'next/router';
import { Button, LoadingOverlay } from '@mantine/core';
import PageContainer from '../../components/PageContainer';
import Toolbar from '../../components/Toolbar';
import TableSort from '../../components/TableSort';
import { TbPlus } from 'react-icons/tb';
import Pannel from '../../components/Pannel';

export default function StopsList() {
  //

  const router = useRouter();

  const { data: stops } = useSWR('/api/stops/');

  function handleCreateStop() {
    router.push('/stops/create');
  }

  function handleRowClick(row) {
    router.push(`/stops/${row._id}`);
  }

  return (
    <PageContainer title={'Stops'}>
      <Toolbar>
        <Button leftIcon={<TbPlus />} onClick={handleCreateStop}>
          Create New Stop
        </Button>
      </Toolbar>
      {stops ? (
        <Pannel title={'All Stops'}>
          <TableSort
            data={stops}
            onRowClick={handleRowClick}
            columns={[
              { label: '_id', key: '_id' },
              { label: 'Unique Code', key: 'unique_code' },
              { label: 'Name', key: 'name' },
              { label: 'Short Name', key: 'short_name' },
            ]}
            searchFieldPlaceholder={'Search by stop code, name, etc...'}
          />
        </Pannel>
      ) : (
        <LoadingOverlay visible overlayBlur={2} />
      )}
    </PageContainer>
  );
}
