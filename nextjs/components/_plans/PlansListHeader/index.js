'use client';

/* * */

import AppAuthenticationCheck from '@/components/AppAuthenticationCheck/AppAuthenticationCheck';
import ListHeader from '@/components/ListHeader/ListHeader';
import SearchField from '@/components/SearchField/SearchField';
import { usePlansContext } from '@/contexts/PlansContext';
import API from '@/services/API';
import notify from '@/services/notify';
import { Button } from '@mantine/core';
import { IconPlus, IconPoint } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import useSWR from 'swr';

/* * */

export function PlansListHeader() {
	//

	//
	// A. Setup variables

	const t = useTranslations('PlansListHeader');
	const [isLoading, setIsLoading] = useState(false);
	const plansContext = usePlansContext();

	//
	// B. Fetch data

	const { isLoading: allPlansLoading, mutate: allPlansMutate } = useSWR('/api/plans');

	//
	// C. Handle actions

	const handleCreate = async () => {
		try {
			setIsLoading(true);
			notify('new', 'loading', t('operations.create.loading'));
			await API({ method: 'GET', operation: 'create', service: 'plans' });
			allPlansMutate();
			notify('new', 'success', t('operations.create.success'));
			setIsLoading(false);
		}
		catch (error) {
			notify('new', 'error', error.message || t('operations.create.error'));
			setIsLoading(false);
			console.log(error);
		}
	};

	const handleMarkAllAsWaiting = async () => {
		try {
			setIsLoading(true);
			notify('new', 'loading', t('operations.mark-all-as-waiting.loading'));
			await API({ method: 'GET', operation: 'mark-all-as-waiting', service: 'plans' });
			allPlansMutate();
			notify('new', 'success', t('operations.mark-all-as-waiting.success'));
			setIsLoading(false);
		}
		catch (error) {
			notify('new', 'error', error.message || t('operations.mark-all-as-waiting.error'));
			setIsLoading(false);
			console.log(error);
		}
	};

	//
	// D. Render components

	return (
		<ListHeader>
			<AppAuthenticationCheck permissions={[{ action: 'create', scope: 'plans' }]}>
				<div>
					<Button color="gray" leftSection={<IconPlus size={20} />} loading={allPlansLoading || isLoading} onClick={handleCreate} variant="light">
						{t('operations.create.title')}
					</Button>
				</div>
			</AppAuthenticationCheck>
			<SearchField onChange={plansContext.updateSearchQuery} query={plansContext.list.search_query} />
			<AppAuthenticationCheck permissions={[{ action: 'admin', scope: 'configs' }]}>
				<div>
					<Button color="red" leftSection={<IconPoint size={20} />} loading={allPlansLoading || isLoading} onClick={handleMarkAllAsWaiting} variant="light">
						{t('operations.mark-all-as-waiting.title')}
					</Button>
				</div>
			</AppAuthenticationCheck>
		</ListHeader>
	);

	//
}
