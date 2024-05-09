'use client';

/* * */

import { useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { ActionIcon, Button, Select, Tooltip } from '@mantine/core';
import { useAlertsExplorerContext } from '@/contexts/AlertsExplorerContext';
import { AlertAffectedAgencyDefault } from '@/schemas/Alert/default';
import { IconTrash } from '@tabler/icons-react';
import Standout from '@/components/Standout/Standout';
import NoDataLabel from '@/components/NoDataLabel/NoDataLabel';
import styles from './AlertsExplorerIdPageItemAffectedAgencies.module.css';

/* * */

export default function AlertsExplorerIdPageItemAffectedAgencies() {
	//

	//
	// A. Setup variables

	const t = useTranslations('AlertsExplorerIdPageItemAffectedAgencies');
	const alertsExplorerContext = useAlertsExplorerContext();

	//
	// B. Transform data

	const availableLiveAgencys = useMemo(() => {
		return [{ value: 'CM', label: 'Carris Metropolitana' }];
	}, []);

	//
	// C. Handle actions

	const handleInsertAffectedAgency = () => {
		alertsExplorerContext.form.insertListItem('affected_agencies', AlertAffectedAgencyDefault);
	};

	const handleRemoveAffectedAgency = (index) => {
		console.log(index);
		alertsExplorerContext.form.removeListItem('affected_agencies', index);
	};

	//
	// D. Render components

	return (
		<div className={styles.container}>
			{alertsExplorerContext.form.values.affected_agencies.length > 0 ?
				alertsExplorerContext.form.values.affected_agencies.map((affectedAgency, index) => <Standout
					key={index}
					title={t('title')}
					icon={
						<Tooltip label={t('operations.remove.label')} withArrow>
							<ActionIcon variant="subtle" color="gray" size="sm" onClick={() => handleRemoveAffectedAgency(index)} disabled={alertsExplorerContext.page.is_read_only}>
								<IconTrash size={18} />
							</ActionIcon>
						</Tooltip>
					}
				>
					<Select
						placeholder={t('form.affected_agencies.placeholder')}
						nothingFoundMessage={t('form.affected_agencies.nothingFound')}
						{...alertsExplorerContext.form.getInputProps(`affected_agencies.${index}.agency_id`)}
						limit={100}
						data={availableLiveAgencys}
						readOnly={alertsExplorerContext.page.is_read_only}
						searchable
						clearable
						w="100%"
					/>
				</Standout>) :
				<Standout>
					<NoDataLabel text={t('no_data')} />
				</Standout>
			}
			<Button variant="light" onClick={handleInsertAffectedAgency} disabled={alertsExplorerContext.page.is_read_only}>
				{t('operations.insert.label')}
			</Button>
		</div>
	);

	//
}