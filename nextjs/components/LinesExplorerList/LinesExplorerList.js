'use client';

/* * */

import LinesExplorerListFooter from '@/components/LinesExplorerListFooter/LinesExplorerListFooter';
import LinesExplorerListHeader from '@/components/LinesExplorerListHeader/LinesExplorerListHeader';
import LinesExplorerListItem from '@/components/LinesExplorerListItem/LinesExplorerListItem';
import NoDataLabel from '@/components/NoDataLabel/NoDataLabel';
import Pannel from '@/components/Pannel/Pannel';
import { useLinesExplorerContext } from '@/contexts/LinesExplorerContext';
import useSWR from 'swr';

/* * */

export default function LinesExplorerList() {
	//

	//
	// A. Setup variables

	const linesExplorerContext = useLinesExplorerContext();

	//
	// B. Fetch data

	const { error: allLinesError, isLoading: allLinesLoading, isValidating: allLinesValidating } = useSWR('/api/lines');

	//
	// C. Render data

	return (
		<Pannel error={allLinesError} footer={<LinesExplorerListFooter />} header={<LinesExplorerListHeader />} loading={allLinesLoading} validating={allLinesValidating}>
			{linesExplorerContext.list.items.length > 0 ? linesExplorerContext.list.items.map(item => <LinesExplorerListItem key={item._id} item={item} />) : <NoDataLabel />}
		</Pannel>
	);

	//
}
