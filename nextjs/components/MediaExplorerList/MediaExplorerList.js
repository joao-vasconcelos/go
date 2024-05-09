'use client';

/* * */

import useSWR from 'swr';
import { useTranslations } from 'next-intl';
import Pannel from '@/components/Pannel/Pannel';
import NoDataLabel from '@/components/NoDataLabel/NoDataLabel';
import ListFooter from '@/components/ListFooter/ListFooter';
import MediaExplorerListItem from '@/components/MediaExplorerListItem/MediaExplorerListItem';
import MediaExplorerListHeader from '@/components/MediaExplorerListHeader/MediaExplorerListHeader';
import MediaExplorerListFooter from '@/components/MediaExplorerListFooter/MediaExplorerListFooter';
import { useMediaExplorerContext } from '@/contexts/MediaExplorerContext';

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
		<Pannel loading={allMediaLoading} validating={allMediaValidating} error={allMediaError} header={<MediaExplorerListHeader />} footer={<MediaExplorerListFooter />}>
			{mediaExplorerContext.list.items.length > 0 ? mediaExplorerContext.list.items.map((item) => <MediaExplorerListItem key={item._id} item={item} />) : <NoDataLabel />}
		</Pannel>
	);

	//
}