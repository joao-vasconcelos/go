'use client';

/* * */

import Pannel from '@/components/Pannel/Pannel';
import { Section } from '@/components/Layouts/Layouts';
import { useTranslations } from 'next-intl';
import { Divider } from '@mantine/core';
import { useIssuesExplorerContext } from '@/contexts/IssuesExplorerContext';
import styles from './IssuesExplorerIdPage.module.css';
import IssuesExplorerIdPageHeader from '@/components/IssuesExplorerIdPageHeader/IssuesExplorerIdPageHeader';
import IssuesExplorerIdPageItemTitle from '@/components/IssuesExplorerIdPageItemTitle/IssuesExplorerIdPageItemTitle';
import IssuesExplorerIdPageItemTags from '@/components/IssuesExplorerIdPageItemTags/IssuesExplorerIdPageItemTags';
import IssuesExplorerIdPageItemMilestones from '@/components/IssuesExplorerIdPageItemMilestones/IssuesExplorerIdPageItemMilestones';
import IssuesExplorerIdPageItemComments from '@/components/IssuesExplorerIdPageItemComments/IssuesExplorerIdPageItemComments';
import IssuesExplorerIdPageItemMedia from '@/components/IssuesExplorerIdPageItemMedia/IssuesExplorerIdPageItemMedia';
import IssuesExplorerIdPageItemLines from '@/components/IssuesExplorerIdPageItemLines/IssuesExplorerIdPageItemLines';
import IssuesExplorerIdPageItemStops from '@/components/IssuesExplorerIdPageItemStops/IssuesExplorerIdPageItemStops';
import IssuesExplorerIdPageItemIssues from '@/components/IssuesExplorerIdPageItemIssues/IssuesExplorerIdPageItemIssues';

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