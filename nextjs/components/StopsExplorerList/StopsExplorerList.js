'use client';

/* * */

import useSWR from 'swr';
import Pannel from '@/components/Pannel/Pannel';
import NoDataLabel from '@/components/NoDataLabel/NoDataLabel';
import StopsExplorerListItem from '@/components/StopsExplorerListItem/StopsExplorerListItem';
import StopsExplorerListHeader from '@/components/StopsExplorerListHeader/StopsExplorerListHeader';
import StopsExplorerListFooter from '@/components/StopsExplorerListFooter/StopsExplorerListFooter';
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
  // B. Fetch data

  const { error: allStopsError, isLoading: allStopsLoading, isValidating: allStopsValidating } = useSWR('/api/stops');

  //
  // C. Render data

  return (
    <Pannel loading={allStopsLoading} validating={allStopsValidating} error={allStopsError} header={<StopsExplorerListHeader />} footer={<StopsExplorerListFooter />}>
      {stopsExplorerContext.list.items.length > 0 ? (
        <AutoSizer>
          {({ height, width }) => (
            <FixedSizeList className="List" height={height} itemCount={stopsExplorerContext.list.items.length} itemSize={100} width={width}>
              {({ index, style }) => <StopsExplorerListItem key={stopsExplorerContext.list.items[index]._id} item={stopsExplorerContext.list.items[index]} style={style} />}
            </FixedSizeList>
          )}
        </AutoSizer>
      ) : (
        <NoDataLabel />
      )}
    </Pannel>
  );

  //
}
