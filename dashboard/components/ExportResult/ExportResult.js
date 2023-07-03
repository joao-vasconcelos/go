import styles from './ExportResult.module.css';
import { IconFileDownload, IconFileAlert } from '@tabler/icons-react';
import Loader from '@/components/Loader/Loader';
import { useTranslations, useFormatter, useNow } from 'next-intl';
import API from '@/services/API';
import useSWR from 'swr';

//
// WAITING

function ExportResultWaiting({ item }) {
  //

  const t = useTranslations('ExportResult');
  const format = useFormatter();
  const now = useNow({ updateInterval: 1000 });

  const { data: userData } = useSWR(item.exported_by && `/api/users/${item.exported_by}`);

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
        <div className={styles.exportedBy}>{t('exported_by', { name: (userData && userData.name) || '• • •', time: format.relativeTime(new Date(item.createdAt), now) })}</div>
      </div>
    </div>
  );
}

//
// IN PROGRESS

function ExportResultInProgress({ item }) {
  //

  const t = useTranslations('ExportResult');
  const format = useFormatter();
  const now = useNow({ updateInterval: 1000 });

  const { data: userData } = useSWR(item.exported_by && `/api/users/${item.exported_by}`);

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
        <div className={styles.exportedBy}>{t('exported_by', { name: (userData && userData.name) || '• • •', time: format.relativeTime(new Date(item.createdAt), now) })}</div>
      </div>
    </div>
  );
}

//
// COMPLETED

function ExportResultCompleted({ item }) {
  //

  const t = useTranslations('ExportResult');
  const format = useFormatter();
  const now = useNow({ updateInterval: 1000 });

  const { data: userData } = useSWR(item.exported_by && `/api/users/${item.exported_by}`);

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
        <div className={styles.exportedBy}>{t('exported_by', { name: (userData && userData.name) || '• • •', time: format.relativeTime(new Date(item.createdAt), now) })}</div>
      </div>
    </div>
  );
}

//
// ERROR

function ExportResultError({ item }) {
  //

  const t = useTranslations('ExportResult');
  const format = useFormatter();
  const now = useNow({ updateInterval: 1000 });

  const { data: userData } = useSWR(item.exported_by && `/api/users/${item.exported_by}`);

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
        <div className={styles.exportedBy}>{t('exported_by', { name: (userData && userData.name) || '• • •', time: format.relativeTime(new Date(item.createdAt), now) })}</div>
      </div>
    </div>
  );
}

//
// FULL COMPONENT

export default function ExportResult({ item }) {
  if (item.status === 0) {
    return <ExportResultWaiting item={item} />;
  } else if (item.status === 1) {
    return <ExportResultInProgress item={item} />;
  } else if (item.status === 2) {
    return <ExportResultCompleted item={item} />;
  } else {
    return <ExportResultError item={item} />;
  }
}
