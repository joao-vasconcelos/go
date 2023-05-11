'use client';

import { LoadingOverlay } from '@mantine/core';

export default function Loading() {
  return <LoadingOverlay visible loaderProps={{ color: 'gray' }} />;
}
