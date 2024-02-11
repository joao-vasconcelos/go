'use client';

/* * */

import { useParams } from 'next/navigation';
import { useRouter } from '@/translations/navigation';
import BaseListItem from '@/components/BaseListItem/BaseListItem';

/* * */

export default function AlertsExplorerListItem({ item }) {
  //

  //
  // A. Setup variables

  const router = useRouter();
  const { alert_id } = useParams();

  //
  // B. Handle actions

  const handleClick = () => {
    if (alert_id === item._id) return;
    router.push(`/alerts/${item._id}`);
  };

  //
  // C. Render components

  return (
    <BaseListItem onClick={handleClick} isSelected={alert_id === item._id} withChevron>
      <p>{item.title}</p>
    </BaseListItem>
  );

  //
}
