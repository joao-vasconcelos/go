'use client';

/* * */

import Image from 'next/image';
import Pannel from '@/components/Pannel/Pannel';
import { useTranslations } from 'next-intl';
import { Button } from '@mantine/core';
import { IconCat } from '@tabler/icons-react';
import { useState } from 'react';

/* * */

const BASE_IMAGE_URL = 'https://cataas.com/cat';

/* * */

export default function RealtimeExplorerResultLoading() {
  //

  //
  // A. Setup variables

  const t = useTranslations('RealtimeExplorerResultLoading');
  const [imageUrl, setImageUrl] = useState(BASE_IMAGE_URL);

  //
  // B. Handle actions

  const refreshImageUrl = () => {
    setImageUrl(`${BASE_IMAGE_URL}?r=${new Date().getMilliseconds()}`);
  };

  //
  // C. Render components

  return (
    <Pannel
      header={
        <Button size="xs" variant="subtle" color="gray" leftSection={<IconCat size={16} />} onClick={refreshImageUrl}>
          {t('refresh_image')}
        </Button>
      }
    >
      <div style={{ position: 'relative', width: '100%', height: '100%' }}>
        <Image src={imageUrl} alt={t('alt')} sizes="5000px" priority fill style={{ objectFit: 'cover' }} />
      </div>
    </Pannel>
  );

  //
}
