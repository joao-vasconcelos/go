'use client';

/* * */

import AppAuthenticationCheck from '@/components/AppAuthenticationCheck/AppAuthenticationCheck';
import AppButtonDelete from '@/components/AppButtonDelete/AppButtonDelete';
import AppButtonLock from '@/components/AppButtonLock/AppButtonLock';
import AutoSave from '@/components/AutoSave/AutoSave';
import ListHeader from '@/components/ListHeader/ListHeader';
import Text from '@/components/Text/Text';
import { useFaresExplorerContext } from '@/contexts/FaresExplorerContext';
import notify from '@/services/notify';
import { openConfirmModal } from '@mantine/modals';
import { useTranslations } from 'next-intl';

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
			centered: true,
			children: <Text size="h3">{t('operations.delete.description')}</Text>,
			closeOnClickOutside: true,
			confirmProps: { color: 'red' },
			labels: { cancel: t('operations.delete.cancel'), confirm: t('operations.delete.confirm') },
			onConfirm: async () => {
				try {
					notify(faresExplorerContext.item_id, 'loading', t('operations.delete.loading'));
					await faresExplorerContext.deleteItem();
					notify(faresExplorerContext.item_id, 'success', t('operations.delete.success'));
				}
				catch (error) {
					console.log(error);
					notify(faresExplorerContext.item_id, 'error', error.message || t('operations.delete.error'));
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
				isDirty={faresExplorerContext.form.isDirty()}
				isErrorSaving={faresExplorerContext.page.is_error_saving}
				isErrorValidating={faresExplorerContext.page.is_error}
				isSaving={faresExplorerContext.page.is_saving}
				isValid={faresExplorerContext.form.isValid()}
				onClose={faresExplorerContext.closeItem}
				onSave={faresExplorerContext.saveItem}
				onValidate={faresExplorerContext.validateItem}
			/>
			<Text size="h1" style={!faresExplorerContext.form.values.name && 'untitled'} full>
				{faresExplorerContext.form.values.name || t('untitled')}
			</Text>
			<div className={styles.spacer} />
			<AppAuthenticationCheck permissions={[{ action: 'lock', scope: 'fares' }]}>
				<AppButtonLock isLocked={faresExplorerContext.item_data?.is_locked} onClick={faresExplorerContext.lockItem} />
			</AppAuthenticationCheck>
			<AppAuthenticationCheck permissions={[{ action: 'delete', scope: 'fares' }]}>
				<AppButtonDelete disabled={faresExplorerContext.page.is_read_only} onClick={handleDelete} />
			</AppAuthenticationCheck>
		</ListHeader>
	);
}
