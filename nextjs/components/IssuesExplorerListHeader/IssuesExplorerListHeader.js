'use client';

/* * */

import { useState } from 'react';
import { useRouter } from '@/translations/navigation';
import useSWR from 'swr';
import API from '@/services/API';
import { Button } from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';
import notify from '@/services/notify';
import { useTranslations } from 'next-intl';
import AppAuthenticationCheck from '@/components/AppAuthenticationCheck/AppAuthenticationCheck';
import SearchField from '@/components/SearchField/SearchField';
import { useIssuesExplorerContext } from '@/contexts/IssuesExplorerContext';
import styles from './IssuesExplorerListHeader.module.css';
import GlobalFilterBy from '@/components/GlobalFilterBy/GlobalFilterBy';
import IssuesExplorerAttributeStatus from '@/components/IssuesExplorerAttributeStatus/IssuesExplorerAttributeStatus';
import IssuesExplorerAttributePriority from '@/components/IssuesExplorerAttributePriority/IssuesExplorerAttributePriority';
import UsersExplorerUser from '@/components/UsersExplorerUser/UsersExplorerUser';
import TagsExplorerTag from '@/components/TagsExplorerTag/TagsExplorerTag';
import { LinesExplorerLine } from '@/components/LinesExplorerLine/LinesExplorerLine';
import { StopsExplorerStop } from '@/components/StopsExplorerStop/StopsExplorerStop';

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
      const response = await API({ service: 'issues', operation: 'create', method: 'GET' });
      allIssuesMutate();
      router.push(`/issues/${response._id}`);
      notify('new', 'success', t('operations.create.success'));
      setIsCreating(false);
    } catch (error) {
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
        <SearchField query={issuesExplorerContext.list.search_query} onChange={issuesExplorerContext.updateSearchQuery} />
        <div>
          <AppAuthenticationCheck permissions={[{ scope: 'issues', action: 'create' }]}>
            <Button leftSection={<IconPlus size={16} />} onClick={handleCreate} size="sm" variant="light">
              {t('operations.create.title')}
            </Button>
          </AppAuthenticationCheck>
        </div>
      </div>
      <div className={styles.row}>
        <p className={styles.label}>{t('filter_by.label')}</p>
        <GlobalFilterBy label={t('filters.status')} options={issuesExplorerContext.list.available_status} value={issuesExplorerContext.list.filter_status} onChange={issuesExplorerContext.updateFilterStatus} optionComponent={<IssuesExplorerAttributeStatus />} />
        <GlobalFilterBy label={t('filters.priority')} options={issuesExplorerContext.list.available_priority} value={issuesExplorerContext.list.filter_priority} onChange={issuesExplorerContext.updateFilterPriority} optionComponent={<IssuesExplorerAttributePriority />} />
        <GlobalFilterBy label={t('filters.tags')} options={issuesExplorerContext.list.available_tags} value={issuesExplorerContext.list.filter_tags} onChange={issuesExplorerContext.updateFilterTags} optionComponent={<TagsExplorerTag withHoverCard={false} />} valueKey="tagId" />
        <GlobalFilterBy label={t('filters.lines')} options={issuesExplorerContext.list.available_lines} value={issuesExplorerContext.list.filter_lines} onChange={issuesExplorerContext.updateFilterLines} optionComponent={<LinesExplorerLine withHoverCard={false} />} valueKey="lineId" />
        <GlobalFilterBy label={t('filters.stops')} options={issuesExplorerContext.list.available_stops} value={issuesExplorerContext.list.filter_stops} onChange={issuesExplorerContext.updateFilterStops} optionComponent={<StopsExplorerStop />} valueKey="stopId" />
        <GlobalFilterBy
          label={t('filters.created_by')}
          options={issuesExplorerContext.list.available_created_by}
          value={issuesExplorerContext.list.filter_created_by}
          onChange={issuesExplorerContext.updateFilterCreatedBy}
          optionComponent={<UsersExplorerUser type="full" withHoverCard={false} />}
          valueKey="userId"
        />
        <GlobalFilterBy
          label={t('filters.assigned_to')}
          options={issuesExplorerContext.list.available_assigned_to}
          value={issuesExplorerContext.list.filter_assigned_to}
          onChange={issuesExplorerContext.updateFilterAssignedTo}
          optionComponent={<UsersExplorerUser type="full" withHoverCard={false} />}
          valueKey="userId"
        />
      </div>
    </div>
  );

  //
}
