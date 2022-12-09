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

export default function StopsView() {
  //

  const router = useRouter();
  const { _id } = router.query;

  const { data: stop } = useSWR(_id && `/api/stops/${_id}`);

  const handleEditStop = () => {
    router.push(`/stops/${_id}/edit`);
  };

  const handleDeleteStop = async () => {
    openConfirmModal({
      title: (
        <Text size={'lg'} fw={700}>
          Delete Stop?
        </Text>
      ),
      centered: true,
      children: <Text>Deleting is irreversible. Are you sure you want to delete this stop forever?</Text>,
      labels: { confirm: 'Delete Stop', cancel: 'Do Not Delete' },
      confirmProps: { color: 'red' },
      onConfirm: async () => {
        try {
          notify(_id, 'loading', 'Deleting Stop...');
          await API({ service: 'stops', resourceId: _id, operation: 'delete', method: 'DELETE' });
          router.push('/stops');
          notify(_id, 'success', 'Stop was deleted!');
        } catch (err) {
          console.log(err);
          notify(_id, 'error', err.message || 'An error ocurred.');
        }
      },
    });
  };

  return stop ? (
    <PageContainer title={['Stops', stop.name]}>
      <Group>
        <Button leftIcon={<TbPencil />} onClick={handleEditStop}>
          Edit
        </Button>
        <Button variant={'light'} color={'red'} leftIcon={<TbTrash />} onClick={handleDeleteStop}>
          Delete
        </Button>
      </Group>

      <Pannel title={'Stop Details'}>
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
