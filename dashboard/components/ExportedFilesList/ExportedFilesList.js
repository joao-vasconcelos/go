'use client';

import useSWR from 'swr';
import AuthGate, { isAllowed } from '@/components/AuthGate/AuthGate';
import Text from '@/components/Text/Text';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { IconArrowBigDownLinesFilled } from '@tabler/icons-react';
import { SimpleGrid, TextInput, Select, MultiSelect, Button, Divider } from '@mantine/core';
import Pannel from '@/components/Pannel/Pannel';
import ExportResult from '@/components/ExportResult/ExportResult';
import { Section } from '@/components/Layouts/Layouts';
import styles from './ExportedFilesList.module.css';

export default function ExportedFilesList({ children }) {
  //

  //
  // A. Setup variables

  const t = useTranslations('export');
  const { data: session } = useSession();

  //
  // B. Fetch data

  const { data: allExportsData, isLoading: allExportsLoading } = useSWR('/api/exports', { refreshInterval: 250 });

  return (
    <Pannel
      loading={allExportsLoading}
      header={
        <>
          <IconArrowBigDownLinesFilled size='22px' />
          <Text size='h2' full>
            Previous Exports
          </Text>
        </>
      }
    >
      <Section>
        <div>
          <Text size='h2'>Export Status</Text>
          <Text size='h4'>{t('gtfs_v18.sections.intro.description')}</Text>
        </div>
      </Section>
      <Divider />
      <Section>{allExportsData && allExportsData.map((item) => <ExportResult key={item._id} item={item} />)}</Section>
      <Divider />
    </Pannel>
  );
}
