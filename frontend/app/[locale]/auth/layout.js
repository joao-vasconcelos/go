'use client';

import { useSession } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next-intl/client';
import Loader from '@/components/Loader/Loader';
import styles from './layout.module.css';
import appBackground from 'public/background.jpg';
import { CMLogo } from '@/components/AppLogos/AppLogos';

export default async function AuthLayout({ children }) {
  //

  //
  // A. Setup variables

  const router = useRouter();
  const searchParams = useSearchParams();
  const { status } = useSession();

  //
  // B. Setup components

  const FormWrapper = () => (
    <div className={styles.container} style={{ backgroundImage: `url(${appBackground.src})` }}>
      <div className={styles.loginForm}>
        <div className={styles.logoWrapper}>
          <CMLogo />
        </div>
        <div className={styles.formWrapper}>{children}</div>
      </div>
    </div>
  );

  //
  // C. Render components

  if (status === 'loading') {
    return <Loader visible full />;
    //
  } else if (status === 'authenticated') {
    if (searchParams.get('callbackUrl')) router.push(searchParams.get('callbackUrl'));
    else router.push('/dashboard/');
    //
  } else if (status === 'unauthenticated') {
    return <FormWrapper />;
    //
  }
}
