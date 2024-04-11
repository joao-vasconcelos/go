'use client';

/* * */

import useSWR from 'swr';
import API from '@/services/API';
import Loader from '@/components/Loader/Loader';
import { IconFileAlert, IconFileDownload, IconTrash } from '@tabler/icons-react';
import { useTranslations, useFormatter, useNow } from 'next-intl';
import styles from './ExportsExplorerListItem.module.css';
import { openConfirmModal } from '@mantine/modals';
import { Text } from '@mantine/core';

/* * */

export default function ExportsExplorerListItem({ item }) {
  //

  //
  // A. Setup variables

  const t = useTranslations('ExportsExplorerListItem');
  const now = useNow({ updateInterval: 1000 });
  const format = useFormatter();

  //
  // B. Fetch data

  const { mutate: allExportsMutate } = useSWR('/api/exports');
  const { data: userData } = useSWR(item.exported_by && `/api/users/${item.exported_by}`);

  //
  // B. Handle actions

  const handleDeleteExport = async () => {
    openConfirmModal({
      title: t('operations.delete.title'),
      size: 'lg',
      centered: true,
      closeOnClickOutside: true,
      children: <Text size="sm">{t('operations.delete.description')}</Text>,
      labels: { confirm: t('operations.delete.confirm'), cancel: t('operations.delete.cancel') },
      confirmProps: { color: 'red' },
      onConfirm: async () => {
        try {
          await API({ service: 'exports', resourceId: item._id, operation: 'delete', method: 'DELETE' });
          allExportsMutate();
        } catch (err) {
          console.log(err);
        }
      },
    });
  };

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

  //
  // C. Render components

  if (item.status === 'PROCESSING') {
    return (
      <div className={`${styles.container} ${styles.processing}`}>
        <div className={styles.mainSection}>
          <div className={styles.iconWrapper}>
            <Loader size={30} visible />
          </div>
          <div className={styles.infoWrapper}>
            <div className={styles.badgesWrapper}>
              <div className={styles.badge}>{t(`kind.${item.kind}.label`)}</div>
              <div className={styles.badge}>
                {t('status.PROCESSING')} {item.progress_current}/{item.progress_total}
              </div>
            </div>
            <div className={styles.filename}>{item.filename || 'Untitled File'}</div>
            <div className={styles.exportedBy}>{t('exported_by', { name: (userData && userData.name) || '• • •', time: format.relativeTime(new Date(item.createdAt), now) })}</div>
          </div>
        </div>
        <div className={styles.actionsSection} onClick={handleDeleteExport}>
          <IconTrash size={20} />
        </div>
      </div>
    );
  }

  if (item.status === 'COMPLETED') {
    return (
      <div className={`${styles.container} ${styles.completed}`}>
        <div className={styles.mainSection} onClick={handleExportDownload}>
          <div className={styles.iconWrapper}>
            <IconFileDownload size={50} stroke={1.5} />
          </div>
          <div className={styles.infoWrapper}>
            <div className={styles.badgesWrapper}>
              <div className={`${styles.badge} ${styles.status}`}>{t(`kind.${item.kind}.label`)}</div>
              <div className={`${styles.badge} ${styles.status}`}>{t('status.COMPLETED')}</div>
            </div>
            <div className={styles.filename}>{item.filename || 'Untitled File'}</div>
            <div className={styles.exportedBy}>{t('exported_by', { name: (userData && userData.name) || '• • •', time: format.relativeTime(new Date(item.createdAt), now) })}</div>
          </div>
        </div>
        <div className={styles.actionsSection} onClick={handleDeleteExport}>
          <IconTrash size={20} />
        </div>
      </div>
    );
  }

  if (item.status === 'ERROR') {
    return (
      <div className={`${styles.container} ${styles.error}`}>
        <div className={styles.mainSection}>
          <div className={styles.iconWrapper}>
            <IconFileAlert size={50} stroke={1.5} />
          </div>
          <div className={styles.infoWrapper}>
            <div className={styles.badgesWrapper}>
              <div className={`${styles.badge} ${styles.status}`}>{t(`kind.${item.kind}.label`)}</div>
              <div className={`${styles.badge} ${styles.status}`}>{t('status.ERROR')}</div>
            </div>
            <div className={styles.filename}>{item.filename || 'Untitled File'}</div>
            <div className={styles.exportedBy}>{t('exported_by', { name: (userData && userData.name) || '• • •', time: format.relativeTime(new Date(item.createdAt), now) })}</div>
          </div>
        </div>
        <div className={styles.actionsSection} onClick={handleDeleteExport}>
          <IconTrash size={20} />
        </div>
      </div>
    );
  }

  //
}
