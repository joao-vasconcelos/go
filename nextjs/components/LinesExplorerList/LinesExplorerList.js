'use client';

/* * */

import useSWR from 'swr';
import Pannel from '@/components/Pannel/Pannel';
import NoDataLabel from '@/components/NoDataLabel/NoDataLabel';
import LinesExplorerListItem from '@/components/LinesExplorerListItem/LinesExplorerListItem';
import LinesExplorerListHeader from '@/components/LinesExplorerListHeader/LinesExplorerListHeader';
import LinesExplorerListFooter from '@/components/LinesExplorerListFooter/LinesExplorerListFooter';
import { useLinesExplorerContext } from '@/contexts/LinesExplorerContext';

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
    <Pannel loading={allLinesLoading} validating={allLinesValidating} error={allLinesError} header={<LinesExplorerListHeader />} footer={<LinesExplorerListFooter />}>
      {linesExplorerContext.list.items.length > 0 ? linesExplorerContext.list.items.map((item) => <LinesExplorerListItem key={item._id} item={item} />) : <NoDataLabel />}
    </Pannel>
  );

  //
}
