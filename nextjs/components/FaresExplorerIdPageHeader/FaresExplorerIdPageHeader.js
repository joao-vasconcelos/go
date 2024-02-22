'use client';

/* * */

import Text from '@/components/Text/Text';
import AutoSave from '@/components/AutoSave/AutoSave';
import notify from '@/services/notify';
import { openConfirmModal } from '@mantine/modals';
import { useTranslations } from 'next-intl';
import AppAuthenticationCheck from '@/components/AppAuthenticationCheck/AppAuthenticationCheck';
import LockButton from '@/components/LockButton/LockButton';
import DeleteButton from '@/components/DeleteButton/DeleteButton';
import ListHeader from '@/components/ListHeader/ListHeader';
import { useFaresExplorerContext } from '@/contexts/FaresExplorerContext';
import styles from './FaresExplorerIdPageHeader.module.css';

/* * */

export default function FaresExplorerIdPageHeader() {
  //

  //
  // A. Setup variables

  const t = useTranslations('FaresExplorerIdPageHeader');
  const faresExplorerContext = useFaresExplorerContext();

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
          notify(faresExplorerContext.item_id, 'loading', t('operations.delete.loading'));
          await faresExplorerContext.deleteItem();
          notify(faresExplorerContext.item_id, 'success', t('operations.delete.success'));
        } catch (err) {
          console.log(err);
          notify(faresExplorerContext.item_id, 'error', err.message || t('operations.delete.error'));
        }
      },
    });
  };

  //
  // C. Render components

  return (
    <ListHeader>
      <AutoSave
        isValid={faresExplorerContext.form.isValid()}
        isDirty={faresExplorerContext.form.isDirty()}
        onValidate={faresExplorerContext.validateItem}
        isErrorValidating={faresExplorerContext.page.is_error}
        isErrorSaving={faresExplorerContext.page.is_error_saving}
        isSaving={faresExplorerContext.page.is_saving}
        onSave={faresExplorerContext.saveItem}
        onClose={faresExplorerContext.closeItem}
      />
      <Text size="h1" style={!faresExplorerContext.form.values.name && 'untitled'} full>
        {faresExplorerContext.form.values.name || t('untitled')}
      </Text>
      <div className={styles.spacer} />
      <AppAuthenticationCheck permissions={[{ scope: 'fares', action: 'lock' }]}>
        <LockButton isLocked={faresExplorerContext.item_data?.is_locked} onClick={faresExplorerContext.lockItem} />
      </AppAuthenticationCheck>
      <AppAuthenticationCheck permissions={[{ scope: 'fares', action: 'delete' }]}>
        <DeleteButton onClick={handleDelete} disabled={faresExplorerContext.page.is_read_only} />
      </AppAuthenticationCheck>
    </ListHeader>
  );
}
