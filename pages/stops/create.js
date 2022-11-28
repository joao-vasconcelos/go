import { useRouter } from 'next/router';
import Button from '../../components/Button';
import PageContainer from '../../components/PageContainer';
import Toolbar from '../../components/Toolbar';
import Group from '../../components/Group';
import { Grid, GridCell } from '../../components/Grid';
import { useForm, yupResolver } from '@mantine/form';
import { IoSave, IoClose } from 'react-icons/io5';
import { TextInput, NumberInput, Textarea, LoadingOverlay, Switch } from '@mantine/core';
import { DatePicker } from '@mantine/dates';
import Schema from '../../schemas/Stop';
import { useState } from 'react';
import API from '../../services/API';
import notify from '../../services/notify';
import { CheckboxCard } from '../../components/CheckboxCard';

export default function CreateStop() {
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
      latitude: '',
      longitude: '',
      features: {
        has_bench: false,
        has_crossing: false,
        has_flag: false,
        has_abusive_parking: false,
      },
    },
  });

  function handleCancel() {
    router.push('/stops/');
  }

  async function handleSave(values) {
    try {
      setIsLoading(true);
      notify('new', 'loading', 'Saving changes...');
      const response = await API({ service: 'stops', operation: 'create', method: 'POST', body: values });
      router.push(`/stops/${response._id}`);
      notify('new', 'success', 'Changes saved!');
    } catch (err) {
      console.log(err);
      setIsLoading(false);
      notify('new', 'error', 'An error occurred.');
    }
  }

  return (
    <form onSubmit={form.onSubmit(handleSave)}>
      <PageContainer title={`Stops › New Stop ${form.values.unique_code && `(${form.values.unique_code})`}`}>
        <LoadingOverlay visible={isLoading} />
        <Toolbar>
          <Button type={'submit'} icon={<IoSave />} label={'Save'} color={'primary'} />
          <Button icon={<IoClose />} label={'Cancel'} onClick={handleCancel} />
        </Toolbar>

        <Group title={'General Details'}>
          <Grid>
            <TextInput label={'Stop Code'} placeholder={'000000'} {...form.getInputProps('unique_code')} />
            <div />
          </Grid>
          <Grid>
            <TextInput label={'Name'} placeholder={'Soares'} {...form.getInputProps('name')} />
            <TextInput label={'Short Name'} placeholder={'Soares'} {...form.getInputProps('short_name')} />
          </Grid>
          <Grid>
            <Textarea
              label={'Description'}
              placeholder={'Soares'}
              autosize
              minRows={2}
              {...form.getInputProps('description')}
            />
          </Grid>
        </Group>

        <Group title={'Location'}>
          <Grid>
            <NumberInput label={'Latitude'} defaultValue={0} precision={5} {...form.getInputProps('latitude')} />
            <NumberInput label={'Longitude'} defaultValue={0} precision={5} {...form.getInputProps('longitude')} />
          </Grid>
        </Group>

        <Group title={'Features'}>
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
        </Group>
      </PageContainer>
    </form>
  );
}
