'use client';

/* * */

import { useParams } from 'next/navigation';
import { useRouter } from '@/translations/navigation';
import BaseListItem from '@/components/BaseListItem/BaseListItem';

/* * */

export default function IssuesExplorerListItem({ item }) {
  //

  //
  // A. Setup variables

  const router = useRouter();
  const { issue_id } = useParams();

  //
  // B. Handle actions

  const handleClick = () => {
    if (issue_id === item._id) return;
    router.push(`/dashboard/issues/${item._id}`);
  };

  //
  // C. Render components

  return (
    <BaseListItem onClick={handleClick} isSelected={issue_id === item._id} withChevron>
      {item.title || 'no title'}
    </BaseListItem>
  );

  //
}
