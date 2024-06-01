'use client';

/* * */

import IssuesExplorerAttributeMilestone from '@/components/IssuesExplorerAttributeMilestone/IssuesExplorerAttributeMilestone';
import NoDataLabel from '@/components/NoDataLabel/NoDataLabel';
import { useIssuesExplorerContext } from '@/contexts/IssuesExplorerContext';
import { Timeline } from '@mantine/core';
import { useTranslations } from 'next-intl';

/* * */

export default function IssuesExplorerIdPageItemMilestones() {
	//

	//
	// A. Setup variables

	const t = useTranslations('IssuesExplorerIdPageItemMilestones');
	const issuesExplorerContext = useIssuesExplorerContext();

	//
	// B. Render components

	return issuesExplorerContext.form.values.milestones.length > 0
		? (
			<Timeline align="right" bulletSize={30} lineWidth={3}>
				{issuesExplorerContext.form.values.milestones.map((itemData, index) => <IssuesExplorerAttributeMilestone key={index} milestoneData={itemData} />)}
			</Timeline>
		)
		: <NoDataLabel fill />;
}
