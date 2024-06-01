'use client';

/* * */

import Loader from '@/components/Loader/Loader';
import TagsExplorerTagHoverCard from '@/components/TagsExplorerTagHoverCard/TagsExplorerTagHoverCard';
import { HoverCard } from '@mantine/core';
import useSWR from 'swr';

import styles from './TagsExplorerTag.module.css';

/* * */

export default function TagsExplorerTag({ tagId, withHoverCard = true }) {
	//

	//
	// A. Fetch data

	const { data: tagData, error: tagError, isLoading: tagLoading } = useSWR(tagId && `/api/tags/${tagId}`);

	//
	// B. Render components

	return !tagData
		? (
			<div className={styles.container}>
				<Loader size={15} visible />
			</div>
		)
		: (
			<HoverCard openDelay={500} shadow="md" width={280}>
				<HoverCard.Target>
					<div className={styles.container} style={{ backgroundColor: tagData.color, color: tagData.text_color }}>
						{tagData.label}
					</div>
				</HoverCard.Target>
				{withHoverCard
				&& (
					<HoverCard.Dropdown p={0}>
						<TagsExplorerTagHoverCard tagData={tagData} />
					</HoverCard.Dropdown>
				)}
			</HoverCard>
		)
	;

	//
}
