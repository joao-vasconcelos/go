import { useRouter } from 'next/router';
import PageContainer from '../../../components/PageContainer';
import Pannel from '../../../components/Pannel';
import { Grid, GridCell } from '../../../components/Grid';
import { CheckboxCard } from '../../../components/CheckboxCard';
import { useForm, yupResolver } from '@mantine/form';
import { TextInput, Switch, Button, Group, Alert, Flex, Text, NumberInput, Textarea } from '@mantine/core';
import AutoSaveButton from '../../../components/AutoSaveButton';
import Schema from '../../../schemas/Survey';
import { useState, useRef, useEffect, useCallback } from 'react';
import API from '../../../services/API';
import useSWR from 'swr';
import { TbArrowLeft, TbRotate, TbShieldCheck, TbAlertCircle } from 'react-icons/tb';
import ErrorDisplay from '../../../components/ErrorDisplay';

export default function SurveysEdit() {
  //

  const router = useRouter();
  const { _id } = router.query;

  const { data, error, mutate } = useSWR(_id && `/api/surveys/${_id}`);

  const hasUpdatedFields = useRef(false);
  const [isSaving, setIsSaving] = useState(false);
  const [hasErrorSaving, setHasErrorSaving] = useState();

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
    },
  });

  useEffect(() => {
    if (!hasUpdatedFields.current && data) {
      form.setValues(data);
      form.resetDirty();
      hasUpdatedFields.current = true;
    }
  }, [data, form]);

  const handleClose = async () => {
    if (form.isValid()) {
      await handleSave(form.values, () => {
        router.push(`/surveys/${_id}`);
      });
    }
  };

  const handleSave = useCallback(
    async (values, callback) => {
      try {
        setIsSaving(true);
        await API({ service: 'surveys', resourceId: _id, operation: 'edit', method: 'PUT', body: form.values });
        mutate({ ...data, ...form.values });
        setIsSaving(false);
        setHasErrorSaving(false);
        hasUpdatedFields.current = false;
        if (callback) callback();
      } catch (err) {
        console.log(err);
        setIsSaving(false);
        setHasErrorSaving(err);
      }
    },
    [_id, data, form.values, mutate]
  );

  return (
    <form onSubmit={form.onSubmit(handleSave)}>
      <PageContainer title={['Surveys', form.values.unique_code]} loading={!error && !data}>
        <ErrorDisplay error={error} />
        <ErrorDisplay
          error={hasErrorSaving}
          loading={isSaving}
          disabled={!form.isValid()}
          onTryAgain={async () => await handleSave(form.values)}
        />

        <Group>
          <Button leftIcon={<TbArrowLeft />} onClick={handleClose} disabled={!form.isValid() || isSaving}>
            Save & Close
          </Button>
          <AutoSaveButton
            type={'submit'}
            isLoading={isSaving}
            isDirty={form.isDirty()}
            isValid={form.isValid()}
            onSaveTrigger={async () => await handleSave(form.values)}
          />
        </Group>

        {data && (
          <>
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
          </>
        )}
      </PageContainer>
    </form>
  );
}
