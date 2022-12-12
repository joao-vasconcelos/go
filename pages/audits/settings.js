import { useRouter } from 'next/router';
import PageContainer from '../../components/PageContainer';
import Pannel from '../../components/Pannel';
import { Grid } from '../../components/Grid';
import { useForm, yupResolver } from '@mantine/form';
import { TextInput } from '@mantine/core';
import { DatePicker } from '@mantine/dates';
import Schema from '../../schemas/Setting';
import { useState, useRef, useEffect, useCallback } from 'react';
import API from '../../services/API';
import SaveButtons from '../../components/SaveButtons';
import ErrorDisplay from '../../components/ErrorDisplay';
import useSWR from 'swr';

/* * */
/* AUDITS > SETTINGS */
/* Edit audit settings. */
/* * */

export default function AuditsSettings() {
  //

  //
  // A. Setup variables

  const router = useRouter();
  const hasUpdatedFields = useRef(false);
  const [isSaving, setIsSaving] = useState(false);
  const [hasErrorSaving, setHasErrorSaving] = useState();

  //
  // B. Fetch data

  const { data: settingsData, error: settingsError, mutate: settingsMutate } = useSWR('/api/settings/audits');

  //
  // C. Setup form

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
    if (!hasUpdatedFields.current && settingsData) {
      form.setValues(settingsData);
      form.resetDirty();
      hasUpdatedFields.current = true;
    }
  }, [settingsData, form]);

  //
  // D. Handle actions

  const handleClose = async () => {
    router.push('/audits');
  };

  const handleSave = useCallback(async () => {
    try {
      setIsSaving(true);
      await API({ service: 'settings', resourceId: 'audits', operation: 'edit', method: 'PUT', body: form.values });
      settingsMutate({ ...settingsData, ...form.values });
      setIsSaving(false);
      setHasErrorSaving(false);
      hasUpdatedFields.current = false;
    } catch (err) {
      console.log(err);
      setIsSaving(false);
      setHasErrorSaving(err);
    }
  }, [settingsData, form.values, settingsMutate]);

  //
  // E. Render components

  return (
    <form onSubmit={form.onSubmit(async () => await handleSave())}>
      <PageContainer title={['Audits', 'Settings']} loading={!settingsError && !settingsData}>
        <ErrorDisplay error={settingsError} />
        <ErrorDisplay
          error={hasErrorSaving}
          loading={isSaving}
          disabled={!form.isValid()}
          onTryAgain={async () => await handleSave()}
        />

        <SaveButtons
          isLoading={isSaving}
          isDirty={form.isDirty()}
          isValid={form.isValid()}
          onSave={async () => await handleSave()}
          onClose={async () => await handleClose()}
        />

        <Pannel title={'Customer Details'}>
          <Grid>
            <TextInput label={'First Name'} placeholder={'Alberta'} {...form.getInputProps('first_name')} />
            <TextInput label={'Last Name'} placeholder={'Soares'} {...form.getInputProps('last_name')} />
            <DatePicker label={'Birthday'} placeholder={'Pick a date'} {...form.getInputProps('birthday')} />
            <TextInput label={'Reference'} placeholder={'PT'} {...form.getInputProps('reference')} />
          </Grid>
        </Pannel>
      </PageContainer>
    </form>
  );
}
