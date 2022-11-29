import useSWR from 'swr';
import { useRouter } from 'next/router';
import PageContainer from '../../../components/PageContainer';
import Pannel from '../../../components/Pannel';
import { Grid, GridCell, Label, Value } from '../../../components/Grid';
import API from '../../../services/API';
import notify from '../../../services/notify';
import { openConfirmModal } from '@mantine/modals';
import { TbPencil, TbTrash } from 'react-icons/tb';
import { Group, Button, Text } from '@mantine/core';

export default function Customer() {
  //

  const router = useRouter();
  const { _id } = router.query;

  const { data: audit } = useSWR(_id && `/api/audits/${_id}`);

  const handleEditAudit = async () => {
    router.push(`/audits/${_id}/edit`);
  };

  const handleDeleteAudit = async () => {
    openConfirmModal({
      title: (
        <Text size={'lg'} fw={700}>
          Delete Audit?
        </Text>
      ),
      centered: true,
      children: <Text>Deleting is irreversible. Are you sure you want to delete this audit forever?</Text>,
      labels: { confirm: 'Delete Audit', cancel: 'Do Not Delete' },
      confirmProps: { color: 'red' },
      onConfirm: async () => {
        try {
          notify(_id, 'loading', 'Deleting Audit...');
          await API({ service: 'audits', resourceId: _id, operation: 'delete', method: 'DELETE' });
          router.push('/audits');
          notify(_id, 'success', 'Audit was deleted!');
        } catch (err) {
          console.log(err);
          notify(_id, 'error', err.message || 'An error ocurred.');
        }
      },
    });
  };

  return audit ? (
    <PageContainer title={`Audits › ${audit.unique_code}`}>
      <Group>
        <Button leftIcon={<TbPencil />} onClick={handleEditAudit}>
          Edit
        </Button>
        <Button variant={'light'} color={'red'} leftIcon={<TbTrash />} onClick={handleDeleteAudit}>
          Delete
        </Button>
      </Group>

      <Pannel title={'Audit Details'}>
        <Grid>
          <GridCell>
            <Label>Nome</Label>
            <Value>{audit.first_name}</Value>
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
