'use client';

/* * */

import { useTranslations } from 'next-intl';
import { useIssuesExplorerContext } from '@/contexts/IssuesExplorerContext';
import NoDataLabel from '@/components/NoDataLabel/NoDataLabel';
import IssuesExplorerAttributeComment from '@/components/IssuesExplorerAttributeComment/IssuesExplorerAttributeComment';
import IssuesExplorerIdPageItemCommentsAddComment from '@/components/IssuesExplorerIdPageItemCommentsAddComment/IssuesExplorerIdPageItemCommentsAddComment';
import styles from './IssuesExplorerIdPageItemComments.module.css';
import Text from '@/components/Text/Text';
import { openConfirmModal } from '@mantine/modals';

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
			title: <Text size="h2">{t('operations.delete.title')}</Text>,
			centered: true,
			closeOnClickOutside: true,
			children: <Text size="h3">{t('operations.delete.description')}</Text>,
			labels: { confirm: t('operations.delete.confirm'), cancel: t('operations.delete.cancel') },
			confirmProps: { color: 'red' },
			onConfirm: async () => {
				issuesExplorerContext.form.removeListItem('comments', commentIndex);
			},
		});
	};

	//
	// C. Render components

	return (
		<div className={styles.container}>
			{issuesExplorerContext.form.values.comments.length > 0 ?
				<div className={styles.commentsWrapper}>
					{issuesExplorerContext.form.values.comments.map((itemData, index) => <IssuesExplorerAttributeComment key={index} commentData={itemData} onDelete={() => handleDeleteComment(index)} readOnly={issuesExplorerContext.page.is_read_only} />)}
				</div> :
				<NoDataLabel />
			}
			{!issuesExplorerContext.page.is_read_only && <IssuesExplorerIdPageItemCommentsAddComment />}
		</div>
	);
}