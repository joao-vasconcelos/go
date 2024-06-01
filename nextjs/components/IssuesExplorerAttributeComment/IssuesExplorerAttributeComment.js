'use client';

/* * */

import { ActionIcon, Divider, Timeline } from '@mantine/core';
import { IconBolt, IconBroadcast, IconDiscountCheck, IconHandStop, IconPencil, IconTag, IconTrash } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';

import GlobalAuthorTimestamp from '../GlobalAuthorTimestamp/GlobalAuthorTimestamp';
import TagsExplorerTag from '../TagsExplorerTag/TagsExplorerTag';
import UsersExplorerUser from '../UsersExplorerUser/UsersExplorerUser';
import styles from './IssuesExplorerAttributeComment.module.css';

/* * */

export default function IssuesExplorerAttributeComment({ commentData, onDelete, readOnly = false }) {
	//

	//
	// A. Setup variables

	const t = useTranslations('IssuesExplorerAttributeComment');

	//
	// B. Render components

	return (
		<div className={styles.container}>
			<div className={styles.commentHeader}>
				<div className={styles.leftSide}>
					<GlobalAuthorTimestamp actionVerb={t('action_verb')} timestamp={commentData.created_at} userId={commentData.created_by} />
				</div>
				<div className={styles.rightSide}>
					{!readOnly
					&& (
						<ActionIcon color="gray" onClick={onDelete} size="sm" variant="subtle">
							<IconTrash size={15} />
						</ActionIcon>
					)}
				</div>
			</div>
			<div className={styles.commentText}>{commentData.text}</div>
		</div>
	);

	//
}
