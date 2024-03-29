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
import { useIssuesExplorerContext } from '@/contexts/IssuesExplorerContext';
import IssuesExplorerAttributeStatusSelect from '@/components/IssuesExplorerAttributeStatusSelect/IssuesExplorerAttributeStatusSelect';
import IssuesExplorerAttributePrioritySelect from '@/components/IssuesExplorerAttributePrioritySelect/IssuesExplorerAttributePrioritySelect';
import styles from './IssuesExplorerIdPageHeader.module.css';
import GlobalAuthorTimestamp from '@/components/GlobalAuthorTimestamp/GlobalAuthorTimestamp';

/* * */

export default function IssuesExplorerIdPageHeader() {
  //

  //
  // A. Setup variables

  const t = useTranslations('IssuesExplorerIdPageHeader');
  const issuesExplorerContext = useIssuesExplorerContext();

  //
  // B. Handle actions

  const handleChangeStatus = (newValue) => {
    issuesExplorerContext.form.setFieldValue('status', newValue);
  };

  const handleChangePriority = (newValue) => {
    issuesExplorerContext.form.setFieldValue('priority', newValue);
  };

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
          notify(issuesExplorerContext.item_id, 'loading', t('operations.delete.loading'));
          await issuesExplorerContext.deleteItem();
          notify(issuesExplorerContext.item_id, 'success', t('operations.delete.success'));
        } catch (err) {
          console.log(err);
          notify(issuesExplorerContext.item_id, 'error', err.message || t('operations.delete.error'));
        }
      },
    });
  };

  //
  // C. Render components

  return (
    <ListHeader>
      <AutoSave
        isValid={issuesExplorerContext.form.isValid()}
        isDirty={issuesExplorerContext.form.isDirty()}
        onValidate={issuesExplorerContext.validateItem}
        isErrorValidating={issuesExplorerContext.page.is_error}
        isErrorSaving={issuesExplorerContext.page.is_error_saving}
        isSaving={issuesExplorerContext.page.is_saving}
        onSave={issuesExplorerContext.saveItem}
        onClose={issuesExplorerContext.closeItem}
      />
      <div className={styles.wrapper}>
        <IssuesExplorerAttributeStatusSelect value={issuesExplorerContext.form.values.status} onChange={handleChangeStatus} />
        <IssuesExplorerAttributePrioritySelect value={issuesExplorerContext.form.values.priority} onChange={handleChangePriority} />
      </div>
      <GlobalAuthorTimestamp actionVerb={'abriu'} timestamp={issuesExplorerContext.form.values.created_at} userId={issuesExplorerContext.form.values.created_by} />
      <AppAuthenticationCheck permissions={[{ scope: 'issues', action: 'lock' }]}>
        <LockButton isLocked={issuesExplorerContext.item_data?.is_locked} onClick={issuesExplorerContext.lockItem} />
      </AppAuthenticationCheck>
      <AppAuthenticationCheck permissions={[{ scope: 'issues', action: 'delete' }]}>
        <DeleteButton onClick={handleDelete} disabled={issuesExplorerContext.page.is_read_only} />
      </AppAuthenticationCheck>
    </ListHeader>
  );
}
