'use client';

/* * */

import NoDataLabel from '@/components/NoDataLabel/NoDataLabel';
import TagsExplorerTag from '@/components/TagsExplorerTag/TagsExplorerTag';
import { useIssuesExplorerContext } from '@/contexts/IssuesExplorerContext';
import doSearch from '@/services/doSearch';
import { Button, Modal, SimpleGrid, TextInput } from '@mantine/core';
import { IconCircle, IconCircleCheckFilled } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';
import useSWR from 'swr';

import styles from './IssuesExplorerIdPageItemTags.module.css';

/* * */

export default function IssuesExplorerIdPageItemTags() {
	//

	//
	// A. Setup variables

	const t = useTranslations('IssuesExplorerIdPageItemTags');
	const issuesExplorerContext = useIssuesExplorerContext();
	const [isEditMode, setIsEditMode] = useState(false);
	const [searchQuery, setSearchQuery] = useState('');

	//
	// B. Render components

	const { data: allTagsData } = useSWR('/api/tags');

	//
	// B. Transform data

	const allTagsDataFormatted = useMemo(() => {
		// Exit if no data is available
		if (!allTagsData) return [];
		// Filter tags based on search query
		const filteredTags = doSearch(searchQuery, allTagsData, { keys: ['label'] });
		// For each tag check if it associated with the current issue or not
		return filteredTags.map(tag => ({ ...tag, is_selected: issuesExplorerContext.form.values.tags.includes(tag._id) }));
		//
	}, [allTagsData, issuesExplorerContext.form.values.tags, searchQuery]);

	//
	// B. Handle actions

	const handleEnterEditMode = () => {
		setIsEditMode(true);
	};

	const handleExitEditMode = () => {
		setIsEditMode(false);
	};

	//
	// B. Render components

	return (
		<>
			<Modal onClose={handleExitEditMode} opened={isEditMode} size={600} title={t('modal.title')}>
				<SimpleGrid cols={1}>
					<TextInput onChange={({ currentTarget }) => setSearchQuery(currentTarget.value)} placeholder={t('modal.search.placeholder')} size="lg" value={searchQuery} />
					{allTagsDataFormatted.length > 0
						? (
							<SimpleGrid cols={3}>
								{allTagsDataFormatted.map(tagData => (
									<div key={tagData._id} className={`${styles.itemWrapper} ${tagData.is_selected && styles.isSelected}`} onClick={() => issuesExplorerContext.addTag(tagData._id)}>
										{tagData.is_selected ? <IconCircleCheckFilled size={18} /> : <IconCircle size={18} />}
										<TagsExplorerTag tagId={tagData._id} withHoverCard={false} />
									</div>
								))}
							</SimpleGrid>
						)
						: <NoDataLabel fill />}
				</SimpleGrid>
			</Modal>
			<div className={styles.container}>
				{issuesExplorerContext.form.values.tags.map(tagId => <TagsExplorerTag key={tagId} tagId={tagId} />)}
				{!issuesExplorerContext.page.is_read_only
				&& (
					<Button color="gray" onClick={handleEnterEditMode} size="compact-xs" variant="subtle">
						{t('edit.label')}
					</Button>
				)}
			</div>
		</>
	);
}
