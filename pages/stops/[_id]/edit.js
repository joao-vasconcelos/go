import { useRouter } from 'next/router';
import PageContainer from '../../../components/PageContainer';
import Pannel from '../../../components/Pannel';
import { Grid, GridCell } from '../../../components/Grid';
import { CheckboxCard } from '../../../components/CheckboxCard';
import { useForm, yupResolver } from '@mantine/form';
import { TextInput, Switch, Button, Group, Alert, Flex, Text, NumberInput, Textarea } from '@mantine/core';
import { DatePicker } from '@mantine/dates';
import Schema from '../../../schemas/Stop';
import { useState, useRef, useEffect, useCallback } from 'react';
import API from '../../../services/API';
import notify from '../../../services/notify';
import useSWR from 'swr';
import { TbArrowLeft, TbRotate, TbShieldCheck, TbAlertCircle } from 'react-icons/tb';

export default function StopsEdit() {
  //

  const router = useRouter();
  const { _id } = router.query;

  const { data: stop, mutate } = useSWR(_id && `/api/stops/${_id}`);

  const hasUpdatedFields = useRef(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState();

  const form = useForm({
    validateInputOnBlur: true,
    validateInputOnChange: true,
    clearInputErrorOnChange: true,
    validate: yupResolver(Schema),
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

  useEffect(() => {
    if (!hasUpdatedFields.current && stop) {
      form.setValues({
        unique_code: stop.unique_code || '',
        name: stop.name || '',
        short_name: stop.short_name || '',
        description: stop.description || '',
        latitude: stop.latitude || 0,
        longitude: stop.longitude || 0,
        features: {
          has_bench: stop.has_bench || false,
          has_crossing: stop.has_crossing || false,
          has_flag: stop.has_flag || false,
          has_abusive_parking: stop.has_abusive_parking || false,
        },
      });
      form.resetDirty();
      hasUpdatedFields.current = true;
    }
  }, [stop, form]);

  const handleClose = async () => {
    if (form.isValid()) {
      await handleSave(form.values);
      router.push(`/stops/${_id}`);
    }
  };

  const handleSave = useCallback(
    async (values) => {
      try {
        setIsLoading(true);
        notify('new', 'loading', 'Saving changes...');
        await API({ service: 'stops', resourceId: _id, operation: 'edit', method: 'PUT', body: values });
        mutate({ ...stop, ...values });
        notify('new', 'success', 'Changes saved!');
        setIsLoading(false);
        setIsError(false);
      } catch (err) {
        console.log(err);
        setIsLoading(false);
        setIsError(err);
        notify('new', 'error', err.message || 'An error occurred.');
      }
    },
    [_id, stop, mutate]
  );

  useEffect(() => {
    const autoSaveInterval = setInterval(async () => {
      if (form.isDirty() && form.isValid()) {
        await handleSave(form.values);
        hasUpdatedFields.current = false;
      }
    }, 1000);
    return () => clearInterval(autoSaveInterval);
  }, [form, handleSave]);

  return (
    <form onSubmit={form.onSubmit(handleSave)}>
      <PageContainer title={`Stops › ${form.values.unique_code}`}>
        {isError ? (
          <Alert icon={<TbAlertCircle />} title={`Error: ${isError.message}`} color='red'>
            <Flex gap='md' align='flex-start' direction='column'>
              <Text>{isError.description || 'No solutions found for this error.'}</Text>
              <Button
                type={'submit'}
                variant='default'
                color='red'
                leftIcon={<TbRotate />}
                disabled={!form.isValid()}
                loading={isLoading}
              >
                Try saving again
              </Button>
            </Flex>
          </Alert>
        ) : (
          <Group>
            <Button leftIcon={<TbArrowLeft />} onClick={handleClose} disabled={!form.isValid()}>
              Save & Close
            </Button>
            <Button
              type={'submit'}
              leftIcon={<TbShieldCheck />}
              variant='light'
              color='green'
              loading={isLoading}
              disabled={!form.isValid()}
            >
              {isLoading ? 'Saving changes...' : 'Changes are saved'}
            </Button>
          </Group>
        )}

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
