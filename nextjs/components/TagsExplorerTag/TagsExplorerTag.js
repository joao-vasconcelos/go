'use client';

/* * */

import { HoverCard } from '@mantine/core';
import styles from './TagsExplorerTag.module.css';
import TagsExplorerTagHoverCard from '@/components/TagsExplorerTagHoverCard/TagsExplorerTagHoverCard';

/* * */

export default function TagsExplorerTag({ tagData, withHoverCard = true }) {
  return (
    <HoverCard width={280} openDelay={500} shadow="md">
      <HoverCard.Target>
        <div className={styles.container} style={{ color: tagData.text_color, backgroundColor: tagData.color }}>
          {tagData.label}
        </div>
      </HoverCard.Target>
      {withHoverCard && (
        <HoverCard.Dropdown p={0}>
          <TagsExplorerTagHoverCard tagData={tagData} />
        </HoverCard.Dropdown>
      )}
    </HoverCard>
  );
}
