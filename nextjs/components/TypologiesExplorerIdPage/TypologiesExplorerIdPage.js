'use client';

/* * */

import useSWR from 'swr';
import { useTranslations } from 'next-intl';
import Pannel from '@/components/Pannel/Pannel';
import { SimpleGrid, TextInput, Select, ColorInput, Divider, MultiSelect } from '@mantine/core';
import { useTypologiesExplorerContext } from '@/contexts/TypologiesExplorerContext';
import { AppLayoutSection } from '@/components/AppLayoutSection/AppLayoutSection';
import TypologiesExplorerIdPageHeader from '@/components/TypologiesExplorerIdPageHeader/TypologiesExplorerIdPageHeader';
import { useMemo } from 'react';
import { LinesExplorerLine } from '../LinesExplorerLine/LinesExplorerLine';
import LineDisplay from '../LineDisplay/LineDisplay';

/* * */

export default function TypologiesExplorerIdPage() {
  //

  //
  // A. Setup variables

  const t = useTranslations('TypologiesExplorerIdPage');
  const typologiesExplorerContext = useTypologiesExplorerContext();

  //
  // B. Fetch data

  const { data: allFaresData } = useSWR('/api/fares');

  //
  // C. Transform data

  const allPrepaidFaresDataFormatted = useMemo(() => {
    if (!allFaresData) return [];
    return allFaresData.filter((item) => item.payment_method === '1').map((item) => ({ value: item._id, label: `${item.name} (${item.price} ${item.currency_type})` }));
  }, [allFaresData]);

  const allOnboardFaresDataFormatted = useMemo(() => {
    if (!allFaresData) return [];
    return allFaresData.filter((item) => item.payment_method === '0').map((item) => ({ value: item._id, label: `${item.name} (${item.price} ${item.currency_type})` }));
  }, [allFaresData]);

  //
  // D. Render components

  return (
    <Pannel loading={typologiesExplorerContext.page.is_loading} header={<TypologiesExplorerIdPageHeader />}>
      <AppLayoutSection title={t('sections.intro.title')} description={t('sections.intro.description')}>
        <SimpleGrid cols={2}>
          <TextInput label={t('form.code.label')} placeholder={t('form.code.placeholder')} {...typologiesExplorerContext.form.getInputProps('code')} readOnly={typologiesExplorerContext.page.is_read_only} />
        </SimpleGrid>
        <SimpleGrid cols={2}>
          <TextInput label={t('form.name.label')} placeholder={t('form.name.placeholder')} {...typologiesExplorerContext.form.getInputProps('name')} readOnly={typologiesExplorerContext.page.is_read_only} />
          <TextInput label={t('form.short_name.label')} placeholder={t('form.short_name.placeholder')} {...typologiesExplorerContext.form.getInputProps('short_name')} readOnly={typologiesExplorerContext.page.is_read_only} />
        </SimpleGrid>
      </AppLayoutSection>
      <Divider />
      <AppLayoutSection title={t('sections.appearance.title')} description={t('sections.appearance.description')}>
        <SimpleGrid cols={1}>
          <LineDisplay color={typologiesExplorerContext.form.values.color} text_color={typologiesExplorerContext.form.values.text_color} short_name={'1234'} name={'A Carris Metropolitana é a maior'} />
        </SimpleGrid>
        <SimpleGrid cols={2}>
          <ColorInput label={t('form.color.label')} placeholder={t('form.color.placeholder')} {...typologiesExplorerContext.form.getInputProps('color')} readOnly={typologiesExplorerContext.page.is_read_only} />
          <ColorInput label={t('form.text_color.label')} placeholder={t('form.text_color.placeholder')} {...typologiesExplorerContext.form.getInputProps('text_color')} readOnly={typologiesExplorerContext.page.is_read_only} />
        </SimpleGrid>
      </AppLayoutSection>
      <Divider />
      <AppLayoutSection title={t('sections.default_fares.title')} description={t('sections.default_fares.description')}>
        <SimpleGrid cols={1}>
          <Select
            label={t('form.default_prepaid_fare.label')}
            placeholder={t('form.default_prepaid_fare.placeholder')}
            description={t('form.default_prepaid_fare.description')}
            nothingFoundMessage={t('form.default_prepaid_fare.nothingFound')}
            data={allPrepaidFaresDataFormatted}
            {...typologiesExplorerContext.form.getInputProps('default_prepaid_fare')}
            readOnly={typologiesExplorerContext.page.is_read_only}
            searchable
          />
          <MultiSelect
            label={t('form.default_onboard_fares.label')}
            placeholder={t('form.default_onboard_fares.placeholder')}
            description={t('form.default_onboard_fares.description')}
            nothingFoundMessage={t('form.default_onboard_fares.nothingFound')}
            data={allOnboardFaresDataFormatted}
            {...typologiesExplorerContext.form.getInputProps('default_onboard_fares')}
            readOnly={typologiesExplorerContext.page.is_read_only}
            searchable
          />
        </SimpleGrid>
      </AppLayoutSection>
    </Pannel>
  );

  //
}
