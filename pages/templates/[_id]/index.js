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

export default function TemplatesView() {
  //

  const router = useRouter();
  const { _id } = router.query;

  const { data: templateData, error: templateError } = useSWR(_id && `/api/templates/${_id}`);

  const handleEditAudit = async () => {
    router.push(`/templates/${_id}/edit`);
  };

  const handleDeleteAudit = async () => {
    openConfirmModal({
      title: (
        <Text size={'lg'} fw={700}>
          Delete Template?
        </Text>
      ),
      centered: true,
      children: <Text>Deleting is irreversible. Are you sure you want to delete this template forever?</Text>,
      labels: { confirm: 'Delete Template', cancel: 'Do Not Delete' },
      confirmProps: { color: 'red' },
      onConfirm: async () => {
        try {
          notify(_id, 'loading', 'Deleting Template...');
          await API({ service: 'templates', resourceId: _id, operation: 'delete', method: 'DELETE' });
          router.push('/templates');
          notify(_id, 'success', 'Template was deleted!');
        } catch (err) {
          console.log(err);
          notify(_id, 'error', err.message || 'An error ocurred.');
        }
      },
    });
  };

  return templateData ? (
    <PageContainer title={['Templates', templateData.unique_code]}>
      <Group>
        <Button leftIcon={<TbPencil />} onClick={handleEditAudit}>
          Edit
        </Button>
        <Button variant={'light'} color={'red'} leftIcon={<TbTrash />} onClick={handleDeleteAudit}>
          Delete
        </Button>
      </Group>

      <Pannel title={'Template Details'}>
        <Grid>
          <GridCell>
            <Label>Title</Label>
            <Value>{templateData.title}</Value>
          </GridCell>
          <GridCell>
            <Label>Unique Code</Label>
            <Value>{templateData.unique_code}</Value>
          </GridCell>
        </Grid>
      </Pannel>

      {templateData.sections?.map((section, index) => (
        <Pannel key={section.key} title={section.title} description={section.description}>
          {/* <Grid>
              <TextInput
                label={'Section Title'}
                placeholder={'Section Titlte'}
                {...form.getInputProps(`sections.${index}.title`)}
              />
              <TextInput
                label={'Section Description'}
                placeholder={'Section Explanation'}
                {...form.getInputProps(`sections.${index}.description`)}
              />
              <ActionIcon color='red' onClick={() => form.removeListItem('sections', index)}>
                <TbTrash />
              </ActionIcon>
            </Grid> */}
        </Pannel>
      ))}
    </PageContainer>
  ) : (
    <div>Loading...</div>
  );
}
