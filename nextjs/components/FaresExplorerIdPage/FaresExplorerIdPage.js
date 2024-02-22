'use client';

/* * */

import { useTranslations } from 'next-intl';
import Pannel from '@/components/Pannel/Pannel';
import { SimpleGrid, TextInput, NumberInput, Select } from '@mantine/core';
import { useFaresExplorerContext } from '@/contexts/FaresExplorerContext';
import { AppLayoutSection } from '@/components/AppLayoutSection/AppLayoutSection';
import FaresExplorerIdPageHeader from '@/components/FaresExplorerIdPageHeader/FaresExplorerIdPageHeader';

/* * */

export default function FaresExplorerIdPage() {
  //

  //
  // A. Setup variables

  const t = useTranslations('FaresExplorerIdPage');
  const faresExplorerContext = useFaresExplorerContext();

  //
  // B. Render components

  return (
    <Pannel loading={faresExplorerContext.page.is_loading} header={<FaresExplorerIdPageHeader />}>
      <AppLayoutSection title={t('sections.intro.title')} description={t('sections.intro.description')}>
        <SimpleGrid cols={3}>
          <TextInput label={t('form.code.label')} placeholder={t('form.code.placeholder')} {...faresExplorerContext.form.getInputProps('code')} readOnly={faresExplorerContext.page.isReadOnly} />
          <TextInput label={t('form.name.label')} placeholder={t('form.name.placeholder')} {...faresExplorerContext.form.getInputProps('name')} readOnly={faresExplorerContext.page.isReadOnly} />
          <TextInput label={t('form.short_name.label')} placeholder={t('form.short_name.placeholder')} {...faresExplorerContext.form.getInputProps('short_name')} readOnly={faresExplorerContext.page.isReadOnly} />
        </SimpleGrid>
        <SimpleGrid cols={2}>
          <NumberInput label={t('form.price.label')} placeholder={t('form.price.placeholder')} precision={2} step={0.05} min={0.0} {...faresExplorerContext.form.getInputProps('price')} readOnly={faresExplorerContext.page.isReadOnly} />
          <Select
            label={t('form.currency_type.label')}
            placeholder={t('form.currency_type.placeholder')}
            nothingFoundMessage={t('form.currency_type.nothingFound')}
            {...faresExplorerContext.form.getInputProps('currency_type')}
            data={[{ value: 'EUR', label: t('form.currency_type.options.EUR') }]}
            readOnly={faresExplorerContext.page.isReadOnly}
            searchable
          />
        </SimpleGrid>
        <SimpleGrid cols={2}>
          <Select
            label={t('form.payment_method.label')}
            placeholder={t('form.payment_method.placeholder')}
            nothingFoundMessage={t('form.payment_method.nothingFound')}
            {...faresExplorerContext.form.getInputProps('payment_method')}
            data={[
              { value: '0', label: t('form.payment_method.options.0') },
              { value: '1', label: t('form.payment_method.options.1') },
            ]}
            readOnly={faresExplorerContext.page.isReadOnly}
            searchable
          />
          <Select
            label={t('form.transfers.label')}
            placeholder={t('form.transfers.placeholder')}
            nothingFoundMessage={t('form.transfers.nothingFound')}
            {...faresExplorerContext.form.getInputProps('transfers')}
            data={[
              { value: '0', label: t('form.transfers.options.0') },
              { value: '1', label: t('form.transfers.options.1') },
              { value: '2', label: t('form.transfers.options.2') },
              { value: 'unlimited', label: t('form.transfers.options.unlimited') },
            ]}
            readOnly={faresExplorerContext.page.isReadOnly}
            searchable
          />
        </SimpleGrid>
      </AppLayoutSection>
    </Pannel>
  );
}
