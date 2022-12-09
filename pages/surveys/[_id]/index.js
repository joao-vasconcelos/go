import useSWR from 'swr';
import { useState } from 'react';
import { useRouter } from 'next/router';
import PageContainer from '../../../components/PageContainer';
import Pannel from '../../../components/Pannel';
import { Grid, GridCell, Label, Value } from '../../../components/Grid';
import API from '../../../services/API';
import { openConfirmModal } from '@mantine/modals';
import notify from '../../../services/notify';
import { TbPencil, TbTrash } from 'react-icons/tb';
import { Group, Button, Text } from '@mantine/core';
import ErrorDisplay from '../../../components/ErrorDisplay';

export default function SurveysView() {
  //

  const router = useRouter();
  const { _id } = router.query;

  const { data, error } = useSWR(_id && `/api/surveys/${_id}`);

  const [isDeleting, setIsDeleting] = useState(false);

  const handleEditSurvey = () => {
    router.push(`/surveys/${_id}/edit`);
  };

  const handleDeleteSurvey = async () => {
    openConfirmModal({
      title: (
        <Text size={'lg'} fw={700}>
          Delete Survey?
        </Text>
      ),
      centered: true,
      children: <Text>Deleting is irreversible. Are you sure you want to delete this Survey forever?</Text>,
      labels: { confirm: 'Delete Survey', cancel: 'Do Not Delete' },
      confirmProps: { color: 'red' },
      onConfirm: async () => {
        try {
          setIsDeleting(true);
          await API({ service: 'surveys', resourceId: _id, operation: 'delete', method: 'DELETE' });
          router.push('/surveys');
          notify(_id, 'success', 'Survey was deleted!');
        } catch (err) {
          console.log(err);
          setIsDeleting(false);
          notify(_id, 'error', err.message || 'An error ocurred.');
        }
      },
    });
  };

  return (
    <PageContainer title={['Surveys', data.unique_code]} loading={!error && !data}>
      <ErrorDisplay error={error} />

      <Group>
        <Button leftIcon={<TbPencil />} onClick={handleEditSurvey} disabled={!data || isDeleting}>
          Edit
        </Button>
        <Button
          variant={'light'}
          color={'red'}
          leftIcon={<TbTrash />}
          onClick={handleDeleteSurvey}
          disabled={!data}
          loading={isDeleting}
        >
          {isDeleting ? 'Deleting Survey...' : 'Delete'}
        </Button>
      </Group>

      {data && (
        <Pannel title={'Survey Details'}>
          <Grid>
            <GridCell>
              <Label>Unique Code</Label>
              <Value>{data.unique_code}</Value>
            </GridCell>
          </Grid>
        </Pannel>
      )}
    </PageContainer>
  );
}
