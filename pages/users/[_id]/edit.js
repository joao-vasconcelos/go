import { useRouter } from 'next/router';
import PageContainer from '../../../components/PageContainer';
import Pannel from '../../../components/Pannel';
import { Grid } from '../../../components/Grid';
import { useForm, yupResolver } from '@mantine/form';
import { TextInput, MultiSelect } from '@mantine/core';
import { Validation } from '../../../schemas/users/documents';
import { useState, useRef, useEffect, useCallback } from 'react';
import API from '../../../services/API';
import useSWR from 'swr';
import SaveButtons from '../../../components/SaveButtons';
import ErrorDisplay from '../../../components/ErrorDisplay';

/* * */
/* USERS > EDIT */
/* Edit user by _id. */
/* * */

export default function UsersEdit() {
  //

  //
  // A. Setup variables

  const router = useRouter();
  const { _id } = router.query;
  const hasUpdatedFields = useRef(false);
  const [isSaving, setIsSaving] = useState(false);
  const [hasErrorSaving, setHasErrorSaving] = useState();

  //
  // B. Fetch data

  const { data: permissionsData, error: permissionsError } = useSWR('/api/auth/permissions');
  const { data: userData, error: userError, mutate: userMutate } = useSWR(_id && `/api/users/${_id}`);

  //
  // C. Setup form

  const form = useForm({
    validateInputOnBlur: true,
    validateInputOnChange: true,
    clearInputErrorOnChange: true,
    validate: yupResolver(Validation),
    initialValues: {
      email: '',
      name: '',
      permissions: [],
    },
  });

  useEffect(() => {
    if (!hasUpdatedFields.current && userData) {
      form.setValues(userData);
      form.resetDirty();
      hasUpdatedFields.current = true;
    }
  }, [userData, form]);

  //
  // D. Handle actions

  const handleClose = async () => {
    router.push(`/users/${_id}`);
  };

  const handleSave = useCallback(async () => {
    try {
      setIsSaving(true);
      await API({ service: 'users', resourceId: _id, operation: 'edit', method: 'PUT', body: form.values });
      userMutate({ ...userData, ...form.values });
      setIsSaving(false);
      setHasErrorSaving(false);
      hasUpdatedFields.current = false;
    } catch (err) {
      console.log(err);
      setIsSaving(false);
      setHasErrorSaving(err);
    }
  }, [_id, userData, form.values, userMutate]);

  //
  // E. Render components

  return (
    <form onSubmit={form.onSubmit(async () => await handleSave())}>
      <PageContainer title={['Surveys', form?.values?.unique_code]} loading={!userError && !userData}>
        <ErrorDisplay error={userError} />
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

        <Pannel title={'User Details'}>
          <Grid>
            <TextInput label={'Name'} placeholder={'Paula Conceição'} {...form.getInputProps('name')} />
            <TextInput label={'Email'} placeholder={'email@tmlmobilidade.pt'} {...form.getInputProps('email')} />
          </Grid>
          <Grid>
            <MultiSelect
              clearable
              searchable
              data={permissionsData || []}
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
