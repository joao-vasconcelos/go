'use client';

/* * */

import useSWR from 'swr';
import Pannel from '@/components/Pannel/Pannel';
import NoDataLabel from '@/components/NoDataLabel/NoDataLabel';
import FaresExplorerListItem from '@/components/FaresExplorerListItem/FaresExplorerListItem';
import FaresExplorerListHeader from '@/components/FaresExplorerListHeader/FaresExplorerListHeader';
import FaresExplorerListFooter from '@/components/FaresExplorerListFooter/FaresExplorerListFooter';
import { useFaresExplorerContext } from '@/contexts/FaresExplorerContext';

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
    <Pannel loading={allFaresLoading} validating={allFaresValidating} error={allFaresError} header={<FaresExplorerListHeader />} footer={<FaresExplorerListFooter />}>
      {faresExplorerContext.list.items.length > 0 ? faresExplorerContext.list.items.map((item) => <FaresExplorerListItem key={item._id} item={item} />) : <NoDataLabel />}
    </Pannel>
  );

  //
}
