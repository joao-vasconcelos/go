'use client';

/* * */

import { PlansListItemEdit } from '@/components/_plans/PlansListItemEdit';
import { PlansListItemFiles } from '@/components/_plans/PlansListItemFiles';
import { PlansListItemHeader } from '@/components/_plans/PlansListItemHeader';
import Standout from '@/components/Standout/Standout';
import { PlansItemContextProvider } from '@/contexts/PlansItemContext';

/* * */

export function PlansListItem({ item }) {
	return (
		<PlansItemContextProvider itemData={item} itemId={item._id}>
			<Standout defaultOpen={false} icon={<PlansListItemHeader />} collapsible>
				<PlansListItemEdit />
				<PlansListItemFiles />
			</Standout>
		</PlansItemContextProvider>
	);
}
