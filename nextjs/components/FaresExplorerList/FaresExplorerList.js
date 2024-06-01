'use client';

/* * */

import FaresExplorerListFooter from '@/components/FaresExplorerListFooter/FaresExplorerListFooter';
import FaresExplorerListHeader from '@/components/FaresExplorerListHeader/FaresExplorerListHeader';
import FaresExplorerListItem from '@/components/FaresExplorerListItem/FaresExplorerListItem';
import NoDataLabel from '@/components/NoDataLabel/NoDataLabel';
import Pannel from '@/components/Pannel/Pannel';
import { useFaresExplorerContext } from '@/contexts/FaresExplorerContext';
import useSWR from 'swr';

/* * */

export default function FaresExplorerList() {
	//

	//
	// A. Setup variables

	const faresExplorerContext = useFaresExplorerContext();

	//
	// B. Fetch data

	const { error: allFaresError, isLoading: allFaresLoading, isValidating: allFaresValidating } = useSWR('/api/fares');

	//
	// C. Render data

	return (
		<Pannel error={allFaresError} footer={<FaresExplorerListFooter />} header={<FaresExplorerListHeader />} loading={allFaresLoading} validating={allFaresValidating}>
			{faresExplorerContext.list.items.length > 0 ? faresExplorerContext.list.items.map(item => <FaresExplorerListItem key={item._id} item={item} />) : <NoDataLabel />}
		</Pannel>
	);

	//
}
