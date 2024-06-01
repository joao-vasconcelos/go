'use client';

/* * */

import AppAuthenticationCheck from '@/components/AppAuthenticationCheck/AppAuthenticationCheck';
import AppButtonDelete from '@/components/AppButtonDelete/AppButtonDelete';
import AppButtonLock from '@/components/AppButtonLock/AppButtonLock';
import AutoSave from '@/components/AutoSave/AutoSave';
import ListHeader from '@/components/ListHeader/ListHeader';
import Text from '@/components/Text/Text';
import UsersExplorerUser from '@/components/UsersExplorerUser/UsersExplorerUser';
import { useUsersExplorerContext } from '@/contexts/UsersExplorerContext';
import notify from '@/services/notify';
import { openConfirmModal } from '@mantine/modals';
import { useTranslations } from 'next-intl';

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
			centered: true,
			children: <Text size="h3">{t('operations.delete.description')}</Text>,
			closeOnClickOutside: true,
			confirmProps: { color: 'red' },
			labels: { cancel: t('operations.delete.cancel'), confirm: t('operations.delete.confirm') },
			onConfirm: async () => {
				try {
					notify(usersExplorerContext.item_id, 'loading', t('operations.delete.loading'));
					await usersExplorerContext.deleteItem();
					notify(usersExplorerContext.item_id, 'success', t('operations.delete.success'));
				}
				catch (error) {
					console.log(error);
					notify(usersExplorerContext.item_id, 'error', error.message || t('operations.delete.error'));
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
				isDirty={usersExplorerContext.form.isDirty()}
				isErrorSaving={usersExplorerContext.page.is_error_saving}
				isErrorValidating={usersExplorerContext.page.is_error}
				isSaving={usersExplorerContext.page.is_saving}
				isValid={usersExplorerContext.form.isValid()}
				onClose={usersExplorerContext.closeItem}
				onSave={usersExplorerContext.saveItem}
				onValidate={usersExplorerContext.validateItem}
			/>
			{usersExplorerContext.form.values.name
				? <UsersExplorerUser type="full" userId={usersExplorerContext.item_id} />
				: (
					<Text size="h1" style="untitled" full>
						{t('untitled')}
					</Text>
				)}
			<div className={styles.spacer} />
			<AppAuthenticationCheck permissions={[{ action: 'lock', scope: 'users' }]}>
				<AppButtonLock isLocked={usersExplorerContext.item_data?.is_locked} onClick={usersExplorerContext.lockItem} />
			</AppAuthenticationCheck>
			<AppAuthenticationCheck permissions={[{ action: 'delete', scope: 'users' }]}>
				<AppButtonDelete disabled={usersExplorerContext.page.is_read_only} onClick={handleDelete} />
			</AppAuthenticationCheck>
		</ListHeader>
	);

	//
}
