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
import { useRoutesExplorerContext } from '@/contexts/RoutesExplorerContext';
import notify from '@/services/notify';
import { openConfirmModal } from '@mantine/modals';
import { useTranslations } from 'next-intl';

/* * */

export default function RoutesExplorerIdPageHeader() {
	//

	//
	// A. Setup variables

	const t = useTranslations('RoutesExplorerIdPageHeader');
	const linesExplorerContext = useLinesExplorerContext();
	const routesExplorerContext = useRoutesExplorerContext();

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
					notify(routesExplorerContext.item_id, 'loading', t('operations.delete.loading'));
					await routesExplorerContext.deleteItem();
					notify(routesExplorerContext.item_id, 'success', t('operations.delete.success'));
				}
				catch (error) {
					console.log(error);
					notify(routesExplorerContext.item_id, 'error', error.message || t('operations.delete.error'));
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
				isDirty={routesExplorerContext.form.isDirty()}
				isErrorSaving={routesExplorerContext.page.is_error_saving}
				isErrorValidating={routesExplorerContext.page.is_error}
				isSaving={routesExplorerContext.page.is_saving}
				isValid={routesExplorerContext.form.isValid()}
				onClose={routesExplorerContext.closeItem}
				onSave={routesExplorerContext.saveItem}
				onValidate={routesExplorerContext.validateItem}
			/>
			{linesExplorerContext.item_data?.name
				? <LinesExplorerLine lineId={linesExplorerContext.item_id} withLink={false} />
				: (
					<Text size="h1" style={!routesExplorerContext.form.values.name && 'untitled'} full>
						{t('untitled')}
					</Text>
				)}
			<AppAuthenticationCheck permissions={[{ action: 'lock', scope: 'lines' }]}>
				<AppButtonLock disabled={linesExplorerContext.page.is_read_only} isLocked={routesExplorerContext.item_data?.is_locked} onClick={routesExplorerContext.lockItem} />
			</AppAuthenticationCheck>
			<AppAuthenticationCheck permissions={[{ action: 'edit', scope: 'lines' }]}>
				<AppButtonDelete disabled={routesExplorerContext.page.is_read_only} onClick={handleDelete} />
			</AppAuthenticationCheck>
		</ListHeader>
	);
}
