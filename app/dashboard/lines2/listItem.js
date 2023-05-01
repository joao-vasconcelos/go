'use client';

import { useRouter } from 'next/navigation';
import BaseListItem from '../../../layouts/BaseListItem';
import Line from '../../../components/line/Line';

export default function ListItem({ short_name, long_name }) {
  //

  const router = useRouter();

  const handleClick = () => {
    router.push(`/dashboard/lines/${short_name}`);
  };

  return (
    <BaseListItem onClick={handleClick} withChevron>
      <Line short_name={short_name} long_name={long_name} />
    </BaseListItem>
  );
}
