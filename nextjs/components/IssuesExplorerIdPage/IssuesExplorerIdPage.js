'use client';

/* * */

import Pannel from '@/components/Pannel/Pannel';
import { Section } from '@/components/Layouts/Layouts';
import { useTranslations } from 'next-intl';
import { SimpleGrid, Divider, ColorInput } from '@mantine/core';
import { useIssuesExplorerContext } from '@/contexts/IssuesExplorerContext';
import IssuesExplorerIdPageHeader from '@/components/IssuesExplorerIdPageHeader/IssuesExplorerIdPageHeader';
import IssuesExplorerIdPageItemTitle from '../IssuesExplorerIdPageItemTitle/IssuesExplorerIdPageItemTitle';
import IssuesExplorerIdPageItemTags from '../IssuesExplorerIdPageItemTags/IssuesExplorerIdPageItemTags';

/* * */

export default function IssuesExplorerIdPage() {
  //

  //
  // A. Setup variables

  const t = useTranslations('IssuesExplorerIdPage');
  const issuesExplorerContext = useIssuesExplorerContext();

  //
  // B. Render components

  return (
    <Pannel loading={issuesExplorerContext.page.is_loading} header={<IssuesExplorerIdPageHeader />}>
      {issuesExplorerContext.form.values.created_by || 'not found'}
      <IssuesExplorerIdPageItemTitle />
      <IssuesExplorerIdPageItemTags />
      <Divider />
      <Section>
        <SimpleGrid cols={2}>
          <ColorInput label={t('form.color.label')} placeholder={t('form.color.placeholder')} {...issuesExplorerContext.form.getInputProps('color')} readOnly={issuesExplorerContext.page.is_read_only} />
          <ColorInput label={t('form.text_color.label')} placeholder={t('form.text_color.placeholder')} {...issuesExplorerContext.form.getInputProps('text_color')} readOnly={issuesExplorerContext.page.is_read_only} />
        </SimpleGrid>
      </Section>
      <Divider />
      <Section>
        <SimpleGrid cols={2}>
          <ColorInput label={t('form.color.label')} placeholder={t('form.color.placeholder')} {...issuesExplorerContext.form.getInputProps('color')} readOnly={issuesExplorerContext.page.is_read_only} />
          <ColorInput label={t('form.text_color.label')} placeholder={t('form.text_color.placeholder')} {...issuesExplorerContext.form.getInputProps('text_color')} readOnly={issuesExplorerContext.page.is_read_only} />
        </SimpleGrid>
      </Section>
    </Pannel>
  );
}
