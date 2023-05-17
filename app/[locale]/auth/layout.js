'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Loader from '../../../components/Loader/Loader';
import styles from './layout.module.css';
import appBackground from '../../../public/background.jpg';
import { CMLogo } from '../../../components/AppLogos/AppLogos';

export default async function AuthLayout({ children }) {
  //

  const router = useRouter();
  const searchParams = useSearchParams();
  const { status } = useSession();

  useEffect(() => {
    if (status === 'authenticated') {
      if (searchParams.get('callbackUrl')) router.push(searchParams.get('callbackUrl'));
      else router.push('/dashboard/');
    }
  }, [router, searchParams, status]);

  return status === 'unauthenticated' ? (
    <div className={styles.container} style={{ backgroundImage: `url(${appBackground.src})` }}>
      <div className={styles.loginForm}>
        <div className={styles.logoWrapper}>
          <CMLogo />
        </div>
        <div className={styles.formWrapper}>{children}</div>
      </div>
    </div>
  ) : (
    <Loader visible full />
  );
}
