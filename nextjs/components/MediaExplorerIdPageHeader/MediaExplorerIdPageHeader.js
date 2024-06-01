'use client';

/* * */

import AppAuthenticationCheck from '@/components/AppAuthenticationCheck/AppAuthenticationCheck';
import AppButtonDelete from '@/components/AppButtonDelete/AppButtonDelete';
import AppButtonLock from '@/components/AppButtonLock/AppButtonLock';
import AutoSave from '@/components/AutoSave/AutoSave';
import ListHeader from '@/components/ListHeader/ListHeader';
import MediaExplorerMedia from '@/components/MediaExplorerMedia/MediaExplorerMedia';
import Text from '@/components/Text/Text';
import { useMediaExplorerContext } from '@/contexts/MediaExplorerContext';
import notify from '@/services/notify';
import { openConfirmModal } from '@mantine/modals';
import { useTranslations } from 'next-intl';

import styles from './MediaExplorerIdPageHeader.module.css';

/* * */

export default function MediaExplorerIdPageHeader() {
	//

	//
	// A. Setup variables

	const t = useTranslations('MediaExplorerIdPageHeader');
	const mediaExplorerContext = useMediaExplorerContext();

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
					notify(mediaExplorerContext.item_id, 'loading', t('operations.delete.loading'));
					await mediaExplorerContext.deleteItem();
					notify(mediaExplorerContext.item_id, 'success', t('operations.delete.success'));
				}
				catch (error) {
					console.log(error);
					notify(mediaExplorerContext.item_id, 'error', error.message || t('operations.delete.error'));
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
				isDirty={mediaExplorerContext.form.isDirty()}
				isErrorSaving={mediaExplorerContext.page.is_error_saving}
				isErrorValidating={mediaExplorerContext.page.is_error}
				isSaving={mediaExplorerContext.page.is_saving}
				isValid={mediaExplorerContext.form.isValid()}
				onClose={mediaExplorerContext.closeItem}
				onSave={mediaExplorerContext.saveItem}
				onValidate={mediaExplorerContext.validateItem}
			/>
			{mediaExplorerContext.form.values.label
				? <MediaExplorerMedia tagId={mediaExplorerContext.item_id} />
				: (
					<Text size="h1" style="untitled" full>
						{t('untitled')}
					</Text>
				)}
			<div className={styles.spacer} />
			<AppAuthenticationCheck permissions={[{ action: 'lock', scope: 'media' }]}>
				<AppButtonLock isLocked={mediaExplorerContext.item_data?.is_locked} onClick={mediaExplorerContext.lockItem} />
			</AppAuthenticationCheck>
			<AppAuthenticationCheck permissions={[{ action: 'delete', scope: 'media' }]}>
				<AppButtonDelete disabled={mediaExplorerContext.page.is_read_only} onClick={handleDelete} />
			</AppAuthenticationCheck>
		</ListHeader>
	);
}
