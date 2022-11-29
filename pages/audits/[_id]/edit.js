import { useRouter } from 'next/router';
import PageContainer from '../../../components/PageContainer';
import Pannel from '../../../components/Pannel';
import { Grid, GridCell } from '../../../components/Grid';
import { useForm, yupResolver } from '@mantine/form';
import { TextInput, LoadingOverlay, Switch, Button, Group } from '@mantine/core';
import { DatePicker } from '@mantine/dates';
import Schema from '../../../schemas/Audit';
import { useState, useRef, useEffect, useCallback } from 'react';
import API from '../../../services/API';
import notify from '../../../services/notify';
import useSWR from 'swr';
import { TbDeviceFloppy, TbUserExclamation, TbX } from 'react-icons/tb';

export default function AuditEdit() {
  //

  const router = useRouter();
  const { _id } = router.query;

  const { data: audit, mutate } = useSWR(_id && `/api/audits/${_id}`);

  const hasUpdatedFields = useRef(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    validateInputOnBlur: true,
    validateInputOnChange: true,
    clearInputErrorOnChange: true,
    validate: yupResolver(Schema),
    initialValues: {
      unique_code: '',
      first_name: '',
    },
  });

  useEffect(() => {
    if (!hasUpdatedFields.current && audit) {
      form.setValues({
        unique_code: audit.unique_code || '',
        first_name: audit.first_name || '',
      });
      form.resetDirty();
      hasUpdatedFields.current = true;
    }
  }, [audit, form]);

  const handleCancel = () => {
    router.push(`/audits/${_id}`);
  };

  const handleSave = useCallback(
    async (values) => {
      try {
        setIsLoading(true);
        notify('new', 'loading', 'Saving changes...');
        await API({ service: 'audits', resourceId: _id, operation: 'edit', method: 'PUT', body: values });
        mutate({ ...audit, ...values });
        notify('new', 'success', 'Changes saved!');
        setIsLoading(false);
      } catch (err) {
        console.log(err);
        setIsLoading(false);
        notify('new', 'error', err.message || 'An error occurred.');
      }
    },
    [_id, audit, mutate]
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
      <PageContainer title={`Audits › ${form.values.unique_code}`}>
        <Group>
          <Button type={'submit'} leftIcon={<TbDeviceFloppy />} loading={isLoading}>
            {isLoading ? 'Saving' : 'Save'}
          </Button>
          <Button leftIcon={<TbX />} onClick={handleCancel}>
            Cancel
          </Button>
        </Group>

        <Pannel title={'Customer Details'}>
          <Grid>
            <TextInput label={'First Name'} placeholder={'Alberta'} {...form.getInputProps('first_name')} />
            <TextInput label={'Last Name'} placeholder={'Soares'} {...form.getInputProps('last_name')} />
            <DatePicker label={'Birthday'} placeholder={'Pick a date'} {...form.getInputProps('birthday')} />
            <TextInput label={'Reference'} placeholder={'PT'} {...form.getInputProps('reference')} />
          </Grid>
        </Pannel>

        <Pannel title={'Invoicing'}>
          <Grid>
            <GridCell>
              <Switch
                label='Send Invoices'
                checked={form.values.send_invoices}
                onChange={({ currentTarget }) => form.setFieldValue('send_invoices', currentTarget.checked)}
              />
            </GridCell>
          </Grid>
          <Grid>
            <TextInput label={'Tax Region'} placeholder={'PT'} maxLength={2} {...form.getInputProps('tax_region')} />
            <TextInput
              label={'Tax Number'}
              placeholder={'500 100 200'}
              maxLength={11}
              {...form.getInputProps('tax_number')}
            />
          </Grid>
          <Grid>
            <TextInput
              label={'Contact Email'}
              placeholder={'email@icloud.com'}
              {...form.getInputProps('contact_email')}
            />
          </Grid>
        </Pannel>
      </PageContainer>
    </form>
  );
}