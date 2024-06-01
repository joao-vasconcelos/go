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
import { usePatternsExplorerContext } from '@/contexts/PatternsExplorerContext';
import notify from '@/services/notify';
import { openConfirmModal } from '@mantine/modals';
import { useTranslations } from 'next-intl';

/* * */

export default function PatternsExplorerIdPageHeader() {
	//

	//
	// A. Setup variables

	const t = useTranslations('PatternsExplorerIdPageHeader');
	const linesExplorerContext = useLinesExplorerContext();
	const patternsExplorerContext = usePatternsExplorerContext();

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
					notify(patternsExplorerContext.item_id, 'loading', t('operations.delete.loading'));
					await patternsExplorerContext.deleteItem();
					notify(patternsExplorerContext.item_id, 'success', t('operations.delete.success'));
				}
				catch (error) {
					console.log(error);
					notify(patternsExplorerContext.item_id, 'error', error.message || t('operations.delete.error'));
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
				closeType="back"
				isDirty={patternsExplorerContext.form.isDirty()}
				isErrorSaving={patternsExplorerContext.page.is_error_saving}
				isErrorValidating={patternsExplorerContext.page.is_error}
				isSaving={patternsExplorerContext.page.is_saving}
				isValid={patternsExplorerContext.form.isValid()}
				onClose={patternsExplorerContext.closeItem}
				onSave={patternsExplorerContext.saveItem}
				onValidate={patternsExplorerContext.validateItem}
			/>
			{linesExplorerContext.item_data?.name
				? <LinesExplorerLine lineId={linesExplorerContext.item_id} withLink={false} />
				: (
					<Text size="h1" style="untitled" full>
						{t('untitled')}
					</Text>
				)}
			<AppAuthenticationCheck permissions={[{ action: 'lock', scope: 'lines' }]}>
				<AppButtonLock isLocked={patternsExplorerContext.item_data?.is_locked} onClick={patternsExplorerContext.lockItem} />
			</AppAuthenticationCheck>
			<AppAuthenticationCheck permissions={[{ action: 'delete', scope: 'lines' }]}>
				<AppButtonDelete disabled={patternsExplorerContext.page.is_read_only} onClick={handleDelete} />
			</AppAuthenticationCheck>
		</ListHeader>
	);
}
