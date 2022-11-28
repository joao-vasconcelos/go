import useSWR from 'swr';
import { useRouter } from 'next/router';
import PageContainer from '../../../components/PageContainer';
import Toolbar from '../../../components/Toolbar';
import Group from '../../../components/Group';
import { Grid, GridCell, Label, Value } from '../../../components/Grid';
import API from '../../../services/API';
import notify from '../../../services/notify';
import { IoPencil, IoTrash, IoDuplicate } from 'react-icons/io5';
import { LoadingOverlay, Button } from '@mantine/core';

export default function Customer() {
  //

  const router = useRouter();
  const { _id } = router.query;

  const { data: stop } = useSWR(_id && `/api/stops/${_id}`);

  async function handleEditStop() {
    router.push(`/stops/${_id}/edit`);
  }

  async function handleDeleteStop() {
    try {
      notify(_id, 'loading', 'A eliminar cliente...');
      await API({ service: 'stops', resourceId: _id, operation: 'delete', method: 'DELETE' });
      router.push('/stops');
      notify(_id, 'success', 'Stop was deleted!');
    } catch (err) {
      console.log(err);
      notify(_id, 'error', 'An error ocurred.');
    }
  }

  return stop ? (
    <PageContainer title={'Stops › ' + 'sdyg'}>
      <Toolbar>
        <Button icon={<IoPencil />} label={'Editar'} onClick={handleEditStop} />
        <Button icon={<IoTrash />} label={'Apagar'} color={'danger'} />
      </Toolbar>

      <Group title={'Stop Details'}>
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
      </Group>
    </PageContainer>
  ) : (
    <div>sijdisd</div>
  );
}
