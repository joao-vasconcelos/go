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
import { useTypologiesExplorerContext } from '@/contexts/TypologiesExplorerContext';
import styles from './TypologiesExplorerIdPageHeader.module.css';

/* * */

export default function TypologiesExplorerIdPageHeader() {
  //

  //
  // A. Setup variables

  const t = useTranslations('TypologiesExplorerIdPageHeader');
  const typologiesExplorerContext = useTypologiesExplorerContext();

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
          notify(typologiesExplorerContext.item_id, 'loading', t('operations.delete.loading'));
          await typologiesExplorerContext.deleteItem();
          notify(typologiesExplorerContext.item_id, 'success', t('operations.delete.success'));
        } catch (error) {
          console.log(error);
          notify(typologiesExplorerContext.item_id, 'error', error.message || t('operations.delete.error'));
        }
      },
    });
  };

  //
  // C. Render components

  return (
    <ListHeader>
      <AutoSave
        isValid={typologiesExplorerContext.form.isValid()}
        isDirty={typologiesExplorerContext.form.isDirty()}
        onValidate={typologiesExplorerContext.validateItem}
        isErrorValidating={typologiesExplorerContext.page.is_error}
        isErrorSaving={typologiesExplorerContext.page.is_error_saving}
        isSaving={typologiesExplorerContext.page.is_saving}
        onSave={typologiesExplorerContext.saveItem}
        onClose={typologiesExplorerContext.closeItem}
      />
      <Text size="h1" style={!typologiesExplorerContext.form.values.name && 'untitled'} full>
        {typologiesExplorerContext.form.values.name || t('untitled')}
      </Text>
      <div className={styles.spacer} />
      <AppAuthenticationCheck permissions={[{ scope: 'typologies', action: 'lock' }]}>
        <AppButtonLock isLocked={typologiesExplorerContext.item_data?.is_locked} onClick={typologiesExplorerContext.lockItem} />
      </AppAuthenticationCheck>
      <AppAuthenticationCheck permissions={[{ scope: 'typologies', action: 'delete' }]}>
        <AppButtonDelete onClick={handleDelete} disabled={typologiesExplorerContext.page.is_read_only} />
      </AppAuthenticationCheck>
    </ListHeader>
  );
}
