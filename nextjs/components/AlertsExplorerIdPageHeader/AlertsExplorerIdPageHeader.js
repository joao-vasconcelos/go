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
import { useAlertsExplorerContext } from '@/contexts/AlertsExplorerContext';
import styles from './AlertsExplorerIdPageHeader.module.css';

/* * */

export default function AlertsExplorerIdPageHeader() {
  //

  //
  // A. Setup variables

  const t = useTranslations('AlertsExplorerIdPageHeader');
  const alertsExplorerContext = useAlertsExplorerContext();

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
          notify(alertsExplorerContext.item_id, 'loading', t('operations.delete.loading'));
          await alertsExplorerContext.deleteItem();
          notify(alertsExplorerContext.item_id, 'success', t('operations.delete.success'));
        } catch (error) {
          console.log(error);
          notify(alertsExplorerContext.item_id, 'error', error.message || t('operations.delete.error'));
        }
      },
    });
  };

  //
  // C. Render components

  return (
    <ListHeader>
      <AutoSave
        isValid={alertsExplorerContext.form.isValid()}
        isDirty={alertsExplorerContext.form.isDirty()}
        onValidate={alertsExplorerContext.validateItem}
        isErrorValidating={alertsExplorerContext.page.is_error}
        isErrorSaving={alertsExplorerContext.page.is_error_saving}
        isSaving={alertsExplorerContext.page.is_saving}
        onSave={alertsExplorerContext.saveItem}
        onClose={alertsExplorerContext.closeItem}
      />
      {alertsExplorerContext.form.values.code ? (
        <p>{alertsExplorerContext.form.values.code}</p>
      ) : (
        <Text size="h1" style="untitled" full>
          {t('untitled')}
        </Text>
      )}
      <div className={styles.spacer} />
      <AppAuthenticationCheck permissions={[{ scope: 'alerts', action: 'lock' }]}>
        <AppButtonLock isLocked={alertsExplorerContext.item_data?.is_locked} onClick={alertsExplorerContext.lockItem} />
      </AppAuthenticationCheck>
      <AppAuthenticationCheck permissions={[{ scope: 'alerts', action: 'delete' }]}>
        <AppButtonDelete onClick={handleDelete} disabled={alertsExplorerContext.page.is_read_only} />
      </AppAuthenticationCheck>
    </ListHeader>
  );
}
