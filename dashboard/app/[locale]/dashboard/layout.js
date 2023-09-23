'use client';

import 'dayjs/locale/pt';
import { MapProvider } from 'react-map-gl/maplibre';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import AppWrapper from '@/components/AppWrapper/AppWrapper';

export default function Layout({ children }) {
  //

  const router = useRouter();

  const { status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push(`/auth/signin?callbackUrl=${window.location.pathname}`);
    },
  });

  return (
    <MapProvider>
      <AppWrapper>{children}</AppWrapper>
    </MapProvider>
  );
}
