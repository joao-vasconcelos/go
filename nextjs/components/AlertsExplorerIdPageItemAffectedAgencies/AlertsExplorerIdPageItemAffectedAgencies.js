'use client';

/* * */

import NoDataLabel from '@/components/NoDataLabel/NoDataLabel';
import Standout from '@/components/Standout/Standout';
import { useAlertsExplorerContext } from '@/contexts/AlertsExplorerContext';
import { AlertAffectedAgencyDefault } from '@/schemas/Alert/default';
import { ActionIcon, Button, Select, Tooltip } from '@mantine/core';
import { IconTrash } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';

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
		return [{ label: 'Carris Metropolitana', value: 'CM' }];
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
			{alertsExplorerContext.form.values.affected_agencies.length > 0
				? alertsExplorerContext.form.values.affected_agencies.map((affectedAgency, index) => (
					<Standout
						key={index}
						title={t('title')}
						icon={(
							<Tooltip label={t('operations.remove.label')} withArrow>
								<ActionIcon color="gray" disabled={alertsExplorerContext.page.is_read_only} onClick={() => handleRemoveAffectedAgency(index)} size="sm" variant="subtle">
									<IconTrash size={18} />
								</ActionIcon>
							</Tooltip>
						)}
					>
						<Select
							nothingFoundMessage={t('form.affected_agencies.nothingFound')}
							placeholder={t('form.affected_agencies.placeholder')}
							{...alertsExplorerContext.form.getInputProps(`affected_agencies.${index}.agency_id`)}
							data={availableLiveAgencys}
							limit={100}
							readOnly={alertsExplorerContext.page.is_read_only}
							w="100%"
							clearable
							searchable
						/>
					</Standout>
				))
				: (
					<Standout>
						<NoDataLabel text={t('no_data')} />
					</Standout>
				)}
			<Button disabled={alertsExplorerContext.page.is_read_only} onClick={handleInsertAffectedAgency} variant="light">
				{t('operations.insert.label')}
			</Button>
		</div>
	);

	//
}
