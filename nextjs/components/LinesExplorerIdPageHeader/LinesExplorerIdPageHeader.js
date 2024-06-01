'use client';

/* * */

import AppAuthenticationCheck from '@/components/AppAuthenticationCheck/AppAuthenticationCheck';
import AppButtonDelete from '@/components/AppButtonDelete/AppButtonDelete';
import AppButtonLock from '@/components/AppButtonLock/AppButtonLock';
import AutoSave from '@/components/AutoSave/AutoSave';
import { LinesExplorerLine } from '@/components/LinesExplorerLine/LinesExplorerLine';
import ListHeader from '@/components/ListHeader/ListHeader';
import Text from '@/components/Text/Text';
import { useLinesExplorerContext } from '@/contexts/LinesExplorerContext';
import notify from '@/services/notify';
import { openConfirmModal } from '@mantine/modals';
import { useTranslations } from 'next-intl';

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
			centered: true,
			children: <Text size="h3">{t('operations.delete.description')}</Text>,
			closeOnClickOutside: true,
			confirmProps: { color: 'red' },
			labels: { cancel: t('operations.delete.cancel'), confirm: t('operations.delete.confirm') },
			onConfirm: async () => {
				try {
					notify(linesExplorerContext.item_id, 'loading', t('operations.delete.loading'));
					await linesExplorerContext.deleteItem();
					notify(linesExplorerContext.item_id, 'success', t('operations.delete.success'));
				}
				catch (error) {
					console.log(error);
					notify(linesExplorerContext.item_id, 'error', error.message || t('operations.delete.error'));
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
				isDirty={linesExplorerContext.form.isDirty()}
				isErrorSaving={linesExplorerContext.page.is_error_saving}
				isErrorValidating={linesExplorerContext.page.is_error}
				isSaving={linesExplorerContext.page.is_saving}
				isValid={linesExplorerContext.form.isValid()}
				onClose={linesExplorerContext.closeItem}
				onSave={linesExplorerContext.saveItem}
				onValidate={linesExplorerContext.validateItem}
			/>
			{linesExplorerContext.item_data?.name
				? <LinesExplorerLine lineId={linesExplorerContext.item_id} withLink={false} />
				: (
					<Text size="h1" style={!linesExplorerContext.form.values.name && 'untitled'} full>
						{t('untitled')}
					</Text>
				)}
			<AppAuthenticationCheck permissions={[{ action: 'lock', scope: 'lines' }]}>
				<AppButtonLock isLocked={linesExplorerContext.item_data?.is_locked} onClick={linesExplorerContext.lockItem} />
			</AppAuthenticationCheck>
			<AppAuthenticationCheck permissions={[{ action: 'delete', scope: 'lines' }]}>
				<AppButtonDelete disabled={linesExplorerContext.page.is_read_only} onClick={handleDelete} />
			</AppAuthenticationCheck>
		</ListHeader>
	);
}
