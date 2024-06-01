'use client';

/* * */

import NoDataLabel from '@/components/NoDataLabel/NoDataLabel';
import Pannel from '@/components/Pannel/Pannel';
import TypologiesExplorerListFooter from '@/components/TypologiesExplorerListFooter/TypologiesExplorerListFooter';
import TypologiesExplorerListHeader from '@/components/TypologiesExplorerListHeader/TypologiesExplorerListHeader';
import TypologiesExplorerListItem from '@/components/TypologiesExplorerListItem/TypologiesExplorerListItem';
import { useTypologiesExplorerContext } from '@/contexts/TypologiesExplorerContext';
import useSWR from 'swr';

/* * */

export default function TypologiesExplorerList() {
	//

	//
	// A. Setup variables

	const typologiesExplorerContext = useTypologiesExplorerContext();

	//
	// B. Fetch data

	const { error: allTypologiesError, isLoading: allTypologiesLoading, isValidating: allTypologiesValidating } = useSWR('/api/typologies');

	//
	// C. Render data

	return (
		<Pannel error={allTypologiesError} footer={<TypologiesExplorerListFooter />} header={<TypologiesExplorerListHeader />} loading={allTypologiesLoading} validating={allTypologiesValidating}>
			{typologiesExplorerContext.list.items.length > 0 ? typologiesExplorerContext.list.items.map(item => <TypologiesExplorerListItem key={item._id} item={item} />) : <NoDataLabel />}
		</Pannel>
	);

	//
}
