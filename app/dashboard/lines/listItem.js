'use client';

import BaseListItem from '../../../layouts/BaseListItem';
import Line from '../../../components/line/Line';

export default function ListItem({ short_name, long_name }) {
  return (
    <BaseListItem withChevron>
      <Line short_name={short_name} long_name={long_name} />
    </BaseListItem>
  );
}
