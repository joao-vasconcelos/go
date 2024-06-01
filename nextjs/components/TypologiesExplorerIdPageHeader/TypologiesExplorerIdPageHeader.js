'use client';

/* * */

import AppAuthenticationCheck from '@/components/AppAuthenticationCheck/AppAuthenticationCheck';
import AppButtonDelete from '@/components/AppButtonDelete/AppButtonDelete';
import AppButtonLock from '@/components/AppButtonLock/AppButtonLock';
import AutoSave from '@/components/AutoSave/AutoSave';
import ListHeader from '@/components/ListHeader/ListHeader';
import Text from '@/components/Text/Text';
import { useTypologiesExplorerContext } from '@/contexts/TypologiesExplorerContext';
import notify from '@/services/notify';
import { openConfirmModal } from '@mantine/modals';
import { useTranslations } from 'next-intl';

import styles from './TypologiesExplorerIdPageHeader.module.css';

/* * */

export default function TypologiesExplorerIdPageHeader() {
	//

	//
	// A. Setup variables

	const t = useTranslations('TypologiesExplorerIdPageHeader');
	const typologiesExplorerContext = useTypologiesExplorerContext();

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
					notify(typologiesExplorerContext.item_id, 'loading', t('operations.delete.loading'));
					await typologiesExplorerContext.deleteItem();
					notify(typologiesExplorerContext.item_id, 'success', t('operations.delete.success'));
				}
				catch (error) {
					console.log(error);
					notify(typologiesExplorerContext.item_id, 'error', error.message || t('operations.delete.error'));
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
				isDirty={typologiesExplorerContext.form.isDirty()}
				isErrorSaving={typologiesExplorerContext.page.is_error_saving}
				isErrorValidating={typologiesExplorerContext.page.is_error}
				isSaving={typologiesExplorerContext.page.is_saving}
				isValid={typologiesExplorerContext.form.isValid()}
				onClose={typologiesExplorerContext.closeItem}
				onSave={typologiesExplorerContext.saveItem}
				onValidate={typologiesExplorerContext.validateItem}
			/>
			<Text size="h1" style={!typologiesExplorerContext.form.values.name && 'untitled'} full>
				{typologiesExplorerContext.form.values.name || t('untitled')}
			</Text>
			<div className={styles.spacer} />
			<AppAuthenticationCheck permissions={[{ action: 'lock', scope: 'typologies' }]}>
				<AppButtonLock isLocked={typologiesExplorerContext.item_data?.is_locked} onClick={typologiesExplorerContext.lockItem} />
			</AppAuthenticationCheck>
			<AppAuthenticationCheck permissions={[{ action: 'delete', scope: 'typologies' }]}>
				<AppButtonDelete disabled={typologiesExplorerContext.page.is_read_only} onClick={handleDelete} />
			</AppAuthenticationCheck>
		</ListHeader>
	);
}
