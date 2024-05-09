'use client';

/* * */

import { useTranslations } from 'next-intl';
import { IconPencil, IconBroadcast, IconBolt, IconHandStop, IconDiscountCheck, IconTag } from '@tabler/icons-react';
import styles from './IssuesExplorerAttributeMilestone.module.css';
import { Text, Timeline } from '@mantine/core';
import UsersExplorerUser from '../UsersExplorerUser/UsersExplorerUser';
import TagsExplorerTag from '../TagsExplorerTag/TagsExplorerTag';

/* * */

export default function IssuesExplorerAttributeMilestone({ milestoneData }) {
	//

	//
	// A. Setup variables

	const t = useTranslations('IssuesExplorerAttributeMilestone');

	//
	// B. Render components

	switch (milestoneData.type) {
	case 'tag_added':
		return (
			<Timeline.Item bullet={<IconTag size={16} />}>
				<div className={styles.container}>
					<p className={styles.title}>{t(`${milestoneData.type}.title`)}</p>
					<div className={styles.details}>
						<UsersExplorerUser userId={milestoneData.created_by} />
						<p className={styles.action}>{t(`${milestoneData.type}.action`)}</p>
						<TagsExplorerTag tagId={milestoneData.value} />
					</div>
					<p className={styles.createdAt}>2 hours ago</p>
				</div>
			</Timeline.Item>
		);
	case 'tag_removed':
		return (
			<Timeline.Item bullet={<IconTag size={16} />}>
				<div className={styles.container}>
					<p className={styles.title}>{t(`${milestoneData.type}.title`)}</p>
					<div className={styles.details}>
						<UsersExplorerUser userId={milestoneData.created_by} />
						<p className={styles.action}>{t(`${milestoneData.type}.action`)}</p>
						<TagsExplorerTag tagId={milestoneData.value} />
					</div>
					<p className={styles.createdAt}>2 hours ago</p>
				</div>
			</Timeline.Item>
		);
	case 'open':
		return (
			<div className={`${styles.container} ${styles.open}`}>
				<IconBroadcast size={14} />
				<p className={styles.label}>{t(`${type}.label`)}</p>
			</div>
		);
	case 'in_progress':
		return (
			<div className={`${styles.container} ${styles.inProgress}`}>
				<IconBolt size={14} />
				<p className={styles.label}>{t(`${type}.label`)}</p>
			</div>
		);
	case 'blocked':
		return (
			<div className={`${styles.container} ${styles.blocked}`}>
				<IconHandStop size={14} />
				<p className={styles.label}>{t(`${type}.label`)}</p>
			</div>
		);
	case 'closed':
		return (
			<div className={`${styles.container} ${styles.closed}`}>
				<IconDiscountCheck size={14} />
				<p className={styles.label}>{t(`${type}.label`)}</p>
			</div>
		);
	}

	//
}