'use client';

/* * */

import NoDataLabel from '@/components/NoDataLabel/NoDataLabel';
import Pannel from '@/components/Pannel/Pannel';
import StopsExplorerListFooter from '@/components/StopsExplorerListFooter/StopsExplorerListFooter';
import StopsExplorerListHeader from '@/components/StopsExplorerListHeader/StopsExplorerListHeader';
import StopsExplorerListItem from '@/components/StopsExplorerListItem/StopsExplorerListItem';
import { useStopsExplorerContext } from '@/contexts/StopsExplorerContext';
import AutoSizer from 'react-virtualized-auto-sizer';
import { FixedSizeList } from 'react-window';

/* * */

export default function StopsExplorerList() {
	//

	//
	// A. Setup variables

	const stopsExplorerContext = useStopsExplorerContext();

	//
	// B. Render data

	return (
		<Pannel error={stopsExplorerContext.list.is_error} footer={<StopsExplorerListFooter />} header={<StopsExplorerListHeader />} loading={stopsExplorerContext.list.is_loading}>
			{stopsExplorerContext.list.items.length > 0
				? (
					<AutoSizer>
						{({ height, width }) => (
							<FixedSizeList className="List" height={height} itemCount={stopsExplorerContext.list.items.length} itemSize={100} width={width}>
								{({ index, style }) => <StopsExplorerListItem key={stopsExplorerContext.list.items[index]._id} item={stopsExplorerContext.list.items[index]} style={style} />}
							</FixedSizeList>
						)}
					</AutoSizer>
				)
				: <NoDataLabel />}
		</Pannel>
	);

	//
}
