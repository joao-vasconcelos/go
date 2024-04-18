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
import { useRoutesExplorerContext } from '@/contexts/RoutesExplorerContext';
import { LinesExplorerLine } from '@/components/LinesExplorerLine/LinesExplorerLine';

/* * */

export default function RoutesExplorerIdPageHeader() {
  //

  //
  // A. Setup variables

  const t = useTranslations('RoutesExplorerIdPageHeader');
  const linesExplorerContext = useLinesExplorerContext();
  const routesExplorerContext = useRoutesExplorerContext();

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
          notify(routesExplorerContext.item_id, 'loading', t('operations.delete.loading'));
          await routesExplorerContext.deleteItem();
          notify(routesExplorerContext.item_id, 'success', t('operations.delete.success'));
        } catch (error) {
          console.log(error);
          notify(routesExplorerContext.item_id, 'error', err.message || t('operations.delete.error'));
        }
      },
    });
  };

  //
  // C. Render components

  return (
    <ListHeader>
      <AutoSave
        isValid={routesExplorerContext.form.isValid()}
        isDirty={routesExplorerContext.form.isDirty()}
        onValidate={routesExplorerContext.validateItem}
        isErrorValidating={routesExplorerContext.page.is_error}
        isErrorSaving={routesExplorerContext.page.is_error_saving}
        isSaving={routesExplorerContext.page.is_saving}
        onSave={routesExplorerContext.saveItem}
        onClose={routesExplorerContext.closeItem}
        closeType="back"
      />
      {linesExplorerContext.item_data?.name ? (
        <LinesExplorerLine lineId={linesExplorerContext.item_id} withLink={false} />
      ) : (
        <Text size="h1" style={!routesExplorerContext.form.values.name && 'untitled'} full>
          {t('untitled')}
        </Text>
      )}
      <AppAuthenticationCheck permissions={[{ scope: 'lines', action: 'lock' }]}>
        <AppButtonLock isLocked={routesExplorerContext.item_data?.is_locked} onClick={routesExplorerContext.lockItem} disabled={linesExplorerContext.page.is_read_only} />
      </AppAuthenticationCheck>
      <AppAuthenticationCheck permissions={[{ scope: 'lines', action: 'edit' }]}>
        <AppButtonDelete onClick={handleDelete} disabled={routesExplorerContext.page.is_read_only} />
      </AppAuthenticationCheck>
    </ListHeader>
  );
}
