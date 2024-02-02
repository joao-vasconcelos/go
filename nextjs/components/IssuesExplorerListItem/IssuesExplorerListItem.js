'use client';

/* * */

import { useParams } from 'next/navigation';
import { useRouter } from '@/translations/navigation';
import BaseListItem from '@/components/BaseListItem/BaseListItem';
import TagsExplorerTag from '@/components/TagsExplorerTag/TagsExplorerTag';

/* * */

export default function IssuesExplorerListItem({ item }) {
  //

  //
  // A. Setup variables

  const router = useRouter();
  const { tag_id } = useParams();

  //
  // B. Handle actions

  const handleClick = () => {
    if (tag_id === item._id) return;
    router.push(`/dashboard/tags/${item._id}`);
  };

  //
  // C. Render components

  return (
    <BaseListItem onClick={handleClick} isSelected={tag_id === item._id} withChevron>
      <TagsExplorerTag tagData={item} withHoverCard={false} />
    </BaseListItem>
  );

  //
}
