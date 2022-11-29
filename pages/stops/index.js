import useSWR from 'swr';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { Button, LoadingOverlay, Group } from '@mantine/core';
import PageContainer from '../../components/PageContainer';
import TableSort from '../../components/TableSort';
import Pannel from '../../components/Pannel';
import { TbPlus } from 'react-icons/tb';
import notify from '../../services/notify';
import API from '../../services/API';

export default function StopsList() {
  //

  const router = useRouter();

  const { data: stops } = useSWR('/api/stops/');

  const [isLoading, setIsLoading] = useState(false);

  const handleCreateStop = async () => {
    try {
      setIsLoading(true);
      notify('new', 'loading', 'Creating new Stop...');
      const response = await API({ service: 'stops', operation: 'create', method: 'POST', body: {} });
      router.push(`/stops/${response._id}/edit`);
      notify('new', 'success', 'A new Stop has been created.');
    } catch (err) {
      setIsLoading(false);
      console.log(err);
      notify('new', 'error', err.message);
    }
  };

  function handleRowClick(row) {
    router.push(`/stops/${row._id}`);
  }

  return (
    <PageContainer title={'Stops'}>
      <Group>
        <Button leftIcon={<TbPlus />} onClick={handleCreateStop} loading={isLoading}>
          Create New Stop
        </Button>
      </Group>
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
