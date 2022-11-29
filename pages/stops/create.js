import { useState } from 'react';
import { useRouter } from 'next/router';
import { TextInput, NumberInput, Textarea, LoadingOverlay, Button, Text, Group } from '@mantine/core';
import { useForm, yupResolver } from '@mantine/form';
import { openConfirmModal } from '@mantine/modals';
import { Grid } from '../../components/Grid';
import { CheckboxCard } from '../../components/CheckboxCard';
import PageContainer from '../../components/PageContainer';
import Pannel from '../../components/Pannel';
import Schema from '../../schemas/Stop';
import API from '../../services/API';
import notify from '../../services/notify';
import { TbDeviceFloppy, TbX } from 'react-icons/tb';

export default function StopsCreate() {
  //

  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    validate: yupResolver(Schema),
    validateInputOnBlur: true,
    initialValues: {
      unique_code: '',
      name: '',
      short_name: '',
      description: '',
      latitude: 0,
      longitude: 0,
      features: {
        has_bench: false,
        has_crossing: false,
        has_flag: false,
        has_abusive_parking: false,
      },
    },
  });

  const handleCancel = () =>
    openConfirmModal({
      title: 'Discard changes',
      centered: true,
      children: (
        <Text size='sm'>
          Are you sure you want to delete your profile? This action is destructive and you will have to contact support
          to restore your data.
        </Text>
      ),
      labels: { confirm: 'Discard changes and go back', cancel: 'Keep Editing' },
      confirmProps: { color: 'red' },
      onConfirm: () => router.push('/stops/'),
    });

  async function handleSave(values) {
    try {
      setIsLoading(true);
      notify('new', 'loading', 'Saving changes...');
      const response = await API({ service: 'stops', operation: 'create', method: 'POST', body: values });
      router.push(`/stops/${response._id}`);
      notify('new', 'success', 'Stop created successfully!');
    } catch (err) {
      console.log(err);
      setIsLoading(false);
      notify('new', 'error', err.message);
    }
  }

  return (
    <form onSubmit={form.onSubmit(handleSave)}>
      <PageContainer title={`Stops › New Stop ${form.values.unique_code && `(${form.values.unique_code})`}`}>
        <LoadingOverlay visible={isLoading} />
        <Group>
          <Button type={'submit'} leftIcon={<TbDeviceFloppy />} loading={isLoading}>
            Save
          </Button>
          <Button leftIcon={<TbX />} onClick={handleCancel}>
            Cancel
          </Button>
        </Group>

        <Pannel title={'General Details'}>
          <Grid>
            <TextInput label={'Stop Code'} placeholder={'000000'} {...form.getInputProps('unique_code')} />
            <div />
          </Grid>
          <Grid>
            <TextInput label={'Name'} placeholder={'Avenida da República (ICNF)'} {...form.getInputProps('name')} />
            <TextInput
              label={'Short Name'}
              placeholder={'Av. República (ICNF)'}
              {...form.getInputProps('short_name')}
            />
          </Grid>
          <Grid>
            <Textarea label={'Description'} autosize minRows={2} {...form.getInputProps('description')} />
          </Grid>
        </Pannel>

        <Pannel title={'Location'}>
          <Grid>
            <NumberInput label={'Latitude'} defaultValue={0} precision={5} {...form.getInputProps('latitude')} />
            <NumberInput label={'Longitude'} defaultValue={0} precision={5} {...form.getInputProps('longitude')} />
          </Grid>
        </Pannel>

        <Pannel title={'Features'}>
          <Grid>
            <CheckboxCard
              title={'Has Bench?'}
              description={'If this stop has a bench'}
              checked={form.values.features.has_bench}
              onChange={(checked) => form.setFieldValue('features.has_bench', checked)}
            />
            <CheckboxCard
              title={'Has Crossing?'}
              description={'If this stop has a crossing'}
              checked={form.values.features.has_crossing}
              onChange={(checked) => form.setFieldValue('features.has_crossing', checked)}
            />
            <CheckboxCard
              title={'Has Flag?'}
              description={'If this stop has a flag'}
              checked={form.values.features.has_flag}
              onChange={(checked) => form.setFieldValue('features.has_flag', checked)}
            />
            <CheckboxCard
              title={'Has Abusive Parking?'}
              description={'If this stop has abusive parking'}
              checked={form.values.features.has_abusive_parking}
              onChange={(checked) => form.setFieldValue('features.has_abusive_parking', checked)}
            />
          </Grid>
        </Pannel>
      </PageContainer>
    </form>
  );
}
