'use client';

/* * */

import useSWR from 'swr';
import Pannel from '@/components/Pannel/Pannel';
import NoDataLabel from '@/components/NoDataLabel/NoDataLabel';
import ArchivesExplorerListItem from '@/components/ArchivesExplorerListItem/ArchivesExplorerListItem';
import ArchivesExplorerListHeader from '@/components/ArchivesExplorerListHeader/ArchivesExplorerListHeader';
import ArchivesExplorerListFooter from '@/components/ArchivesExplorerListFooter/ArchivesExplorerListFooter';
import { useArchivesExplorerContext } from '@/contexts/ArchivesExplorerContext';
import styles from './ArchivesExplorerList.module.css';

/* * */

export default function ArchivesExplorerList() {
  //

  //
  // A. Setup variables

  const archivesExplorerContext = useArchivesExplorerContext();

  //
  // B. Fetch data

  const { error: allArchivesError, isLoading: allArchivesLoading, isValidating: allArchivesValidating } = useSWR('/api/archives');

  //
  // C. Render data

  return (
    <Pannel loading={allArchivesLoading} validating={allArchivesValidating} error={allArchivesError} header={<ArchivesExplorerListHeader />} footer={<ArchivesExplorerListFooter />}>
      <div className={styles.listWrapper}>{archivesExplorerContext.list.items.length > 0 ? archivesExplorerContext.list.items.map((item) => <ArchivesExplorerListItem key={item._id} item={item} />) : <NoDataLabel />}</div>
    </Pannel>
  );

  //
}
