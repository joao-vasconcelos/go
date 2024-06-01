'use client';

/* * */

import { useIssuesExplorerContext } from '@/contexts/IssuesExplorerContext';
import { ActionIcon, Button, Select } from '@mantine/core';
import { IconTrash } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';
import useSWR from 'swr';

import { IssuesExplorerIssue } from '../IssuesExplorerIssue/IssuesExplorerIssue';
import styles from './IssuesExplorerIdPageItemIssues.module.css';

/* * */

export default function IssuesExplorerIdPageItemIssues() {
	//

	//
	// A. Setup variables

	const t = useTranslations('IssuesExplorerIdPageItemIssues');
	const issuesExplorerContext = useIssuesExplorerContext();

	const [selectedIssueId, setSelectedIssueId] = useState(null);

	//
	// B. Fetch data

	const { data: allIssuesData } = useSWR('/api/issues');

	//
	// C. Transform data

	const allIssuesDataFormatted = useMemo(() => {
		// Exit if no data is available
		if (!allIssuesData) return [];
		// For each issue check if it related with the current issue or not
		return allIssuesData.map(issue => ({ label: `[${issue.code}] ${issue.title}`, value: issue._id }));
		//
	}, [allIssuesData]);

	//
	// D. Handle actions

	const handleAddRelatedIssue = () => {
		issuesExplorerContext.toggleRelatedIssue(selectedIssueId);
		setSelectedIssueId(null);
	};

	const handleRemoveRelatedIssue = (issueId) => {
		issuesExplorerContext.toggleRelatedIssue(issueId);
	};

	//
	// E. Render components

	return (
		<div className={styles.container}>
			<div className={styles.list}>
				{issuesExplorerContext.form.values.related_issues.length > 0
				&& issuesExplorerContext.form.values.related_issues.map(issueId => (
					<div key={issueId} className={styles.itemWrapper}>
						<IssuesExplorerIssue issueId={issueId} />
						{!issuesExplorerContext.page.is_read_only
						&& (
							<ActionIcon color="red" onClick={() => handleRemoveRelatedIssue(issueId)} variant="light">
								<IconTrash size={20} />
							</ActionIcon>
						)}
					</div>
				))}
			</div>
			{!issuesExplorerContext.page.is_read_only
			&& (
				<>
					<Select
						data={allIssuesDataFormatted}
						label={t('related_issues.label')}
						limit={100}
						nothingFoundMessage={t('related_issues.nothingFound')}
						onChange={setSelectedIssueId}
						placeholder={t('related_issues.placeholder')}
						readOnly={issuesExplorerContext.page.is_read_only}
						value={selectedIssueId}
						w="100%"
						searchable
					/>
					<Button disabled={!selectedIssueId || issuesExplorerContext.page.is_read_only} onClick={handleAddRelatedIssue}>
						Add Related Issue
					</Button>
				</>
			)}
		</div>
	);
}
