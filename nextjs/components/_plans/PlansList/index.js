'use client';

/* * */

import { PlansListFooter } from '@/components/_plans/PlansListFooter';
import { PlansListHeader } from '@/components/_plans/PlansListHeader';
import { PlansListItem } from '@/components/_plans/PlansListItem';
import NoDataLabel from '@/components/NoDataLabel/NoDataLabel';
import Pannel from '@/components/Pannel/Pannel';
import { usePlansContext } from '@/contexts/PlansContext';
import useSWR from 'swr';

import styles from './styles.module.css';

/* * */

export function PlansList() {
	//

	//
	// A. Setup variables

	const plansContext = usePlansContext();

	//
	// B. Fetch data

	const { error: allPlansError, isLoading: allPlansLoading, isValidating: allPlansValidating } = useSWR('/api/plans');

	//
	// C. Render data

	return (
		<Pannel error={allPlansError} footer={<PlansListFooter />} header={<PlansListHeader />} loading={allPlansLoading} validating={allPlansValidating}>
			<div className={styles.listWrapper}>{plansContext.list.items.length > 0 ? plansContext.list.items.map(item => <PlansListItem key={item._id} item={item} />) : <NoDataLabel />}</div>
		</Pannel>
	);

	//
}
