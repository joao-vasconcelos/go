'use client';

/* * */

import { useTranslations } from 'next-intl';
import { Timeline } from '@mantine/core';
import { useIssuesExplorerContext } from '@/contexts/IssuesExplorerContext';
import NoDataLabel from '@/components/NoDataLabel/NoDataLabel';
import IssuesExplorerAttributeMilestone from '@/components/IssuesExplorerAttributeMilestone/IssuesExplorerAttributeMilestone';

/* * */

export default function IssuesExplorerIdPageItemMilestones() {
	//

	//
	// A. Setup variables

	const t = useTranslations('IssuesExplorerIdPageItemMilestones');
	const issuesExplorerContext = useIssuesExplorerContext();

	//
	// B. Render components

	return issuesExplorerContext.form.values.milestones.length > 0 ?
		<Timeline bulletSize={30} lineWidth={3} align="right">
			{issuesExplorerContext.form.values.milestones.map((itemData, index) => <IssuesExplorerAttributeMilestone key={index} milestoneData={itemData} />)}
		</Timeline> :
		<NoDataLabel fill />;
}