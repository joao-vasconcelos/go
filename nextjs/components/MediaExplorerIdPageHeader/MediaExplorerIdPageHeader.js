'use client';

/* * */

import Text from '@/components/Text/Text';
import AutoSave from '@/components/AutoSave/AutoSave';
import notify from '@/services/notify';
import { openConfirmModal } from '@mantine/modals';
import { useTranslations } from 'next-intl';
import AppAuthenticationCheck from '@/components/AppAuthenticationCheck/AppAuthenticationCheck';
import AppButtonLock from '@/components/AppButtonLock/AppButtonLock';
import AppButtonDelete from '@/components/AppButtonDelete/AppButtonDelete';
import ListHeader from '@/components/ListHeader/ListHeader';
import { useMediaExplorerContext } from '@/contexts/MediaExplorerContext';
import MediaExplorerMedia from '@/components/MediaExplorerMedia/MediaExplorerMedia';
import styles from './MediaExplorerIdPageHeader.module.css';

/* * */

export default function MediaExplorerIdPageHeader() {
  //

  //
  // A. Setup variables

  const t = useTranslations('MediaExplorerIdPageHeader');
  const mediaExplorerContext = useMediaExplorerContext();

  //
  // B. Handle actions

  const handleDelete = async () => {
    openConfirmModal({
      title: <Text size="h2">{t('operations.delete.title')}</Text>,
      centered: true,
      closeOnClickOutside: true,
      children: <Text size="h3">{t('operations.delete.description')}</Text>,
      labels: { confirm: t('operations.delete.confirm'), cancel: t('operations.delete.cancel') },
      confirmProps: { color: 'red' },
      onConfirm: async () => {
        try {
          notify(mediaExplorerContext.item_id, 'loading', t('operations.delete.loading'));
          await mediaExplorerContext.deleteItem();
          notify(mediaExplorerContext.item_id, 'success', t('operations.delete.success'));
        } catch (error) {
          console.log(error);
          notify(mediaExplorerContext.item_id, 'error', err.message || t('operations.delete.error'));
        }
      },
    });
  };

  //
  // C. Render components

  return (
    <ListHeader>
      <AutoSave
        isValid={mediaExplorerContext.form.isValid()}
        isDirty={mediaExplorerContext.form.isDirty()}
        onValidate={mediaExplorerContext.validateItem}
        isErrorValidating={mediaExplorerContext.page.is_error}
        isErrorSaving={mediaExplorerContext.page.is_error_saving}
        isSaving={mediaExplorerContext.page.is_saving}
        onSave={mediaExplorerContext.saveItem}
        onClose={mediaExplorerContext.closeItem}
      />
      {mediaExplorerContext.form.values.label ? (
        <MediaExplorerMedia tagId={mediaExplorerContext.item_id} />
      ) : (
        <Text size="h1" style="untitled" full>
          {t('untitled')}
        </Text>
      )}
      <div className={styles.spacer} />
      <AppAuthenticationCheck permissions={[{ scope: 'media', action: 'lock' }]}>
        <AppButtonLock isLocked={mediaExplorerContext.item_data?.is_locked} onClick={mediaExplorerContext.lockItem} />
      </AppAuthenticationCheck>
      <AppAuthenticationCheck permissions={[{ scope: 'media', action: 'delete' }]}>
        <AppButtonDelete onClick={handleDelete} disabled={mediaExplorerContext.page.is_read_only} />
      </AppAuthenticationCheck>
    </ListHeader>
  );
}
