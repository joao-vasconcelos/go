'use client';

/* * */

import Pannel from '@/components/Pannel/Pannel';
import Text from '@/components/Text/Text';
import { Section } from '@/components/Layouts/Layouts';
import { useTranslations } from 'next-intl';
import { SimpleGrid, TextInput, Divider, ColorInput } from '@mantine/core';
import { useMediaExplorerContext } from '@/contexts/MediaExplorerContext';
import MediaExplorerIdPageHeader from '@/components/MediaExplorerIdPageHeader/MediaExplorerIdPageHeader';

/* * */

export default function MediaExplorerIdPage() {
  //

  //
  // A. Setup variables

  const t = useTranslations('MediaExplorerIdPage');
  const mediaExplorerContext = useMediaExplorerContext();

  //
  // B. Render components

  return (
    <Pannel loading={mediaExplorerContext.page.is_loading} header={<MediaExplorerIdPageHeader />}>
      <Section>
        <div>
          <Text size="h2">{t('sections.config.title')}</Text>
          <Text size="h4">{t('sections.config.description')}</Text>
        </div>
        <SimpleGrid cols={3}>
          <TextInput label={t('form.label.label')} placeholder={t('form.label.placeholder')} {...mediaExplorerContext.form.getInputProps('label')} readOnly={mediaExplorerContext.page.is_read_only} />
        </SimpleGrid>
        <SimpleGrid cols={1}>
          <TextInput label={t('form.description.label')} placeholder={t('form.description.placeholder')} {...mediaExplorerContext.form.getInputProps('description')} readOnly={mediaExplorerContext.page.is_read_only} />
        </SimpleGrid>
      </Section>
      <Divider />
      <Section>
        <SimpleGrid cols={2}>
          <ColorInput label={t('form.color.label')} placeholder={t('form.color.placeholder')} {...mediaExplorerContext.form.getInputProps('color')} readOnly={mediaExplorerContext.page.is_read_only} />
          <ColorInput label={t('form.text_color.label')} placeholder={t('form.text_color.placeholder')} {...mediaExplorerContext.form.getInputProps('text_color')} readOnly={mediaExplorerContext.page.is_read_only} />
        </SimpleGrid>
      </Section>
    </Pannel>
  );
}
