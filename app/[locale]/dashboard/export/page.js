'use client';

import useSWR from 'swr';
import { ThreeEvenColumns } from '../../../../components/Layouts/Layouts';
import Pannel from '../../../../components/Pannel/Pannel';
import Text from '../../../../components/Text/Text';
import { useTranslations } from 'next-intl';
import { useSession } from 'next-auth/react';
import AuthGate, { isAllowed } from '../../../../components/AuthGate/AuthGate';
import { IconArrowBigDownLinesFilled } from '@tabler/icons-react';
import { SimpleGrid, TextInput, Select, Button } from '@mantine/core';
import { Section } from '../../../../components/Layouts/Layouts';
import { useState, useMemo } from 'react';

export default function Page() {
  //

  //
  // A. Setup variables

  const t = useTranslations('export');
  const { data: session } = useSession();
  const [selectedAgencyId, setSelectedAgencyId] = useState('');
  const [isExportingV18, setIsExportingV18] = useState(false);

  //
  // B. Fetch data

  const { data: agenciesData, error: agenciesError, isLoading: agenciesLoading } = useSWR('/api/agencies');

  //
  // B. Format data

  const agenciesFormattedForSelect = useMemo(() => {
    return agenciesData
      ? agenciesData.map((item) => {
          return { value: item._id, label: item.agency_name || '-' };
        })
      : [];
  }, [agenciesData]);

  //
  // D. Handle actions

  const handleExportGTFSv18 = async () => {
    try {
      setIsExportingV18(true);
      const archiveBlob = await fetch('/api/export/gtfs_v18', {
        method: 'POST',
        body: JSON.stringify({ agency_id: selectedAgencyId }),
      }).then((response) => response.blob());

      const objectURL = URL.createObjectURL(archiveBlob);
      const zipDownload = document.createElement('a');
      zipDownload.href = objectURL;
      zipDownload.download = 'result-gtfs.zip';
      document.body.appendChild(zipDownload);
      zipDownload.click();

      //   console.log(archive);
      setIsExportingV18(false);
    } catch (err) {
      console.log(err);
      setIsExportingV18(false);
    }
  };

  //
  // E. Render components

  return (
    <ThreeEvenColumns
      first={
        <Pannel
          header={
            <>
              <IconArrowBigDownLinesFilled size='20px' />
              <Text size='h1' full>
                {t('gtfs_v18.title')}
              </Text>
            </>
          }
        >
          <Section>
            <Text size='h2'>{t('gtfs_v18.title')}</Text>
            <Select
              label={t('gtfs_v18.agencies.label')}
              placeholder={t('gtfs_v18.agencies.placeholder')}
              nothingFound={t('gtfs_v18.agencies.nothingFound')}
              data={agenciesFormattedForSelect}
              value={selectedAgencyId}
              onChange={setSelectedAgencyId}
              searchable
            />
            <SimpleGrid cols={1}>
              <Button onClick={handleExportGTFSv18} loading={isExportingV18}>
                Start Export V18
              </Button>
            </SimpleGrid>
          </Section>
        </Pannel>
      }
      second={
        <Pannel
          header={
            <>
              <IconArrowBigDownLinesFilled size='20px' />
              <Text size='h1' full>
                {t('gtfs_v29.title')}
              </Text>
            </>
          }
        ></Pannel>
      }
      third={<Pannel></Pannel>}
    />
  );
}
