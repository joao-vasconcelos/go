import { useRouter } from 'next/router';
import useSWR from 'swr';
import { useState, useRef, useEffect, useCallback } from 'react';
import API from '../../../services/API';
import { Validation } from '../../../schemas/stops/documents';
import PageContainer from '../../../components/PageContainer';
import Pannel from '../../../components/Pannel';
import { CheckboxCard } from '../../../components/CheckboxCard';
import { Grid } from '../../../components/Grid';
import { useForm, yupResolver } from '@mantine/form';
import { TextInput, NumberInput, Textarea } from '@mantine/core';
import SaveButtons from '../../../components/SaveButtons';
import ErrorDisplay from '../../../components/ErrorDisplay';

/* * */
/* STOPS > EDIT */
/* Edit stop by _id. */
/* * */

export default function StopsEdit() {
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

  const { data: stopData, error: stopError, mutate: stopMutate } = useSWR(_id && `/api/stops/${_id}`);

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
      features: {
        has_bench: false,
        has_crossing: false,
        has_flag: false,
        has_abusive_parking: false,
      },
    },
  });

  useEffect(() => {
    if (!hasUpdatedFields.current && stopData) {
      form.setValues(stopData);
      form.resetDirty();
      hasUpdatedFields.current = true;
    }
  }, [stopData, form]);

  //
  // D. Handle actions

  const handleClose = async () => {
    router.push(`/stops/${_id}`);
  };

  const handleSave = useCallback(async () => {
    try {
      setIsSaving(true);
      await API({ service: 'stops', resourceId: _id, operation: 'edit', method: 'PUT', body: form.values });
      stopMutate({ ...stopData, ...form.values });
      setIsSaving(false);
      setHasErrorSaving(false);
      hasUpdatedFields.current = false;
    } catch (err) {
      console.log(err);
      setIsSaving(false);
      setHasErrorSaving(err);
    }
  }, [_id, stopData, form.values, stopMutate]);

  //
  // E. Render components

  return (
    <form onSubmit={form.onSubmit(async () => await handleSave())}>
      <PageContainer title={['Stops', form?.values?.unique_code]} loading={!stopError && !stopData}>
        <ErrorDisplay error={stopError} />
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
