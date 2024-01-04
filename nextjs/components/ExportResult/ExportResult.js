'use client';

import styles from './ExportResult.module.css';
import { IconFileDownload, IconFileAlert } from '@tabler/icons-react';
import Loader from '@/components/Loader/Loader';
import { useTranslations, useFormatter, useNow } from 'next-intl';
import API from '@/services/API';
import useSWR from 'swr';
import Badge from '../Badge/Badge';

//
// EXPORTED BY AND CREATED AT

function ExportedByWithTime({ exportedBy, createdAt }) {
  //
  const t = useTranslations('ExportResult');
  const format = useFormatter();
  const now = useNow({ updateInterval: 1000 });

  const { data: userData } = useSWR(exportedBy && `/api/users/${exportedBy}`);

  return <div className={styles.exportedBy}>{t('exported_by', { name: (userData && userData.name) || '• • •', time: format.relativeTime(new Date(createdAt), now) })}</div>;
}

//
// WAITING

export function ExportResultWaiting({ item }) {
  //

  const t = useTranslations('ExportResult');

  return (
    <div className={`${styles.container} ${styles.waiting}`}>
      <div className={styles.iconWrapper}>
        <Loader size={30} visible />
      </div>
      <div className={styles.infoWrapper}>
        <div className={styles.badgesWrapper}>
          <div className={styles.badge}>{t(`type.${item.type}.label`)}</div>
          <div className={styles.badge}>{t(`status.${item.status}`)}</div>
        </div>
        <div className={styles.filename}>{item.filename || 'Untitled File'}</div>
        <ExportedByWithTime exportedBy={item.exported_by} createdAt={item.createdAt} />
      </div>
    </div>
  );
}

//
// IN PROGRESS

export function ExportResultInProgress({ item }) {
  //

  const t = useTranslations('ExportResult');

  return (
    <div className={`${styles.container} ${styles.inProgress}`}>
      <div className={styles.iconWrapper}>
        <Loader size={30} visible />
      </div>
      <div className={styles.infoWrapper}>
        <div className={styles.badgesWrapper}>
          <div className={styles.badge}>{t(`type.${item.type}.label`)}</div>
          <div className={styles.badge}>
            {t(`status.${item.status}`)} {item.progress_current}/{item.progress_total}
          </div>
        </div>
        <div className={styles.filename}>{item.filename || 'Untitled File'}</div>
        <ExportedByWithTime exportedBy={item.exported_by} createdAt={item.createdAt} />
      </div>
    </div>
  );
}

//
// COMPLETED

export function ExportResultCompleted({ item }) {
  //

  const t = useTranslations('ExportResult');

  const handleExportDownload = async () => {
    try {
      const archiveBlob = await API({ service: 'exports', resourceId: item._id, operation: 'download', method: 'GET', parseType: 'blob' });
      const objectURL = URL.createObjectURL(archiveBlob);
      const zipDownload = document.createElement('a');
      zipDownload.href = objectURL;
      zipDownload.download = item.filename;
      document.body.appendChild(zipDownload);
      zipDownload.click();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className={`${styles.container} ${styles.completed}`} onClick={handleExportDownload}>
      <div className={styles.iconWrapper}>
        <IconFileDownload size={50} stroke={1.5} />
      </div>
      <div className={styles.infoWrapper}>
        <div className={styles.badgesWrapper}>
          <div className={`${styles.badge} ${styles.status}`}>{t(`type.${item.type}.label`)}</div>
          <div className={`${styles.badge} ${styles.status}`}>{t(`status.${2 || item.status}`)}</div>
        </div>
        <div className={styles.filename}>{item.filename || 'Untitled File'}</div>
        <ExportedByWithTime exportedBy={item.exported_by} createdAt={item.createdAt} />
      </div>
    </div>
  );
}

//
// ERROR

export function ExportResultError({ item }) {
  //

  const t = useTranslations('ExportResult');

  return (
    <div className={`${styles.container} ${styles.error}`}>
      <div className={styles.iconWrapper}>
        <IconFileAlert size={50} stroke={1.5} />
      </div>
      <div className={styles.infoWrapper}>
        <div className={styles.badgesWrapper}>
          <div className={`${styles.badge} ${styles.status}`}>{t(`type.${item.type}.label`)}</div>
          <div className={`${styles.badge} ${styles.status}`}>{t(`status.${2 || item.status}`)}</div>
        </div>
        <div className={styles.filename}>{item.filename || 'Untitled File'}</div>
        <ExportedByWithTime exportedBy={item.exported_by} createdAt={item.createdAt} />
      </div>
    </div>
  );
}
