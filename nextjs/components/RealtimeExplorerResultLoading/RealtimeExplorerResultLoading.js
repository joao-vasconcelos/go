'use client';

/* * */

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import Pannel from '@/components/Pannel/Pannel';
import NoDataLabel from '@/components/NoDataLabel/NoDataLabel';

/* * */

export default function RealtimeExplorerResultLoading() {
  //

  //
  // A. Setup variables

  const t = useTranslations('RealtimeExplorerResultLoading');

  //
  // B. Render components

  return (
    <Pannel>
      <NoDataLabel text={t('no_data')} fill />
      {/* <Image src={`https://cataas.com/cat?r=${new Date().getMilliseconds()}`} alt={t('alt')} sizes="500px" priority fill style={{ objectFit: 'fill' }} /> */}
    </Pannel>
  );

  //
}
