'use client';

/* * */

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Modal, SimpleGrid, TextInput, Textarea } from '@mantine/core';
import Text from '@/components/Text/Text';
import { useIssuesExplorerContext } from '@/contexts/IssuesExplorerContext';
import { Section } from '../Layouts/Layouts';

/* * */

export default function IssuesExplorerIdPageItemTitle() {
  //

  //
  // A. Setup variables

  const t = useTranslations('IssuesExplorerIdPageItemTitle');
  const issuesExplorerContext = useIssuesExplorerContext();
  const [isEditMode, setIsEditMode] = useState(false);

  //
  // B. Render components

  const handleEnterEditMode = () => {
    setIsEditMode(true);
  };

  const handleExitEditMode = () => {
    setIsEditMode(false);
  };

  //
  // B. Render components

  return (
    <>
      <Modal opened={isEditMode} onClose={handleExitEditMode} title="Focus demo" size={600}>
        <SimpleGrid cols={1}>
          <TextInput label={t('form.title.label')} placeholder={t('form.title.placeholder')} {...issuesExplorerContext.form.getInputProps('title')} readOnly={issuesExplorerContext.page.is_read_only} />
          <Textarea label={t('form.summary.label')} placeholder={t('form.summary.placeholder')} {...issuesExplorerContext.form.getInputProps('summary')} readOnly={issuesExplorerContext.page.is_read_only} minRows={5} autosize />
        </SimpleGrid>
      </Modal>
      <Section>
        <SimpleGrid cols={1}>
          <Text size="h2" onClick={handleEnterEditMode}>
            {issuesExplorerContext.form.values.title || 'untitled'}
          </Text>
          <Text size="h4">{issuesExplorerContext.form.values.summary || 'untitled'}</Text>
        </SimpleGrid>
      </Section>
    </>
  );
}
