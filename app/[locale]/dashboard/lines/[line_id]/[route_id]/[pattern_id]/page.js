'use client';

import useSWR from 'swr';
import { useState, useCallback, useMemo } from 'react';
import { useParams } from 'next/navigation';
import { useRouter } from 'next-intl/client';
import { yupResolver } from '@mantine/form';
import { PatternFormProvider, usePatternForm } from '@/contexts/patternForm';
import API from '@/services/API';
import { Validation as PatternValidation } from '@/schemas/Pattern/validation';
import { Default as PatternDefault } from '@/schemas/Pattern/default';
import { Tooltip, Button, SimpleGrid, TextInput, ActionIcon, Divider, Select } from '@mantine/core';
import { IconExternalLink, IconTrash } from '@tabler/icons-react';
import Pannel from '@/components/Pannel/Pannel';
import Text from '@/components/Text/Text';
import { Section } from '@/components/Layouts/Layouts';
import AutoSave from '@/components/AutoSave/AutoSave';
import notify from '@/services/notify';
import { openConfirmModal } from '@mantine/modals';
import LineDisplay from '@/components/LineDisplay/LineDisplay';
import StopSequenceTable from '@/components/StopSequenceTable/StopSequenceTable';
import SchedulesTable from '@/components/SchedulesTable/SchedulesTable';
import { useTranslations } from 'next-intl';
import { useSession } from 'next-auth/react';
import AuthGate, { isAllowed } from '@/components/AuthGate/AuthGate';
import { merge } from 'lodash';
import ImportPathFromGTFS from '@/components/ImportPathFromGTFS/ImportPathFromGTFS';

export default function Page() {
  //

  //
  // A. Setup variables

  const router = useRouter();
  const t = useTranslations('patterns');
  const [isSaving, setIsSaving] = useState(false);
  const [hasErrorSaving, setHasErrorSaving] = useState();
  const [isImporting, setIsImporting] = useState();
  const [isCreatingSchedule, setIsCreatingSchedule] = useState();
  const { data: session } = useSession();
  const isReadOnly = !isAllowed(session, 'lines', 'create_edit');

  const { line_id, route_id, pattern_id } = useParams();

  //
  // B. Fetch data

  const { data: allShapesData } = useSWR('/api/shapes');
  const { data: lineData } = useSWR(line_id && `/api/lines/${line_id}`);
  const { data: routeData, error: routeError, isLoading: routeLoading, isValidating: routeValidating, mutate: routeMutate } = useSWR(route_id && `/api/routes/${route_id}`);
  const { data: typologyData } = useSWR(lineData && lineData.typology && `/api/typologies/${lineData.typology}`);
  const { data: patternData, error: patternError, isLoading: patternLoading, mutate: patternMutate } = useSWR(pattern_id && `/api/patterns/${pattern_id}`, { onSuccess: (data) => keepFormUpdated(data) });

  //
  // C. Setup patternForm

  const patternForm = usePatternForm({
    validateInputOnBlur: true,
    validateInputOnChange: true,
    clearInputErrorOnChange: true,
    validate: yupResolver(PatternValidation),
    initialValues: PatternDefault,
  });

  const keepFormUpdated = (data) => {
    if (!patternForm.isDirty()) {
      const merged = merge({ ...PatternDefault, ...data });
      patternForm.setValues(merged);
      patternForm.resetDirty(merged);
    }
  };

  //
  // D. Format data

  const allShapesDataFormatted = useMemo(() => {
    return allShapesData
      ? allShapesData.map((item) => {
          return { value: item._id, label: `[${item.code}] ${item.name || '-'}` };
        })
      : [];
  }, [allShapesData]);

  //
  // D. Handle actions

  const handleValidate = () => {
    patternForm.validate();
  };

  const handleClose = async () => {
    router.push(`/dashboard/lines/${line_id}/${route_id}`);
  };

  const handleSave = useCallback(async () => {
    try {
      setIsSaving(true);
      await API({ service: 'patterns', resourceId: pattern_id, operation: 'edit', method: 'PUT', body: patternForm.values });
      patternMutate();
      patternForm.resetDirty();
      setIsSaving(false);
      setHasErrorSaving(false);
    } catch (err) {
      console.log(err);
      setIsSaving(false);
      setHasErrorSaving(err);
    }
  }, [pattern_id, patternForm, patternMutate]);

  const handleDelete = async () => {
    openConfirmModal({
      title: <Text size='h2'>{t('operations.delete.title')}</Text>,
      centered: true,
      closeOnClickOutside: true,
      children: <Text size='h3'>{t('operations.delete.description')}</Text>,
      labels: { confirm: t('operations.delete.confirm'), cancel: t('operations.delete.cancel') },
      confirmProps: { color: 'red' },
      onConfirm: async () => {
        try {
          notify(pattern_id, 'loading', t('operations.delete.loading'));
          await API({ service: 'patterns', resourceId: pattern_id, operation: 'delete', method: 'DELETE' });
          router.push(`/dashboard/lines/${line_id}/${route_id}`);
          notify(pattern_id, 'success', t('operations.delete.success'));
        } catch (err) {
          console.log(err);
          notify(pattern_id, 'error', err.message || t('operations.delete.error'));
        }
      },
    });
  };

  const handleCreateSchedule = async () => {
    patternForm.insertListItem('schedules', PatternDefault.schedules[0]);
  };

  const handleImportPath = async (importedPath) => {
    console.log('importedPath', importedPath);
    openConfirmModal({
      title: (
        <Text size={'lg'} fw={700}>
          Replace path?
        </Text>
      ),
      centered: true,
      closeOnClickOutside: true,
      children: <Text>Tem a certeza que pretende eliminar este horário?</Text>,
      labels: { confirm: 'Sim, importar percurso', cancel: 'Manter como está' },
      onConfirm: async () => {
        try {
          setIsImporting(true);
          await API({ service: 'patterns', resourceId: pattern_id, operation: 'import', method: 'PUT', body: importedPath });
          patternMutate();
          patternForm.resetDirty();
          setIsImporting(false);
          setHasErrorSaving(false);
        } catch (err) {
          console.log(err);
          setIsImporting(false);
          setHasErrorSaving(err);
        }
      },
    });
  };

  //
  // E. Render components

  return (
    <Pannel
      loading={patternLoading || isImporting}
      header={
        <>
          <AutoSave
            isValid={patternForm.isValid()}
            isDirty={patternForm.isDirty()}
            isLoading={patternLoading}
            isErrorValidating={patternError}
            isSaving={isSaving}
            isErrorSaving={hasErrorSaving}
            onValidate={() => handleValidate()}
            onSave={async () => await handleSave()}
            onClose={async () => await handleClose()}
            closeType='back'
          />
          <LineDisplay short_name={lineData && lineData.short_name} name={patternForm.values.headsign || t('untitled')} color={typologyData && typologyData.color} text_color={typologyData && typologyData.text_color} />
          <Tooltip label='Ver no site' color='blue' position='bottom' withArrow>
            <ActionIcon color='blue' variant='light' size='lg'>
              <IconExternalLink size='20px' />
            </ActionIcon>
          </Tooltip>
          <AuthGate scope='lines' permission='delete'>
            <Tooltip label={t('operations.delete.title')} color='red' position='bottom' withArrow>
              <ActionIcon color='red' variant='light' size='lg' onClick={handleDelete}>
                <IconTrash size='20px' />
              </ActionIcon>
            </Tooltip>
          </AuthGate>
        </>
      }
    >
      <PatternFormProvider form={patternForm}>
        <form onSubmit={patternForm.onSubmit(async () => await handleSave())}>
          <Section>
            <Text size='h2'>{t('sections.config.title')}</Text>
            <SimpleGrid cols={4}>
              <TextInput label={t('form.code.label')} placeholder={t('form.code.placeholder')} {...patternForm.getInputProps('code')} readOnly />
            </SimpleGrid>
            <SimpleGrid cols={2}>
              <TextInput label={t('form.headsign.label')} placeholder={t('form.headsign.placeholder')} description={t('form.headsign.description')} {...patternForm.getInputProps('headsign')} />
              <Select
                label={t('form.shape.label')}
                placeholder={t('form.shape.placeholder')}
                nothingFound={t('form.shape.nothingFound')}
                // description={t.rich('form.shape.description', {
                //   link: (chunks) =>
                //     patternForm.values.shape && (
                //       <a href={`/dashboard/shapes/${patternForm.values.shape}`} target='_blank'>
                //         {chunks}
                //       </a>
                //     ),
                // })}
                {...patternForm.getInputProps('shape')}
                data={allShapesDataFormatted}
                searchable
                clearable
              />
            </SimpleGrid>
          </Section>

          <Divider />

          <Section>
            <div>
              <Text size='h2'>{t('sections.path.title')}</Text>
              <Text size='h4'>{t('sections.path.description')}</Text>
            </div>
            <StopSequenceTable />
          </Section>

          <Divider />

          <Section>
            <div>
              <Text size='h2'>{t('sections.update_path.title')}</Text>
              <Text size='h4'>{t('sections.update_path.description')}</Text>
            </div>
            <ImportPathFromGTFS onImport={handleImportPath} />
          </Section>

          <Divider />

          <Section>
            <div>
              <Text size='h2'>{t('sections.schedules.title')}</Text>
              <Text size='h4'>{t('sections.schedules.description')}</Text>
            </div>
            <SchedulesTable />
          </Section>
        </form>
      </PatternFormProvider>
    </Pannel>
  );
}
