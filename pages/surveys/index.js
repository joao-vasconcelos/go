import useSWR from 'swr';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { Button, Group } from '@mantine/core';
import PageContainer from '../../components/PageContainer';
import DynamicTable from '../../components/DynamicTable';
import Pannel from '../../components/Pannel';
import { TbPlus, TbSettings } from 'react-icons/tb';
import notify from '../../services/notify';
import API from '../../services/API';
import { Spacer } from '../../components/LayoutUtils';
import ErrorDisplay from '../../components/ErrorDisplay';

/* * */
/* SURVEYS > LIST */
/* List all available surveys. */
/* * */

export default function SurveysList() {
  //

  //
  // A. Setup variables

  const router = useRouter();
  const [isCreating, setIsCreating] = useState(false);

  //
  // B. Fetch data

  const { data, error } = useSWR('/api/surveys/');

  //
  // C. Handle actions

  const handleCreateSurvey = async () => {
    try {
      setIsCreating(true);
      const response = await API({ service: 'surveys', operation: 'create', method: 'POST', body: {} });
      router.push(`/surveys/${response._id}/edit`);
      notify('new', 'success', 'A new Survey has started.');
    } catch (err) {
      setIsCreating(false);
      console.log(err);
      notify('new', 'error', err.message);
    }
  };

  function handleRowClick(row) {
    router.push(`/surveys/${row._id}`);
  }

  //
  // D. Render page

  return (
    <PageContainer title={['Surveys']}>
      <ErrorDisplay error={error} />

      <Group>
        <Button leftIcon={<TbPlus />} onClick={handleCreateSurvey} loading={isCreating}>
          Start New Survey
        </Button>
        <Spacer width={'full'} />
        <Button variant='light'>
          <TbSettings />
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
