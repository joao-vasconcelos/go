'use client';

/* * */

import AppAuthenticationCheck from '@/components/AppAuthenticationCheck/AppAuthenticationCheck';
import AppButtonDelete from '@/components/AppButtonDelete/AppButtonDelete';
import AppButtonLock from '@/components/AppButtonLock/AppButtonLock';
import AutoSave from '@/components/AutoSave/AutoSave';
import ListHeader from '@/components/ListHeader/ListHeader';
import TagsExplorerTag from '@/components/TagsExplorerTag/TagsExplorerTag';
import Text from '@/components/Text/Text';
import { useTagsExplorerContext } from '@/contexts/TagsExplorerContext';
import notify from '@/services/notify';
import { openConfirmModal } from '@mantine/modals';
import { useTranslations } from 'next-intl';

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
			centered: true,
			children: <Text size="h3">{t('operations.delete.description')}</Text>,
			closeOnClickOutside: true,
			confirmProps: { color: 'red' },
			labels: { cancel: t('operations.delete.cancel'), confirm: t('operations.delete.confirm') },
			onConfirm: async () => {
				try {
					notify(tagsExplorerContext.item_id, 'loading', t('operations.delete.loading'));
					await tagsExplorerContext.deleteItem();
					notify(tagsExplorerContext.item_id, 'success', t('operations.delete.success'));
				}
				catch (error) {
					console.log(error);
					notify(tagsExplorerContext.item_id, 'error', error.message || t('operations.delete.error'));
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
				isDirty={tagsExplorerContext.form.isDirty()}
				isErrorSaving={tagsExplorerContext.page.is_error_saving}
				isErrorValidating={tagsExplorerContext.page.is_error}
				isSaving={tagsExplorerContext.page.is_saving}
				isValid={tagsExplorerContext.form.isValid()}
				onClose={tagsExplorerContext.closeItem}
				onSave={tagsExplorerContext.saveItem}
				onValidate={tagsExplorerContext.validateItem}
			/>
			{tagsExplorerContext.form.values.label
				? <TagsExplorerTag tagId={tagsExplorerContext.item_id} />
				: (
					<Text size="h1" style="untitled" full>
						{t('untitled')}
					</Text>
				)}
			<div className={styles.spacer} />
			<AppAuthenticationCheck permissions={[{ action: 'lock', scope: 'tags' }]}>
				<AppButtonLock isLocked={tagsExplorerContext.item_data?.is_locked} onClick={tagsExplorerContext.lockItem} />
			</AppAuthenticationCheck>
			<AppAuthenticationCheck permissions={[{ action: 'delete', scope: 'tags' }]}>
				<AppButtonDelete disabled={tagsExplorerContext.page.is_read_only} onClick={handleDelete} />
			</AppAuthenticationCheck>
		</ListHeader>
	);
}
