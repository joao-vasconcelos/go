'use client';

import { TwoUnevenColumns } from '../../../../components/Layouts/Layouts';
import { Skeleton } from '@mantine/core';

export default function Layout({ children }) {
  return <TwoUnevenColumns first={<Skeleton height='100%' width='100%' radius='md' />} />;
}
