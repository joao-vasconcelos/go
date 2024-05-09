'use client';

/* * */

import useSWR from 'swr';
import { HoverCard } from '@mantine/core';
import Loader from '@/components/Loader/Loader';
import TagsExplorerTagHoverCard from '@/components/TagsExplorerTagHoverCard/TagsExplorerTagHoverCard';
import styles from './TagsExplorerTag.module.css';

/* * */

export default function TagsExplorerTag({ tagId, withHoverCard = true }) {
	//

	//
	// A. Fetch data

	const { data: tagData, isLoading: tagLoading, error: tagError } = useSWR(tagId && `/api/tags/${tagId}`);

	//
	// B. Render components

	return !tagData ?
		<div className={styles.container}>
			<Loader size={15} visible />
		</div> :
		<HoverCard width={280} openDelay={500} shadow="md">
			<HoverCard.Target>
				<div className={styles.container} style={{ color: tagData.text_color, backgroundColor: tagData.color }}>
					{tagData.label}
				</div>
			</HoverCard.Target>
			{withHoverCard &&
        <HoverCard.Dropdown p={0}>
        	<TagsExplorerTagHoverCard tagData={tagData} />
        </HoverCard.Dropdown>
			}
		</HoverCard>
	;

	//
}