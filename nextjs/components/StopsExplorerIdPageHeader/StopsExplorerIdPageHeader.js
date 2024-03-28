'use client';

/* * */

import useSWR from 'swr';
import API from '@/services/API';
import Text from '@/components/Text/Text';
import AutoSave from '@/components/AutoSave/AutoSave';
import notify from '@/services/notify';
import { openConfirmModal } from '@mantine/modals';
import { useTranslations } from 'next-intl';
import AppAuthenticationCheck from '@/components/AppAuthenticationCheck/AppAuthenticationCheck';
import LockButton from '@/components/LockButton/LockButton';
import DeleteButton from '@/components/DeleteButton/DeleteButton';
import ListHeader from '@/components/ListHeader/ListHeader';
import { useStopsExplorerContext } from '@/contexts/StopsExplorerContext';
import StopExplorerIdPageHeaderAssociatedPatterns from '@/components/StopExplorerIdPageHeaderAssociatedPatterns/StopExplorerIdPageHeaderAssociatedPatterns';
import StopExplorerIdPageHeaderViewInWebsite from '@/components/StopExplorerIdPageHeaderViewInWebsite/StopExplorerIdPageHeaderViewInWebsite';

/* * */

export default function StopsExplorerIdPageHeader() {
  //

  //
  // A. Setup variables

  const t = useTranslations('StopsExplorerIdPageHeader');
  const stopsExplorerContext = useStopsExplorerContext();

  //
  // B. Fetch data

  const { mutate: allStopsMutate } = useSWR('/api/stops');
  const { mutate: stopMutate } = useSWR(stopsExplorerContext.item_id && `/api/stops/${stopsExplorerContext.item_id}`);

  //
  // C. Handle actions

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
          if (!stopsExplorerContext.page.is_deletable) throw new Error(t('operations.delete.error'));
          notify(stopsExplorerContext.item_id, 'loading', t('operations.delete.loading'));
          await API({ service: 'stops', resourceId: stopsExplorerContext.item_id, operation: 'delete', method: 'DELETE' });
          stopMutate();
          allStopsMutate();
          stopsExplorerContext.closeItem();
          notify(stopsExplorerContext.item_id, 'success', t('operations.delete.success'));
        } catch (err) {
          console.log(err);
          stopMutate();
          allStopsMutate();
          notify(stopsExplorerContext.item_id, 'error', err.message || t('operations.delete.error'));
        }
      },
    });
  };

  //
  // C. Render components

  return (
    <ListHeader>
      <AutoSave
        isValid={stopsExplorerContext.form.isValid()}
        isDirty={stopsExplorerContext.form.isDirty()}
        onValidate={stopsExplorerContext.validateItem}
        isErrorValidating={stopsExplorerContext.page.is_error}
        isErrorSaving={stopsExplorerContext.page.is_error_saving}
        isSaving={stopsExplorerContext.page.is_saving}
        onSave={stopsExplorerContext.saveItem}
        onClose={stopsExplorerContext.closeItem}
      />
      <Text size="h1" style={!stopsExplorerContext.form.values.name && 'untitled'} full>
        {stopsExplorerContext.form.values.name || t('untitled')}
      </Text>
      <AppAuthenticationCheck permissions={[{ scope: 'lines', action: 'view' }]}>
        <StopExplorerIdPageHeaderAssociatedPatterns />
      </AppAuthenticationCheck>
      <StopExplorerIdPageHeaderViewInWebsite />
      <AppAuthenticationCheck permissions={[{ scope: 'stops', action: 'lock' }]}>
        <LockButton isLocked={stopsExplorerContext.item_data?.is_locked} onClick={stopsExplorerContext.lockItem} />
      </AppAuthenticationCheck>
      <AppAuthenticationCheck permissions={[{ scope: 'stops', action: 'delete' }]}>
        <DeleteButton onClick={handleDelete} disabled={stopsExplorerContext.page.is_read_only || !stopsExplorerContext.page.is_deletable} />
      </AppAuthenticationCheck>
    </ListHeader>
  );
}
