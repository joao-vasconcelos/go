'use client';

/* * */

import isAllowed from '@/authentication/isAllowed';
import ExportsExplorerFormGtfsReferenceV29 from '@/components/ExportsExplorerFormGtfsReferenceV29/ExportsExplorerFormGtfsReferenceV29';
import ExportsExplorerFormGtfsRegionalMergeV1 from '@/components/ExportsExplorerFormGtfsRegionalMergeV1/ExportsExplorerFormGtfsRegionalMergeV1';
import ExportsExplorerFormHeader from '@/components/ExportsExplorerFormHeader/ExportsExplorerFormHeader';
import ExportsExplorerFormIntro from '@/components/ExportsExplorerFormIntro/ExportsExplorerFormIntro';
import ExportsExplorerFormSlaDefaultV1 from '@/components/ExportsExplorerFormSlaDefaultV1/ExportsExplorerFormSlaDefaultV1';
import { Section } from '@/components/Layouts/Layouts';
import NoDataLabel from '@/components/NoDataLabel/NoDataLabel';
import Pannel from '@/components/Pannel/Pannel';
import { useExportsExplorerContext } from '@/contexts/ExportsExplorerContext';
import { ExportOptions } from '@/schemas/Export/options';
import { Button, Divider, Select, Switch } from '@mantine/core';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';

/* * */

export default function ExportsExplorerForm() {
	//

	//
	// A. Setup variables

	const t = useTranslations('ExportsExplorerForm');
	const exportOptionsTranslations = useTranslations('ExportOptions');

	const exportsExplorerContext = useExportsExplorerContext();

	const { data: sessionData } = useSession();

	//
	// B. Format data

	const availableExportKinds = useMemo(() => {
		if (!ExportOptions.kind) return [];
		return ExportOptions.kind.filter(item => isAllowed(sessionData, [{ action: 'create', fields: [{ key: 'kind', values: [item] }], scope: 'exports' }], { handleError: true })).map(item => ({ label: exportOptionsTranslations(`kind.${item}.label`), value: item }));
	}, [exportOptionsTranslations, sessionData]);

	//
	// E. Render components

	return (
		<Pannel header={<ExportsExplorerFormHeader />}>
			<Section>
				<ExportsExplorerFormIntro />
			</Section>
			<Divider />
			<Section>
				<Select data={availableExportKinds} description={t('form.kind.description')} label={t('form.kind.label')} nothingFoundMessage={t('form.kind.nothingFound')} placeholder={t('form.kind.placeholder')} {...exportsExplorerContext.form_main.getInputProps('kind')} clearable searchable />
			</Section>

			<Divider />

			{!exportsExplorerContext.form_main.values.kind && <NoDataLabel text={t('no_data')} fill />}
			{exportsExplorerContext.form_main.values.kind === 'gtfs_v29' && <ExportsExplorerFormGtfsReferenceV29 />}
			{/* {exportsExplorerContext.form_main.values.kind === 'netex_v1' && <ExportsExplorerFormNetexV1 />} */}
			{exportsExplorerContext.form_main.values.kind === 'regional_merge_v1' && <ExportsExplorerFormGtfsRegionalMergeV1 />}
			{exportsExplorerContext.form_main.values.kind === 'sla_default_v1' && <ExportsExplorerFormSlaDefaultV1 />}

			<Divider />
			<Section>
				<Switch description={t('form.notify_user.description')} label={t('form.notify_user.label')} {...exportsExplorerContext.form_main.getInputProps('notify_user', { type: 'checkbox' })} />
			</Section>
			<Divider />
			<Section>
				<Button disabled={!exportsExplorerContext.form.is_valid} loading={exportsExplorerContext.form.is_loading} onClick={exportsExplorerContext.startExport}>
					{t('operations.start.label')}
				</Button>
			</Section>
		</Pannel>
	);
}
