'use client';

/* * */

import { useIssuesExplorerContext } from '@/contexts/IssuesExplorerContext';
import { Button, Modal, SimpleGrid, TextInput, Textarea } from '@mantine/core';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

import styles from './IssuesExplorerIdPageItemTitle.module.css';

/* * */

export default function IssuesExplorerIdPageItemTitle() {
	//

	//
	// A. Setup variables

	const t = useTranslations('IssuesExplorerIdPageItemTitle');
	const issuesExplorerContext = useIssuesExplorerContext();
	const [isEditMode, setIsEditMode] = useState(false);

	//
	// B. Handle actions

	const handleEnterEditMode = () => {
		setIsEditMode(true);
	};

	const handleExitEditMode = () => {
		if (!issuesExplorerContext.form.values.title) return;
		setIsEditMode(false);
	};

	//
	// C. Render components

	return (
		<>
			<Modal onClose={handleExitEditMode} opened={isEditMode} size={600} title={t('modal.title')}>
				<SimpleGrid cols={1}>
					<TextInput label={t('modal.fields.title.label')} placeholder={t('modal.fields.title.placeholder')} {...issuesExplorerContext.form.getInputProps('title')} readOnly={issuesExplorerContext.page.is_read_only} />
					<Textarea label={t('modal.fields.summary.label')} placeholder={t('modal.fields.summary.placeholder')} {...issuesExplorerContext.form.getInputProps('summary')} minRows={5} readOnly={issuesExplorerContext.page.is_read_only} autosize />
				</SimpleGrid>
			</Modal>
			<div className={styles.container}>
				<div className={styles.bylineWrapper}>
					<p className={styles.code}>#{issuesExplorerContext.form.values.code}</p>
					{!issuesExplorerContext.page.is_read_only
					&& (
						<Button color="gray" onClick={handleEnterEditMode} size="compact-xs" variant="subtle">
							{t('edit.label')}
						</Button>
					)}
				</div>
				<h2 className={styles.title}>{issuesExplorerContext.form.values.title || 'untitled'}</h2>
				<p className={styles.summary}>{issuesExplorerContext.form.values.summary || 'untitled'}</p>
			</div>
		</>
	);

	//
}
