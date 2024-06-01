'use client';

/* * */

import IssuesExplorerIdPageHeader from '@/components/IssuesExplorerIdPageHeader/IssuesExplorerIdPageHeader';
import IssuesExplorerIdPageItemComments from '@/components/IssuesExplorerIdPageItemComments/IssuesExplorerIdPageItemComments';
import IssuesExplorerIdPageItemIssues from '@/components/IssuesExplorerIdPageItemIssues/IssuesExplorerIdPageItemIssues';
import IssuesExplorerIdPageItemLines from '@/components/IssuesExplorerIdPageItemLines/IssuesExplorerIdPageItemLines';
import IssuesExplorerIdPageItemMedia from '@/components/IssuesExplorerIdPageItemMedia/IssuesExplorerIdPageItemMedia';
import IssuesExplorerIdPageItemMilestones from '@/components/IssuesExplorerIdPageItemMilestones/IssuesExplorerIdPageItemMilestones';
import IssuesExplorerIdPageItemStops from '@/components/IssuesExplorerIdPageItemStops/IssuesExplorerIdPageItemStops';
import IssuesExplorerIdPageItemTags from '@/components/IssuesExplorerIdPageItemTags/IssuesExplorerIdPageItemTags';
import IssuesExplorerIdPageItemTitle from '@/components/IssuesExplorerIdPageItemTitle/IssuesExplorerIdPageItemTitle';
import { Section } from '@/components/Layouts/Layouts';
import Pannel from '@/components/Pannel/Pannel';
import { useIssuesExplorerContext } from '@/contexts/IssuesExplorerContext';
import { Divider } from '@mantine/core';
import { useTranslations } from 'next-intl';

import styles from './IssuesExplorerIdPage.module.css';

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
		<Pannel header={<IssuesExplorerIdPageHeader />} loading={issuesExplorerContext.page.is_loading}>
			<Section>
				<IssuesExplorerIdPageItemTitle />
				<IssuesExplorerIdPageItemTags />
			</Section>
			<Divider />
			<Section>
				<IssuesExplorerIdPageItemMedia />
			</Section>
			<Divider />
			<Section>
				<IssuesExplorerIdPageItemLines />
			</Section>
			<Divider />
			<Section>
				<IssuesExplorerIdPageItemStops />
			</Section>
			<Divider />
			<Section>
				<IssuesExplorerIdPageItemIssues />
			</Section>
			<Divider />
			<Section>
				<div className={styles.unevenColumns}>
					<IssuesExplorerIdPageItemComments />
					<IssuesExplorerIdPageItemMilestones />
				</div>
			</Section>
		</Pannel>
	);
}
