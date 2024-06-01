'use client';

/* * */

import ListFooter from '@/components/ListFooter/ListFooter';
import MediaExplorerListFooter from '@/components/MediaExplorerListFooter/MediaExplorerListFooter';
import MediaExplorerListHeader from '@/components/MediaExplorerListHeader/MediaExplorerListHeader';
import MediaExplorerListItem from '@/components/MediaExplorerListItem/MediaExplorerListItem';
import NoDataLabel from '@/components/NoDataLabel/NoDataLabel';
import Pannel from '@/components/Pannel/Pannel';
import { useMediaExplorerContext } from '@/contexts/MediaExplorerContext';
import { useTranslations } from 'next-intl';
import useSWR from 'swr';

/* * */

export default function MediaExplorerList() {
	//

	//
	// A. Setup variables

	const t = useTranslations('MediaExplorerList');
	const mediaExplorerContext = useMediaExplorerContext();

	//
	// B. Fetch data

	const { error: allMediaError, isLoading: allMediaLoading, isValidating: allMediaValidating } = useSWR('/api/media');

	//
	// C. Render data

	return (
		<Pannel error={allMediaError} footer={<MediaExplorerListFooter />} header={<MediaExplorerListHeader />} loading={allMediaLoading} validating={allMediaValidating}>
			{mediaExplorerContext.list.items.length > 0 ? mediaExplorerContext.list.items.map(item => <MediaExplorerListItem key={item._id} item={item} />) : <NoDataLabel />}
		</Pannel>
	);

	//
}
