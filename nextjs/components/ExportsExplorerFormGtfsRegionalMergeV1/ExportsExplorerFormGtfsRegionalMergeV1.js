'use client';

/* * */

import { Section } from '@/components/Layouts/Layouts';
import { useExportsExplorerContext } from '@/contexts/ExportsExplorerContext';
import { DatePickerInput } from '@mantine/dates';
import { useTranslations } from 'next-intl';

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
					description={t('form.active_date.description')}
					label={t('form.active_date.label')}
					placeholder={t('form.active_date.placeholder')}
					{...exportsExplorerContext.form_regional_merge_v1.getInputProps('active_date')}
					dropdownType="modal"
					clearable
				/>
			</Section>
		</>
	);
}
