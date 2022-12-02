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

export default function UsersView() {
  //

  const router = useRouter();
  const { _id } = router.query;

  const { data: user, error } = useSWR(_id && `/api/users/${_id}`);

  console.log('user', user);

  const handleEditUser = () => {
    router.push(`/users/${_id}/edit`);
  };

  const handleDeleteUser = async () => {
    openConfirmModal({
      title: (
        <Text size={'lg'} fw={700}>
          Delete User?
        </Text>
      ),
      centered: true,
      children: <Text>Deleting is irreversible. Are you sure you want to delete this User forever?</Text>,
      labels: { confirm: 'Delete User', cancel: 'Do Not Delete' },
      confirmProps: { color: 'red' },
      onConfirm: async () => {
        try {
          notify(_id, 'loading', 'Deleting User...');
          await API({ service: 'users', resourceId: _id, operation: 'delete', method: 'DELETE' });
          router.push('/users');
          notify(_id, 'success', 'User was deleted!');
        } catch (err) {
          console.log(err);
          notify(_id, 'error', err.message || 'An error ocurred.');
        }
      },
    });
  };

  return user ? (
    <PageContainer title={`Users › ${user.name || '-'}`}>
      <Group>
        <Button leftIcon={<TbPencil />} onClick={handleEditUser}>
          Edit
        </Button>
        <Button variant={'light'} color={'red'} leftIcon={<TbTrash />} onClick={handleDeleteUser}>
          Delete
        </Button>
      </Group>

      <Pannel title={'User Details'}>
        <Grid>
          <GridCell>
            <Label>Nome</Label>
            <Value>{user.name || '-'}</Value>
          </GridCell>
          <GridCell>
            <Label>Email</Label>
            <Value>{user.email || '-'}</Value>
          </GridCell>
        </Grid>
      </Pannel>
    </PageContainer>
  ) : (
    <div>sijdisd</div>
  );
}
