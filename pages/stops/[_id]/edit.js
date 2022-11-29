import { useRouter } from 'next/router';
import Button from '../../../components/Button';
import PageContainer from '../../../components/PageContainer';
import Toolbar from '../../../components/Toolbar';
import Group from '../../../components/Group';
import { Grid, GridCell } from '../../../components/Grid';
import { IoSave, IoClose } from 'react-icons/io5';
import { useForm, yupResolver } from '@mantine/form';
import { TextInput, LoadingOverlay, Switch } from '@mantine/core';
import { DatePicker } from '@mantine/dates';
import Schema from '../../../schemas/Stop';
import { useState, useRef, useEffect } from 'react';
import API from '../../../services/API';
import notify from '../../../services/notify';
import useSWR from 'swr';

export default function StopsEdit() {
  //

  const router = useRouter();
  const { _id } = router.query;

  const { data: customer, mutate } = useSWR(`/api/customers/${_id}`);

  const hasUpdatedFields = useRef(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    schema: yupResolver(Schema),
    initialValues: {
      first_name: '',
      last_name: '',
      tax_region: '',
      tax_number: '',
      contact_email: '',
      send_invoices: false,
      reference: '',
      birthday: '',
    },
  });

  useEffect(() => {
    if (!hasUpdatedFields.current && customer) {
      form.setValues({
        first_name: customer.first_name || '',
        last_name: customer.last_name || '',
        tax_region: customer.tax_region || '',
        tax_number: customer.tax_number || '',
        contact_email: customer.contact_email || '',
        send_invoices: customer.send_invoices,
        reference: customer.reference || '',
        birthday: customer.birthday ? new Date(customer.birthday) : '',
      });
      hasUpdatedFields.current = true;
    }
  }, [customer, form]);

  function handleCancel() {
    router.push(`/customers/${_id}`);
  }

  async function handleSave(values) {
    try {
      setIsLoading(true);
      notify('new', 'loading', 'Saving changes...');
      await API({ service: 'customers', resourceId: _id, operation: 'edit', method: 'PUT', body: values });
      mutate({ ...customer, ...values });
      router.push(`/customers/${_id}`);
      notify('new', 'success', 'Changes saved!');
    } catch (err) {
      console.log(err);
      setIsLoading(false);
      notify('new', 'error', 'An error occurred.');
    }
  }

  return (
    <form onSubmit={form.onSubmit(handleSave)}>
      <PageContainer
        title={
          'Customers › ' +
          (form.values.first_name || form.values.last_name
            ? `${form.values.first_name} ${form.values.last_name}`
            : 'New Customer')
        }
      >
        <LoadingOverlay visible={isLoading} />
        <Toolbar>
          <Button type={'submit'} icon={<IoSave />} label={'Save'} color={'primary'} />
          <Button icon={<IoClose />} label={'Cancel'} onClick={handleCancel} />
        </Toolbar>

        <Group title={'Customer Details'}>
          <Grid>
            <TextInput label={'First Name'} placeholder={'Alberta'} {...form.getInputProps('first_name')} />
            <TextInput label={'Last Name'} placeholder={'Soares'} {...form.getInputProps('last_name')} />
            <DatePicker label={'Birthday'} placeholder={'Pick a date'} {...form.getInputProps('birthday')} />
            <TextInput label={'Reference'} placeholder={'PT'} {...form.getInputProps('reference')} />
          </Grid>
        </Group>

        <Group title={'Invoicing'}>
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
        </Group>
      </PageContainer>
    </form>
  );
}
