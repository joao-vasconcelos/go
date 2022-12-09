import { useRouter } from 'next/router';
import PageContainer from '../../../components/PageContainer';
import Pannel from '../../../components/Pannel';
import { Grid, GridCell } from '../../../components/Grid';
import { CheckboxCard } from '../../../components/CheckboxCard';
import { useForm, yupResolver } from '@mantine/form';
import { TextInput, MultiSelect, Button, Group, Alert, Flex, Text, NumberInput, Textarea } from '@mantine/core';
import { DatePicker } from '@mantine/dates';
import Schema from '../../../schemas/User';
import { useState, useRef, useEffect, useCallback } from 'react';
import API from '../../../services/API';
import notify from '../../../services/notify';
import useSWR from 'swr';
import AutoSaveButton from '../../../components/AutoSaveButton';
import { TbArrowLeft, TbRotate, TbShieldCheck, TbAlertCircle } from 'react-icons/tb';

const data = [
  { value: 'stops_view', label: 'View Stops', group: 'Stops' },
  { value: 'stops_create', label: 'Create Stops', group: 'Stops' },
  { value: 'stops_edit', label: 'Edit Stops', group: 'Stops' },
  { value: 'stops_delete', label: 'Delete Stops', group: 'Stops' },

  { value: 'audits_view', label: 'View Audits', group: 'Audits' },
  { value: 'audits_create', label: 'Create Audits', group: 'Audits' },
  { value: 'audits_edit', label: 'Edit Audits', group: 'Audits' },
  { value: 'audits_delete', label: 'Delete Audits', group: 'Audits' },

  { value: 'surveys_view', label: 'View Surveys', group: 'Surveys' },
  { value: 'surveys_create', label: 'Create Surveys', group: 'Surveys' },
  { value: 'surveys_edit', label: 'Edit Surveys', group: 'Surveys' },
  { value: 'surveys_delete', label: 'Delete Surveys', group: 'Surveys' },

  { value: 'users_view', label: 'View Users', group: 'Users' },
  { value: 'users_create', label: 'Create Users', group: 'Users' },
  { value: 'users_edit', label: 'Edit Users', group: 'Users' },
  { value: 'users_delete', label: 'Delete Users', group: 'Users' },
];

export default function UsersEdit() {
  //

  const router = useRouter();
  const { _id } = router.query;

  const { data: user, mutate } = useSWR(_id && `/api/users/${_id}`);

  const hasUpdatedFields = useRef(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState();

  const form = useForm({
    validateInputOnBlur: true,
    validateInputOnChange: true,
    clearInputErrorOnChange: true,
    validate: yupResolver(Schema),
    initialValues: {
      email: '',
      name: '',
      permissions: [],
    },
  });

  useEffect(() => {
    if (!hasUpdatedFields.current && user) {
      form.setValues({
        email: user.email || '',
        name: user.name || '',
        permissions: user.permissions || [],
      });
      form.resetDirty();
      hasUpdatedFields.current = true;
    }
  }, [user, form]);

  const handleClose = async () => {
    if (form.isValid()) {
      await handleSave(form.values);
      router.push(`/users/${_id}`);
    }
  };

  const handleSave = useCallback(
    async (values) => {
      try {
        setIsLoading(true);
        await API({
          service: 'users',
          resourceId: _id,
          operation: 'edit',
          method: 'PUT',
          body: { ...user, ...values },
        });
        mutate({ ...user, ...values });
        setIsLoading(false);
        setIsError(false);
      } catch (err) {
        console.log(err);
        setIsLoading(false);
        setIsError(err);
        notify('new', 'error', err.message || 'An error occurred.');
      }
    },
    [_id, user, mutate]
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
      <PageContainer title={['Users', form.values.name]}>
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
            <AutoSaveButton type={'submit'} isLoading={isLoading} isDirty={form.isDirty()} isValid={form.isValid()} />
          </Group>
        )}

        <Pannel title={'User Details'}>
          <Grid>
            <TextInput label={'Name'} placeholder={'Paula Conceição'} {...form.getInputProps('name')} />
            <TextInput label={'Email'} placeholder={'email@tmlmobilidade.pt'} {...form.getInputProps('email')} />
          </Grid>
          <Grid>
            <MultiSelect
              clearable
              searchable
              data={data}
              label='User permissions'
              placeholder='Select from available permissions'
              {...form.getInputProps('permissions')}
            />
          </Grid>
        </Pannel>
      </PageContainer>
    </form>
  );
}
