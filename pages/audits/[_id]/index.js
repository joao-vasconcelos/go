import useSWR from 'swr';
import { useRouter } from 'next/router';
import PageContainer from '../../../components/PageContainer';
import Pannel from '../../../components/Pannel';
import { Grid } from '../../../components/LayoutUtils';
import API from '../../../services/API';
import notify from '../../../services/notify';
import { openConfirmModal } from '@mantine/modals';
import { TbPencil, TbTrash } from 'react-icons/tb';
import { Group, Button, Text } from '@mantine/core';
import TextDisplay from '../../../components/TextDisplay';

export default function AuditsView() {
  //

  const router = useRouter();
  const { _id } = router.query;

  const { data: auditData, error: auditError } = useSWR(_id && `/api/audits/${_id}`);

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
      children: <Text>Deleting is irreversible. Are you sure you want to delete this Audit forever?</Text>,
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

  return auditData ? (
    <PageContainer title={['Audits', auditData.unique_code]}>
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
          <TextDisplay
            label={'Template'}
            description={'The template used for this Audit'}
            value={auditData.template.title}
          />
          <TextDisplay label={'User'} description={'The user performing the Audit'} value={'Andreia Soares'} />
        </Grid>
      </Pannel>
    </PageContainer>
  ) : (
    <div>Loading... 123</div>
  );
}