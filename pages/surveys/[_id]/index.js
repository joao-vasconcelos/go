import useSWR from 'swr';
import { useRouter } from 'next/router';
import PageContainer from '../../../components/PageContainer';
import Pannel from '../../../components/Pannel';
import { Grid, GridCell, Label, Value } from '../../../components/Grid';
import API from '../../../services/API';
import { openConfirmModal } from '@mantine/modals';
import notify from '../../../services/notify';
import { TbPencil, TbTrash } from 'react-icons/tb';
import { Group, Button, Text } from '@mantine/core';

export default function SurveysView() {
  //

  const router = useRouter();
  const { _id } = router.query;

  const { data: survey } = useSWR(_id && `/api/surveys/${_id}`);

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
          notify(_id, 'loading', 'Deleting Survey...');
          await API({ service: 'surveys', resourceId: _id, operation: 'delete', method: 'DELETE' });
          router.push('/surveys');
          notify(_id, 'success', 'Survey was deleted!');
        } catch (err) {
          console.log(err);
          notify(_id, 'error', err.message || 'An error ocurred.');
        }
      },
    });
  };

  return survey ? (
    <PageContainer title={`Surveys › ${survey.unique_code}`}>
      <Group>
        <Button leftIcon={<TbPencil />} onClick={handleEditSurvey}>
          Edit
        </Button>
        <Button variant={'light'} color={'red'} leftIcon={<TbTrash />} onClick={handleDeleteSurvey}>
          Delete
        </Button>
      </Group>

      <Pannel title={'Survey Details'}>
        <Grid>
          <GridCell>
            <Label>Nome</Label>
            <Value>{stop.name}</Value>
          </GridCell>
          <GridCell>
            <Label>Birthday</Label>
            <Value>osdnds</Value>
          </GridCell>
        </Grid>
        <Grid>
          <GridCell>
            <Label>Reference</Label>
            <Value>sjdhsiud</Value>
          </GridCell>
        </Grid>
      </Pannel>
    </PageContainer>
  ) : (
    <div>sijdisd</div>
  );
}
