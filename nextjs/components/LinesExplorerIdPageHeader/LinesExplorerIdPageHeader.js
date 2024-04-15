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
import { useLinesExplorerContext } from '@/contexts/LinesExplorerContext';
import { LinesExplorerLine } from '@/components/LinesExplorerLine/LinesExplorerLine';

/* * */

export default function LinesExplorerIdPageHeader() {
  //

  //
  // A. Setup variables

  const t = useTranslations('LinesExplorerIdPageHeader');
  const linesExplorerContext = useLinesExplorerContext();

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
          notify(linesExplorerContext.item_id, 'loading', t('operations.delete.loading'));
          await linesExplorerContext.deleteItem();
          notify(linesExplorerContext.item_id, 'success', t('operations.delete.success'));
        } catch (err) {
          console.log(err);
          notify(linesExplorerContext.item_id, 'error', err.message || t('operations.delete.error'));
        }
      },
    });
  };

  //
  // C. Render components

  return (
    <ListHeader>
      <AutoSave
        isValid={linesExplorerContext.form.isValid()}
        isDirty={linesExplorerContext.form.isDirty()}
        onValidate={linesExplorerContext.validateItem}
        isErrorValidating={linesExplorerContext.page.is_error}
        isErrorSaving={linesExplorerContext.page.is_error_saving}
        isSaving={linesExplorerContext.page.is_saving}
        onSave={linesExplorerContext.saveItem}
        onClose={linesExplorerContext.closeItem}
      />
      {linesExplorerContext.item_data?.name ? (
        <LinesExplorerLine lineId={linesExplorerContext.item_id} withLink={false} />
      ) : (
        <Text size="h1" style={!linesExplorerContext.form.values.name && 'untitled'} full>
          {t('untitled')}
        </Text>
      )}
      <AppAuthenticationCheck permissions={[{ scope: 'lines', action: 'lock' }]}>
        <AppButtonLock isLocked={linesExplorerContext.item_data?.is_locked} onClick={linesExplorerContext.lockItem} />
      </AppAuthenticationCheck>
      <AppAuthenticationCheck permissions={[{ scope: 'lines', action: 'delete' }]}>
        <AppButtonDelete onClick={handleDelete} disabled={linesExplorerContext.page.is_read_only} />
      </AppAuthenticationCheck>
    </ListHeader>
  );
}
