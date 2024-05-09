'use client';

/* * */

import Text from '@/components/Text/Text';
import AutoSave from '@/components/AutoSave/AutoSave';
import notify from '@/services/notify';
import { openConfirmModal } from '@mantine/modals';
import { useTranslations } from 'next-intl';
import AppAuthenticationCheck from '@/components/AppAuthenticationCheck/AppAuthenticationCheck';
import AppButtonLock from '@/components/AppButtonLock/AppButtonLock';
import AppButtonDelete from '@/components/AppButtonDelete/AppButtonDelete';
import ListHeader from '@/components/ListHeader/ListHeader';
import { LinesExplorerLine } from '@/components/LinesExplorerLine/LinesExplorerLine';
import { useLinesExplorerContext } from '@/contexts/LinesExplorerContext';
import { usePatternsExplorerContext } from '@/contexts/PatternsExplorerContext';

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
			title: <Text size="h2">{t('operations.delete.title')}</Text>,
			centered: true,
			closeOnClickOutside: true,
			children: <Text size="h3">{t('operations.delete.description')}</Text>,
			labels: { confirm: t('operations.delete.confirm'), cancel: t('operations.delete.cancel') },
			confirmProps: { color: 'red' },
			onConfirm: async () => {
				try {
					notify(patternsExplorerContext.item_id, 'loading', t('operations.delete.loading'));
					await patternsExplorerContext.deleteItem();
					notify(patternsExplorerContext.item_id, 'success', t('operations.delete.success'));
				} catch (error) {
					console.log(error);
					notify(patternsExplorerContext.item_id, 'error', error.message || t('operations.delete.error'));
				}
			},
		});
	};

	//
	// C. Render components

	return (
		<ListHeader>
			<AutoSave
				isValid={patternsExplorerContext.form.isValid()}
				isDirty={patternsExplorerContext.form.isDirty()}
				onValidate={patternsExplorerContext.validateItem}
				isErrorValidating={patternsExplorerContext.page.is_error}
				isErrorSaving={patternsExplorerContext.page.is_error_saving}
				isSaving={patternsExplorerContext.page.is_saving}
				onSave={patternsExplorerContext.saveItem}
				onClose={patternsExplorerContext.closeItem}
				closeType="back"
			/>
			{linesExplorerContext.item_data?.name ?
				<LinesExplorerLine lineId={linesExplorerContext.item_id} withLink={false} /> :
				<Text size="h1" style="untitled" full>
					{t('untitled')}
				</Text>
			}
			<AppAuthenticationCheck permissions={[{ scope: 'lines', action: 'lock' }]}>
				<AppButtonLock isLocked={patternsExplorerContext.item_data?.is_locked} onClick={patternsExplorerContext.lockItem} />
			</AppAuthenticationCheck>
			<AppAuthenticationCheck permissions={[{ scope: 'lines', action: 'delete' }]}>
				<AppButtonDelete onClick={handleDelete} disabled={patternsExplorerContext.page.is_read_only} />
			</AppAuthenticationCheck>
		</ListHeader>
	);
}