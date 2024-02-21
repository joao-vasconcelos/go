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
import { useTagsExplorerContext } from '@/contexts/TagsExplorerContext';
import TagsExplorerTag from '@/components/TagsExplorerTag/TagsExplorerTag';
import styles from './TagsExplorerIdPageHeader.module.css';

/* * */

export default function TagsExplorerIdPageHeader() {
  //

  //
  // A. Setup variables

  const t = useTranslations('TagsExplorerIdPageHeader');
  const tagsExplorerContext = useTagsExplorerContext();

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
          notify(tagsExplorerContext.item_id, 'loading', t('operations.delete.loading'));
          await tagsExplorerContext.deleteItem();
          notify(tagsExplorerContext.item_id, 'success', t('operations.delete.success'));
        } catch (err) {
          console.log(err);
          notify(tagsExplorerContext.item_id, 'error', err.message || t('operations.delete.error'));
        }
      },
    });
  };

  //
  // C. Render components

  return (
    <ListHeader>
      <AutoSave
        isValid={tagsExplorerContext.form.isValid()}
        isDirty={tagsExplorerContext.form.isDirty()}
        onValidate={tagsExplorerContext.validateItem}
        isErrorValidating={tagsExplorerContext.page.is_error}
        isErrorSaving={tagsExplorerContext.page.is_error_saving}
        isSaving={tagsExplorerContext.page.is_saving}
        onSave={tagsExplorerContext.saveItem}
        onClose={tagsExplorerContext.closeItem}
      />
      {tagsExplorerContext.form.values.label ? (
        <TagsExplorerTag tagId={tagsExplorerContext.item_id} />
      ) : (
        <Text size="h1" style="untitled" full>
          {t('untitled')}
        </Text>
      )}
      <div className={styles.spacer} />
      <AppAuthenticationCheck permissions={[{ scope: 'tags', action: 'lock' }]}>
        <LockButton isLocked={tagsExplorerContext.item_data?.is_locked} onClick={tagsExplorerContext.lockItem} />
      </AppAuthenticationCheck>
      <AppAuthenticationCheck permissions={[{ scope: 'tags', action: 'delete' }]}>
        <DeleteButton onClick={handleDelete} disabled={tagsExplorerContext.page.is_read_only} />
      </AppAuthenticationCheck>
    </ListHeader>
  );
}
