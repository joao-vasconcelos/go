import useSWR from 'swr';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { Button, LoadingOverlay, Group } from '@mantine/core';
import PageContainer from '../../components/PageContainer';
import DynamicTable from '../../components/DynamicTable';
import Pannel from '../../components/Pannel';
import { TbPlus } from 'react-icons/tb';
import notify from '../../services/notify';
import API from '../../services/API';

export default function SurveysList() {
  //

  const router = useRouter();

  const { data, error } = useSWR('/api/surveys/');

  const [isLoading, setIsLoading] = useState(false);

  const handleCreateSurvey = async () => {
    try {
      setIsLoading(true);
      notify('new', 'loading', 'Creating new Survey...');
      const response = await API({ service: 'surveys', operation: 'create', method: 'POST', body: {} });
      router.push(`/surveys/${response._id}/edit`);
      notify('new', 'success', 'A new Survey has started.');
    } catch (err) {
      setIsLoading(false);
      console.log(err);
      notify('new', 'error', err.message);
    }
  };

  function handleRowClick(row) {
    router.push(`/surveys/${row._id}`);
  }

  return (
    <PageContainer title={'Surveys'}>
      <Group>
        <Button leftIcon={<TbPlus />} onClick={handleCreateSurvey} loading={isLoading}>
          Start New Survey
        </Button>
      </Group>
      <Pannel title={'All Surveys'}>
        <DynamicTable
          data={data || []}
          isLoading={!error && !data}
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
    </PageContainer>
  );
}
