'use client';

/* * */

import Pannel from '@/components/Pannel/Pannel';
import { useTranslations } from 'next-intl';
import { ExportOptions } from '@/schemas/Export/options';
import { useSession } from 'next-auth/react';
import isAllowed from '@/authentication/isAllowed';
import { Select, Button, Divider, Switch } from '@mantine/core';
import { Section } from '@/components/Layouts/Layouts';
import { useMemo } from 'react';

import { useExportsExplorerContext } from '@/contexts/ExportsExplorerContext';
import ExportsExplorerFormHeader from '@/components/ExportsExplorerFormHeader/ExportsExplorerFormHeader';
import ExportsExplorerFormIntro from '@/components/ExportsExplorerFormIntro/ExportsExplorerFormIntro';
import NoDataLabel from '@/components/NoDataLabel/NoDataLabel';
import ExportsExplorerFormGtfsV29 from '@/components/ExportsExplorerFormGtfsV29/ExportsExplorerFormGtfsV29';

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
    return ExportOptions.kind.filter((item) => isAllowed(sessionData, [{ scope: 'exports', action: 'create', fields: [{ key: 'kind', values: [item] }] }], { handleError: true })).map((item) => ({ value: item, label: exportOptionsTranslations(`kind.${item}.label`) }));
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
        <Select label={t('form.kind.label')} description={t('form.kind.description')} placeholder={t('form.kind.placeholder')} nothingFoundMessage={t('form.kind.nothingFound')} data={availableExportKinds} {...exportsExplorerContext.form_main.getInputProps('kind')} searchable clearable />
      </Section>

      <Divider />

      {!exportsExplorerContext.form_main.values.kind && <NoDataLabel text={t('no_data')} fill />}
      {exportsExplorerContext.form_main.values.kind === 'gtfs_v29' && <ExportsExplorerFormGtfsV29 />}
      {/* {exportsExplorerContext.form_main.values.kind === 'netex_v1' && <ExportsExplorerFormNetexV1 />} */}
      {/* {exportsExplorerContext.form_main.values.kind === 'regional_merge_v1' && <ExportsExplorerFormRegionalMergeV1 />} */}

      <Divider />
      <Section>
        <Switch label={t('form.notify_user.label')} description={t('form.notify_user.description')} {...exportsExplorerContext.form_main.getInputProps('notify_user')} />
      </Section>
      <Divider />
      <Section>
        <Button onClick={exportsExplorerContext.startExport} loading={exportsExplorerContext.form.is_loading} disabled={!exportsExplorerContext.form.is_valid}>
          {t('operations.start.label')}
        </Button>
      </Section>
    </Pannel>
  );
}
