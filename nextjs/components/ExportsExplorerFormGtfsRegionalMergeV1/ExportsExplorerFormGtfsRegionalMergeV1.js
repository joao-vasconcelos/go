'use client';

/* * */

import { useTranslations } from 'next-intl';
import { Section } from '@/components/Layouts/Layouts';
import { DatePickerInput } from '@mantine/dates';
import { useExportsExplorerContext } from '@/contexts/ExportsExplorerContext';

/* * */

export default function ExportsExplorerFormGtfsRegionalMergeV1() {
	//

	//
	// A. Setup variables

	const t = useTranslations('ExportsExplorerFormGtfsRegionalMergeV1');
	const exportsExplorerContext = useExportsExplorerContext();

	//
	// E. Render components

	return (
		<>
			<Section>
				<DatePickerInput
					label={t('form.active_date.label')}
					description={t('form.active_date.description')}
					placeholder={t('form.active_date.placeholder')}
					{...exportsExplorerContext.form_regional_merge_v1.getInputProps('active_date')}
					dropdownType="modal"
					clearable
				/>
			</Section>
		</>
	);
}