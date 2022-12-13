import { useRouter } from 'next/router';
import useSWR from 'swr';
import { useState, useRef, useEffect, useCallback } from 'react';
import API from '../../../services/API';
import { Validation } from '../../../schemas/surveys/documents';
import PageContainer from '../../../components/PageContainer';
import Pannel from '../../../components/Pannel';
import { Grid } from '../../../components/Grid';
import { useForm, yupResolver } from '@mantine/form';
import { TextInput, NumberInput, Textarea } from '@mantine/core';
import SaveButtons from '../../../components/SaveButtons';
import ErrorDisplay from '../../../components/ErrorDisplay';

/* * */
/* SURVEYS > EDIT */
/* Edit survey by _id. */
/* * */

export default function SurveysEdit() {
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

  const { data: surveyData, error: surveyError, mutate: surveyMutate } = useSWR(_id && `/api/surveys/${_id}`);

  //
  // C. Setup form

  const form = useForm({
    validateInputOnBlur: true,
    validateInputOnChange: true,
    clearInputErrorOnChange: true,
    validate: yupResolver(Validation),
    initialValues: {
      unique_code: '',
      name: '',
      short_name: '',
      description: '',
      latitude: 0,
      longitude: 0,
    },
  });

  useEffect(() => {
    if (!hasUpdatedFields.current && surveyData) {
      form.setValues(surveyData);
      form.resetDirty();
      hasUpdatedFields.current = true;
    }
  }, [surveyData, form]);

  //
  // D. Handle actions

  const handleClose = async () => {
    router.push(`/surveys/${_id}`);
  };

  const handleSave = useCallback(async () => {
    try {
      setIsSaving(true);
      await API({ service: 'surveys', resourceId: _id, operation: 'edit', method: 'PUT', body: form.values });
      surveyMutate({ ...surveyData, ...form.values });
      setIsSaving(false);
      setHasErrorSaving(false);
      hasUpdatedFields.current = false;
    } catch (err) {
      console.log(err);
      setIsSaving(false);
      setHasErrorSaving(err);
    }
  }, [_id, surveyData, form.values, surveyMutate]);

  //
  // E. Render components

  return (
    <form onSubmit={form.onSubmit(async () => await handleSave())}>
      <PageContainer title={['Surveys', form?.values?.unique_code]} loading={!surveyError && !surveyData}>
        <ErrorDisplay error={surveyError} />
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
      </PageContainer>
    </form>
  );
}
