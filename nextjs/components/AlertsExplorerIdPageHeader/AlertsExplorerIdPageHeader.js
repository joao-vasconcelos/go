'use client';

/* * */

import AppAuthenticationCheck from '@/components/AppAuthenticationCheck/AppAuthenticationCheck';
import AppButtonDelete from '@/components/AppButtonDelete/AppButtonDelete';
import AppButtonLock from '@/components/AppButtonLock/AppButtonLock';
import AutoSave from '@/components/AutoSave/AutoSave';
import ListHeader from '@/components/ListHeader/ListHeader';
import Text from '@/components/Text/Text';
import { useAlertsExplorerContext } from '@/contexts/AlertsExplorerContext';
import notify from '@/services/notify';
import { openConfirmModal } from '@mantine/modals';
import { useTranslations } from 'next-intl';

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
			centered: true,
			children: <Text size="h3">{t('operations.delete.description')}</Text>,
			closeOnClickOutside: true,
			confirmProps: { color: 'red' },
			labels: { cancel: t('operations.delete.cancel'), confirm: t('operations.delete.confirm') },
			onConfirm: async () => {
				try {
					notify(alertsExplorerContext.item_id, 'loading', t('operations.delete.loading'));
					await alertsExplorerContext.deleteItem();
					notify(alertsExplorerContext.item_id, 'success', t('operations.delete.success'));
				}
				catch (error) {
					console.log(error);
					notify(alertsExplorerContext.item_id, 'error', error.message || t('operations.delete.error'));
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
				isDirty={alertsExplorerContext.form.isDirty()}
				isErrorSaving={alertsExplorerContext.page.is_error_saving}
				isErrorValidating={alertsExplorerContext.page.is_error}
				isSaving={alertsExplorerContext.page.is_saving}
				isValid={alertsExplorerContext.form.isValid()}
				onClose={alertsExplorerContext.closeItem}
				onSave={alertsExplorerContext.saveItem}
				onValidate={alertsExplorerContext.validateItem}
			/>
			{alertsExplorerContext.form.values.code
				? <p>{alertsExplorerContext.form.values.code}</p>
				: (
					<Text size="h1" style="untitled" full>
						{t('untitled')}
					</Text>
				)}
			<div className={styles.spacer} />
			<AppAuthenticationCheck permissions={[{ action: 'lock', scope: 'alerts' }]}>
				<AppButtonLock isLocked={alertsExplorerContext.item_data?.is_locked} onClick={alertsExplorerContext.lockItem} />
			</AppAuthenticationCheck>
			<AppAuthenticationCheck permissions={[{ action: 'delete', scope: 'alerts' }]}>
				<AppButtonDelete disabled={alertsExplorerContext.page.is_read_only} onClick={handleDelete} />
			</AppAuthenticationCheck>
		</ListHeader>
	);
}
