'use client';

import { useMemo, useState } from 'react';
import useSWR from 'swr';
import { useRouter } from 'next/navigation';
import API from '@/services/API';
import { useDisclosure } from '@mantine/hooks';
import { Default as ThreadDefault } from '@/schemas/Thread/default';
import { Modal, Button, MultiSelect, Textarea } from '@mantine/core';
import { Select, SimpleGrid, TextInput } from '@mantine/core';
import { useTranslations } from 'next-intl';
import { useForm } from '@mantine/form';
import { IconCalendarPlus } from '@tabler/icons-react';
import notify from '@/services/notify';
import Loader from '@/components/Loader/Loader';
import { useSession } from 'next-auth/react';
import AuthGate from '@/components/AuthGate/AuthGate';
import { OneFullColumn } from '@/components/Layouts/Layouts';

export default function Page() {
  //

  //
  // A. Setup variables

  const router = useRouter();
  const t = useTranslations('threads');
  const { data: session } = useSession();
  const [isModalPresented, { open: openModal, close: closeModal }] = useDisclosure(false);

  const [isCreating, setIsCreating] = useState(false);

  //
  // C. Fetch data

  const { data: linesData, error: linesError, isLoading: linesLoading, isValidating: linesValidating } = useSWR('/api/lines');
  const { data: stopsData, error: stopsError, isLoading: stopsLoading, isValidating: stopsValidating } = useSWR('/api/stops');

  const linesDataFormatted = useMemo(() => {
    if (!linesData) return [];
    return linesData.map((item) => {
      return { value: item._id, label: `${item.line_short_name} - ${item.line_long_name}` };
    });
  }, [linesData]);

  const stopsDataFormatted = useMemo(() => {
    if (!stopsData) return [];
    return stopsData.map((item) => {
      return { value: item._id, label: `[${item.stop_code}] ${item.stop_name}` };
    });
  }, [stopsData]);

  //
  // B. Setup form

  const form = useForm({
    initialValues: ThreadDefault,
  });

  //
  // C. Helper functions

  //
  // C. Handle actions

  const handleCreate = async () => {
    try {
      setIsCreating(true);
      notify('create', 'loading', t('operations.create.loading'));
      const newThread = {
        subject: form.values.subject,
        owner: session.user.id,
        status: 'open',
        theme: form.values.theme,
        associated_lines: form.values.associated_lines,
        associated_stops: form.values.associated_stops,
      };
      const response = await API({ service: 'threads', operation: 'create', method: 'POST', body: newThread });
      router.push(`/dashboard/threads/${response._id}`);
      notify('create', 'success', t('operations.create.loading'));
      setIsCreating(false);
      closeModal();
    } catch (err) {
      console.log(err);
      setIsCreating(false);
      notify('create', 'error', t('operations.create.error'));
    }
  };

  //
  // D. Render components

  return (
    <OneFullColumn
      first={
        <>
          <Button leftSection={<IconCalendarPlus size="20px" />} onClick={openModal} variant="light" color="blue" size="sm">
            {t('operations.create.title')}
          </Button>
          <AuthGate permission="dates_edit"></AuthGate>
          <Modal opened={isModalPresented} onClose={closeModal} title={t('operations.create.title')} size={1000} centered>
            <Loader visible={isCreating} full />
            <form onSubmit={form.onSubmit(handleCreate)}>
              <SimpleGrid cols={1}>
                <TextInput label={t('form.subject.label')} placeholder={t('form.subject.placeholder')} {...form.getInputProps('subject')} withAsterisk />
                <Select
                  label={t('form.theme.label')}
                  placeholder={t('form.theme.placeholder')}
                  nothingFoundMessage={t('form.theme.nothingFound')}
                  data={[
                    { value: 'stops', label: t('form.theme.options.stops') },
                    { value: 'lines', label: t('form.theme.options.lines') },
                    { value: 'schedules', label: t('form.theme.options.schedules') },
                  ]}
                  {...form.getInputProps('theme')}
                  searchable
                  withAsterisk
                />
                <MultiSelect label={t('form.associated_lines.label')} placeholder={t('form.associated_lines.placeholder')} nothingFoundMessage={t('form.associated_lines.nothingFound')} data={linesDataFormatted} {...form.getInputProps('associated_lines')} searchable />
                <MultiSelect label={t('form.associated_stops.label')} placeholder={t('form.associated_stops.placeholder')} nothingFoundMessage={t('form.associated_stops.nothingFound')} data={stopsDataFormatted} {...form.getInputProps('associated_stops')} searchable />
                <Textarea label={t('form.associated_stops.label')} placeholder={t('form.associated_stops.placeholder')} />
                <Button size="lg" onClick={handleCreate} disabled={!form.isValid()}>
                  {t('operations.create.title')}
                </Button>
              </SimpleGrid>
            </form>
          </Modal>
        </>
      }
    ></OneFullColumn>
  );
}
