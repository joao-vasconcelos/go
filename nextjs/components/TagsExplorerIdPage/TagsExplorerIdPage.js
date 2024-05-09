'use client';

/* * */

import Pannel from '@/components/Pannel/Pannel';
import Text from '@/components/Text/Text';
import { Section } from '@/components/Layouts/Layouts';
import { useTranslations } from 'next-intl';
import { SimpleGrid, TextInput, Divider, ColorInput } from '@mantine/core';
import { useTagsExplorerContext } from '@/contexts/TagsExplorerContext';
import TagsExplorerIdPageHeader from '@/components/TagsExplorerIdPageHeader/TagsExplorerIdPageHeader';

/* * */

export default function TagsExplorerIdPage() {
	//

	//
	// A. Setup variables

	const t = useTranslations('TagsExplorerIdPage');
	const tagsExplorerContext = useTagsExplorerContext();

	//
	// B. Render components

	return (
		<Pannel loading={tagsExplorerContext.page.is_loading} header={<TagsExplorerIdPageHeader />}>
			<Section>
				<div>
					<Text size="h2">{t('sections.config.title')}</Text>
					<Text size="h4">{t('sections.config.description')}</Text>
				</div>
				<SimpleGrid cols={3}>
					<TextInput label={t('form.label.label')} placeholder={t('form.label.placeholder')} {...tagsExplorerContext.form.getInputProps('label')} readOnly={tagsExplorerContext.page.is_read_only} />
				</SimpleGrid>
				<SimpleGrid cols={1}>
					<TextInput label={t('form.description.label')} placeholder={t('form.description.placeholder')} {...tagsExplorerContext.form.getInputProps('description')} readOnly={tagsExplorerContext.page.is_read_only} />
				</SimpleGrid>
			</Section>
			<Divider />
			<Section>
				<SimpleGrid cols={2}>
					<ColorInput label={t('form.color.label')} placeholder={t('form.color.placeholder')} {...tagsExplorerContext.form.getInputProps('color')} readOnly={tagsExplorerContext.page.is_read_only} />
					<ColorInput label={t('form.text_color.label')} placeholder={t('form.text_color.placeholder')} {...tagsExplorerContext.form.getInputProps('text_color')} readOnly={tagsExplorerContext.page.is_read_only} />
				</SimpleGrid>
			</Section>
		</Pannel>
	);
}