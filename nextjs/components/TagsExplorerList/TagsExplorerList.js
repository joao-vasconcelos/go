'use client';

/* * */

import ListFooter from '@/components/ListFooter/ListFooter';
import NoDataLabel from '@/components/NoDataLabel/NoDataLabel';
import Pannel from '@/components/Pannel/Pannel';
import TagsExplorerListFooter from '@/components/TagsExplorerListFooter/TagsExplorerListFooter';
import TagsExplorerListHeader from '@/components/TagsExplorerListHeader/TagsExplorerListHeader';
import TagsExplorerListItem from '@/components/TagsExplorerListItem/TagsExplorerListItem';
import { useTagsExplorerContext } from '@/contexts/TagsExplorerContext';
import { useTranslations } from 'next-intl';
import useSWR from 'swr';

/* * */

export default function TagsExplorerList() {
	//

	//
	// A. Setup variables

	const t = useTranslations('TagsExplorerList');
	const tagsExplorerContext = useTagsExplorerContext();

	//
	// B. Fetch data

	const { error: allTagsError, isLoading: allTagsLoading, isValidating: allTagsValidating } = useSWR('/api/tags');

	//
	// C. Render data

	return (
		<Pannel error={allTagsError} footer={<TagsExplorerListFooter />} header={<TagsExplorerListHeader />} loading={allTagsLoading} validating={allTagsValidating}>
			{tagsExplorerContext.list.items.length > 0 ? tagsExplorerContext.list.items.map(item => <TagsExplorerListItem key={item._id} item={item} />) : <NoDataLabel />}
		</Pannel>
	);

	//
}
