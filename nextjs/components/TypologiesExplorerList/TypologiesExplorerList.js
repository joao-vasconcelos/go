'use client';

/* * */

import useSWR from 'swr';
import Pannel from '@/components/Pannel/Pannel';
import NoDataLabel from '@/components/NoDataLabel/NoDataLabel';
import TypologiesExplorerListItem from '@/components/TypologiesExplorerListItem/TypologiesExplorerListItem';
import TypologiesExplorerListHeader from '@/components/TypologiesExplorerListHeader/TypologiesExplorerListHeader';
import TypologiesExplorerListFooter from '@/components/TypologiesExplorerListFooter/TypologiesExplorerListFooter';
import { useTypologiesExplorerContext } from '@/contexts/TypologiesExplorerContext';

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
		<Pannel loading={allTypologiesLoading} validating={allTypologiesValidating} error={allTypologiesError} header={<TypologiesExplorerListHeader />} footer={<TypologiesExplorerListFooter />}>
			{typologiesExplorerContext.list.items.length > 0 ? typologiesExplorerContext.list.items.map((item) => <TypologiesExplorerListItem key={item._id} item={item} />) : <NoDataLabel />}
		</Pannel>
	);

	//
}