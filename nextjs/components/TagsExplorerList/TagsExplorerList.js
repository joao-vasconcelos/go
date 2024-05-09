'use client';

/* * */

import useSWR from 'swr';
import { useTranslations } from 'next-intl';
import Pannel from '@/components/Pannel/Pannel';
import NoDataLabel from '@/components/NoDataLabel/NoDataLabel';
import ListFooter from '@/components/ListFooter/ListFooter';
import TagsExplorerListItem from '@/components/TagsExplorerListItem/TagsExplorerListItem';
import TagsExplorerListHeader from '@/components/TagsExplorerListHeader/TagsExplorerListHeader';
import TagsExplorerListFooter from '@/components/TagsExplorerListFooter/TagsExplorerListFooter';
import { useTagsExplorerContext } from '@/contexts/TagsExplorerContext';

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
		<Pannel loading={allTagsLoading} validating={allTagsValidating} error={allTagsError} header={<TagsExplorerListHeader />} footer={<TagsExplorerListFooter />}>
			{tagsExplorerContext.list.items.length > 0 ? tagsExplorerContext.list.items.map((item) => <TagsExplorerListItem key={item._id} item={item} />) : <NoDataLabel />}
		</Pannel>
	);

	//
}