'use client';

/* * */

import ArchivesExplorerListFooter from '@/components/ArchivesExplorerListFooter/ArchivesExplorerListFooter';
import ArchivesExplorerListHeader from '@/components/ArchivesExplorerListHeader/ArchivesExplorerListHeader';
import ArchivesExplorerListItem from '@/components/ArchivesExplorerListItem/ArchivesExplorerListItem';
import NoDataLabel from '@/components/NoDataLabel/NoDataLabel';
import Pannel from '@/components/Pannel/Pannel';
import { useArchivesExplorerContext } from '@/contexts/ArchivesExplorerContext';
import useSWR from 'swr';

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
		<Pannel error={allArchivesError} footer={<ArchivesExplorerListFooter />} header={<ArchivesExplorerListHeader />} loading={allArchivesLoading} validating={allArchivesValidating}>
			<div className={styles.listWrapper}>{archivesExplorerContext.list.items.length > 0 ? archivesExplorerContext.list.items.map(item => <ArchivesExplorerListItem key={item._id} item={item} />) : <NoDataLabel />}</div>
		</Pannel>
	);

	//
}
