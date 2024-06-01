'use client';

/* * */

import IssuesExplorerAttributeComment from '@/components/IssuesExplorerAttributeComment/IssuesExplorerAttributeComment';
import IssuesExplorerIdPageItemCommentsAddComment from '@/components/IssuesExplorerIdPageItemCommentsAddComment/IssuesExplorerIdPageItemCommentsAddComment';
import NoDataLabel from '@/components/NoDataLabel/NoDataLabel';
import Text from '@/components/Text/Text';
import { useIssuesExplorerContext } from '@/contexts/IssuesExplorerContext';
import { openConfirmModal } from '@mantine/modals';
import { useTranslations } from 'next-intl';

import styles from './IssuesExplorerIdPageItemComments.module.css';

/* * */

export default function IssuesExplorerIdPageItemComments() {
	//

	//
	// A. Setup variables

	const t = useTranslations('IssuesExplorerIdPageItemComments');
	const issuesExplorerContext = useIssuesExplorerContext();

	//
	// B. Handle actions

	const handleDeleteComment = (commentIndex) => {
		openConfirmModal({
			centered: true,
			children: <Text size="h3">{t('operations.delete.description')}</Text>,
			closeOnClickOutside: true,
			confirmProps: { color: 'red' },
			labels: { cancel: t('operations.delete.cancel'), confirm: t('operations.delete.confirm') },
			onConfirm: async () => {
				issuesExplorerContext.form.removeListItem('comments', commentIndex);
			},
			title: <Text size="h2">{t('operations.delete.title')}</Text>,
		});
	};

	//
	// C. Render components

	return (
		<div className={styles.container}>
			{issuesExplorerContext.form.values.comments.length > 0
				? (
					<div className={styles.commentsWrapper}>
						{issuesExplorerContext.form.values.comments.map((itemData, index) => <IssuesExplorerAttributeComment key={index} commentData={itemData} onDelete={() => handleDeleteComment(index)} readOnly={issuesExplorerContext.page.is_read_only} />)}
					</div>
				)
				: <NoDataLabel />}
			{!issuesExplorerContext.page.is_read_only && <IssuesExplorerIdPageItemCommentsAddComment />}
		</div>
	);
}
