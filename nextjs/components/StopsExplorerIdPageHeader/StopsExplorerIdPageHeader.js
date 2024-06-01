'use client';

/* * */

import AppAuthenticationCheck from '@/components/AppAuthenticationCheck/AppAuthenticationCheck';
import AppButtonDelete from '@/components/AppButtonDelete/AppButtonDelete';
import AppButtonLock from '@/components/AppButtonLock/AppButtonLock';
import AutoSave from '@/components/AutoSave/AutoSave';
import ListHeader from '@/components/ListHeader/ListHeader';
import StopExplorerIdPageHeaderAssociatedPatterns from '@/components/StopExplorerIdPageHeaderAssociatedPatterns/StopExplorerIdPageHeaderAssociatedPatterns';
import StopExplorerIdPageHeaderViewInWebsite from '@/components/StopExplorerIdPageHeaderViewInWebsite/StopExplorerIdPageHeaderViewInWebsite';
import Text from '@/components/Text/Text';
import { useStopsExplorerContext } from '@/contexts/StopsExplorerContext';
import API from '@/services/API';
import notify from '@/services/notify';
import { openConfirmModal } from '@mantine/modals';
import { useTranslations } from 'next-intl';
import useSWR from 'swr';

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
			centered: true,
			children: <Text size="h3">{t('operations.delete.description')}</Text>,
			closeOnClickOutside: true,
			confirmProps: { color: 'red' },
			labels: { cancel: t('operations.delete.cancel'), confirm: t('operations.delete.confirm') },
			onConfirm: async () => {
				try {
					if (!stopsExplorerContext.page.is_deletable) throw new Error(t('operations.delete.error'));
					notify(stopsExplorerContext.item_id, 'loading', t('operations.delete.loading'));
					await API({ method: 'DELETE', operation: 'delete', resourceId: stopsExplorerContext.item_id, service: 'stops' });
					stopMutate();
					allStopsMutate();
					stopsExplorerContext.closeItem();
					notify(stopsExplorerContext.item_id, 'success', t('operations.delete.success'));
				}
				catch (error) {
					console.log(error);
					stopMutate();
					allStopsMutate();
					notify(stopsExplorerContext.item_id, 'error', error.message || t('operations.delete.error'));
				}
			},
			title: <Text size="h2">{t('operations.delete.title')}</Text>,
		});
	};

	//
	// C. Render components

	return (
		<ListHeader>
			<AutoSave
				isDirty={stopsExplorerContext.form.isDirty()}
				isErrorSaving={stopsExplorerContext.page.is_error_saving}
				isErrorValidating={stopsExplorerContext.page.is_error}
				isSaving={stopsExplorerContext.page.is_saving}
				isValid={stopsExplorerContext.form.isValid()}
				onClose={stopsExplorerContext.closeItem}
				onSave={stopsExplorerContext.saveItem}
				onValidate={stopsExplorerContext.validateItem}
			/>
			<Text size="h1" style={!stopsExplorerContext.form.values.name && 'untitled'} full>
				{stopsExplorerContext.form.values.name || t('untitled')}
			</Text>
			<AppAuthenticationCheck permissions={[{ action: 'view', scope: 'lines' }]}>
				<StopExplorerIdPageHeaderAssociatedPatterns />
			</AppAuthenticationCheck>
			<StopExplorerIdPageHeaderViewInWebsite />
			<AppAuthenticationCheck permissions={[{ action: 'lock', scope: 'stops' }]}>
				<AppButtonLock isLocked={stopsExplorerContext.item_data?.is_locked} onClick={stopsExplorerContext.lockItem} />
			</AppAuthenticationCheck>
			<AppAuthenticationCheck permissions={[{ action: 'delete', scope: 'stops' }]}>
				<AppButtonDelete disabled={stopsExplorerContext.page.is_read_only || !stopsExplorerContext.page.is_deletable} onClick={handleDelete} />
			</AppAuthenticationCheck>
		</ListHeader>
	);
}
