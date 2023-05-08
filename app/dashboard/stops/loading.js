'use client';

import TwoUnevenColumns from '../../../layouts/TwoUnevenColumns';
import { Skeleton } from '@mantine/core';

export default function Layout({ children }) {
  return <TwoUnevenColumns first={<Skeleton height='100%' width='100%' radius='md' />} />;
}
