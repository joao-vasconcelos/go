'use client';

/* * */

import Text from '@/components/Text/Text';
import AutoSave from '@/components/AutoSave/AutoSave';
import notify from '@/services/notify';
import { openConfirmModal } from '@mantine/modals';
import { useTranslations } from 'next-intl';
import AuthGate from '@/components/AuthGate/AuthGate';
import LockButton from '@/components/LockButton/LockButton';
import DeleteButton from '@/components/DeleteButton/DeleteButton';
import ListHeader from '@/components/ListHeader/ListHeader';
import { useUsersExplorerContext } from '@/contexts/UsersExplorerContext';
import UsersExplorerUser from '@/components/UsersExplorerUser/UsersExplorerUser';
import styles from './UsersExplorerIdPageHeader.module.css';

/* * */

export default function UsersExplorerIdPageHeader() {
  //

  //
  // A. Setup variables

  const t = useTranslations('UsersExplorerIdPageHeader');
  const usersExplorerContext = useUsersExplorerContext();

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
          notify(usersExplorerContext.item_id, 'loading', t('operations.delete.loading'));
          await usersExplorerContext.deleteItem();
          notify(usersExplorerContext.item_id, 'success', t('operations.delete.success'));
        } catch (err) {
          console.log(err);
          notify(usersExplorerContext.item_id, 'error', err.message || t('operations.delete.error'));
        }
      },
    });
  };

  //
  // C. Render components

  return (
    <ListHeader>
      <AutoSave
        isValid={usersExplorerContext.form.isValid()}
        isDirty={usersExplorerContext.form.isDirty()}
        onValidate={usersExplorerContext.validateItem}
        isErrorValidating={usersExplorerContext.page.is_error}
        isErrorSaving={usersExplorerContext.page.is_error_saving}
        isSaving={usersExplorerContext.page.is_saving}
        onSave={usersExplorerContext.saveItem}
        onClose={usersExplorerContext.closeItem}
      />
      {usersExplorerContext.form.values.label ? (
        <UsersExplorerUser userId={usersExplorerContext.item_id} />
      ) : (
        <Text size="h1" style="untitled" full>
          {t('untitled')}
        </Text>
      )}
      <div className={styles.spacer} />
      <AuthGate scope="users" permission="lock">
        <LockButton isLocked={usersExplorerContext.item_data?.is_locked} onClick={usersExplorerContext.lockItem} />
      </AuthGate>
      <AuthGate scope="users" permission="delete">
        <DeleteButton onClick={handleDelete} disabled={usersExplorerContext.page.is_read_only} />
      </AuthGate>
    </ListHeader>
  );
}
