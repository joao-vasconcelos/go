'use client';

/* * */

import { useIssuesExplorerContext } from '@/contexts/IssuesExplorerContext';
import { Button, Textarea } from '@mantine/core';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import styles from './IssuesExplorerIdPageItemCommentsAddComment.module.css';

/* * */

export default function IssuesExplorerIdPageItemCommentsAddComment() {
	//

	//
	// A. Setup variables

	const t = useTranslations('IssuesExplorerIdPageItemCommentsAddComment');
	const issuesExplorerContext = useIssuesExplorerContext();

	const [commentText, setCommentText] = useState('');

	//
	// B. Render components

	const handleAddComment = () => {
		issuesExplorerContext.addComment(commentText);
	};

	//
	// B. Render components

	return (
		<div className={styles.container}>
			<Textarea label={t('form.text.label')} onChange={({ currentTarget }) => setCommentText(currentTarget.value)} placeholder={t('form.text.placeholder')} value={commentText} w="100%" />
			<Button onClick={handleAddComment}>{t('form.submit.label')}</Button>
		</div>
	);
}
