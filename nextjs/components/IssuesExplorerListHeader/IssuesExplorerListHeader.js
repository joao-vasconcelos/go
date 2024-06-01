'use client';

/* * */

import AppAuthenticationCheck from '@/components/AppAuthenticationCheck/AppAuthenticationCheck';
import GlobalFilterBy from '@/components/GlobalFilterBy/GlobalFilterBy';
import IssuesExplorerAttributePriority from '@/components/IssuesExplorerAttributePriority/IssuesExplorerAttributePriority';
import IssuesExplorerAttributeStatus from '@/components/IssuesExplorerAttributeStatus/IssuesExplorerAttributeStatus';
import { LinesExplorerLine } from '@/components/LinesExplorerLine/LinesExplorerLine';
import SearchField from '@/components/SearchField/SearchField';
import { StopsExplorerStop } from '@/components/StopsExplorerStop/StopsExplorerStop';
import TagsExplorerTag from '@/components/TagsExplorerTag/TagsExplorerTag';
import UsersExplorerUser from '@/components/UsersExplorerUser/UsersExplorerUser';
import { useIssuesExplorerContext } from '@/contexts/IssuesExplorerContext';
import API from '@/services/API';
import notify from '@/services/notify';
import { useRouter } from '@/translations/navigation';
import { Button } from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import useSWR from 'swr';

import styles from './IssuesExplorerListHeader.module.css';

/* * */

export default function IssuesExplorerListHeader() {
	//

	//
	// A. Setup variables

	const router = useRouter();
	const t = useTranslations('IssuesExplorerListHeader');
	const [isCreating, setIsCreating] = useState(false);
	const issuesExplorerContext = useIssuesExplorerContext();

	//
	// B. Fetch data

	const { mutate: allIssuesMutate } = useSWR('/api/issues');

	//
	// C. Handle actions

	const handleCreate = async () => {
		try {
			setIsCreating(true);
			notify('new', 'loading', t('operations.create.loading'));
			const response = await API({ method: 'GET', operation: 'create', service: 'issues' });
			allIssuesMutate();
			router.push(`/issues/${response._id}`);
			notify('new', 'success', t('operations.create.success'));
			setIsCreating(false);
		}
		catch (error) {
			notify('new', 'error', error.message || t('operations.create.error'));
			setIsCreating(false);
			console.log(error);
		}
	};

	//
	// D. Render components

	return (
		<div className={styles.container}>
			<div className={styles.row}>
				<SearchField onChange={issuesExplorerContext.updateSearchQuery} query={issuesExplorerContext.list.search_query} />
				<div>
					<AppAuthenticationCheck permissions={[{ action: 'create', scope: 'issues' }]}>
						<Button leftSection={<IconPlus size={16} />} onClick={handleCreate} size="sm" variant="light">
							{t('operations.create.title')}
						</Button>
					</AppAuthenticationCheck>
				</div>
			</div>
			<div className={styles.row}>
				<p className={styles.label}>{t('filter_by.label')}</p>
				<GlobalFilterBy label={t('filters.status')} onChange={issuesExplorerContext.updateFilterStatus} optionComponent={<IssuesExplorerAttributeStatus />} options={issuesExplorerContext.list.available_status} value={issuesExplorerContext.list.filter_status} />
				<GlobalFilterBy label={t('filters.priority')} onChange={issuesExplorerContext.updateFilterPriority} optionComponent={<IssuesExplorerAttributePriority />} options={issuesExplorerContext.list.available_priority} value={issuesExplorerContext.list.filter_priority} />
				<GlobalFilterBy label={t('filters.tags')} onChange={issuesExplorerContext.updateFilterTags} optionComponent={<TagsExplorerTag withHoverCard={false} />} options={issuesExplorerContext.list.available_tags} value={issuesExplorerContext.list.filter_tags} valueKey="tagId" />
				<GlobalFilterBy label={t('filters.lines')} onChange={issuesExplorerContext.updateFilterLines} optionComponent={<LinesExplorerLine withHoverCard={false} />} options={issuesExplorerContext.list.available_lines} value={issuesExplorerContext.list.filter_lines} valueKey="lineId" />
				<GlobalFilterBy label={t('filters.stops')} onChange={issuesExplorerContext.updateFilterStops} optionComponent={<StopsExplorerStop />} options={issuesExplorerContext.list.available_stops} value={issuesExplorerContext.list.filter_stops} valueKey="stopId" />
				<GlobalFilterBy
					label={t('filters.created_by')}
					onChange={issuesExplorerContext.updateFilterCreatedBy}
					optionComponent={<UsersExplorerUser type="full" withHoverCard={false} />}
					options={issuesExplorerContext.list.available_created_by}
					value={issuesExplorerContext.list.filter_created_by}
					valueKey="userId"
				/>
				<GlobalFilterBy
					label={t('filters.assigned_to')}
					onChange={issuesExplorerContext.updateFilterAssignedTo}
					optionComponent={<UsersExplorerUser type="full" withHoverCard={false} />}
					options={issuesExplorerContext.list.available_assigned_to}
					value={issuesExplorerContext.list.filter_assigned_to}
					valueKey="userId"
				/>
			</div>
		</div>
	);

	//
}
