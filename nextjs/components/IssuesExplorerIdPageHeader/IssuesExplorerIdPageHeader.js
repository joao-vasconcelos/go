'use client';

/* * */

import AppAuthenticationCheck from '@/components/AppAuthenticationCheck/AppAuthenticationCheck';
import AppButtonDelete from '@/components/AppButtonDelete/AppButtonDelete';
import AppButtonLock from '@/components/AppButtonLock/AppButtonLock';
import AutoSave from '@/components/AutoSave/AutoSave';
import GlobalAuthorTimestamp from '@/components/GlobalAuthorTimestamp/GlobalAuthorTimestamp';
import IssuesExplorerAttributePrioritySelect from '@/components/IssuesExplorerAttributePrioritySelect/IssuesExplorerAttributePrioritySelect';
import IssuesExplorerAttributeStatusSelect from '@/components/IssuesExplorerAttributeStatusSelect/IssuesExplorerAttributeStatusSelect';
import ListHeader from '@/components/ListHeader/ListHeader';
import Text from '@/components/Text/Text';
import { useIssuesExplorerContext } from '@/contexts/IssuesExplorerContext';
import notify from '@/services/notify';
import { openConfirmModal } from '@mantine/modals';
import { useTranslations } from 'next-intl';

import styles from './IssuesExplorerIdPageHeader.module.css';

/* * */

export default function IssuesExplorerIdPageHeader() {
	//

	//
	// A. Setup variables

	const t = useTranslations('IssuesExplorerIdPageHeader');
	const issuesExplorerContext = useIssuesExplorerContext();

	//
	// B. Handle actions

	const handleChangeStatus = (newValue) => {
		issuesExplorerContext.form.setFieldValue('status', newValue);
	};

	const handleChangePriority = (newValue) => {
		issuesExplorerContext.form.setFieldValue('priority', newValue);
	};

	const handleDelete = async () => {
		openConfirmModal({
			centered: true,
			children: <Text size="h3">{t('operations.delete.description')}</Text>,
			closeOnClickOutside: true,
			confirmProps: { color: 'red' },
			labels: { cancel: t('operations.delete.cancel'), confirm: t('operations.delete.confirm') },
			onConfirm: async () => {
				try {
					notify(issuesExplorerContext.item_id, 'loading', t('operations.delete.loading'));
					await issuesExplorerContext.deleteItem();
					notify(issuesExplorerContext.item_id, 'success', t('operations.delete.success'));
				}
				catch (error) {
					console.log(error);
					notify(issuesExplorerContext.item_id, 'error', error.message || t('operations.delete.error'));
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
				isDirty={issuesExplorerContext.form.isDirty()}
				isErrorSaving={issuesExplorerContext.page.is_error_saving}
				isErrorValidating={issuesExplorerContext.page.is_error}
				isSaving={issuesExplorerContext.page.is_saving}
				isValid={issuesExplorerContext.form.isValid()}
				onClose={issuesExplorerContext.closeItem}
				onSave={issuesExplorerContext.saveItem}
				onValidate={issuesExplorerContext.validateItem}
			/>
			<div className={styles.wrapper}>
				<IssuesExplorerAttributeStatusSelect onChange={handleChangeStatus} value={issuesExplorerContext.form.values.status} />
				<IssuesExplorerAttributePrioritySelect onChange={handleChangePriority} value={issuesExplorerContext.form.values.priority} />
			</div>
			<GlobalAuthorTimestamp actionVerb="abriu" timestamp={issuesExplorerContext.form.values.created_at} userId={issuesExplorerContext.form.values.created_by} />
			<AppAuthenticationCheck permissions={[{ action: 'lock', scope: 'issues' }]}>
				<AppButtonLock isLocked={issuesExplorerContext.item_data?.is_locked} onClick={issuesExplorerContext.lockItem} />
			</AppAuthenticationCheck>
			<AppAuthenticationCheck permissions={[{ action: 'delete', scope: 'issues' }]}>
				<AppButtonDelete disabled={issuesExplorerContext.page.is_read_only} onClick={handleDelete} />
			</AppAuthenticationCheck>
		</ListHeader>
	);
}
