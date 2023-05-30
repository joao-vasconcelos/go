'use client';

import useSWR from 'swr';
import { ThreeEvenColumns } from '../../../../components/Layouts/Layouts';
import Pannel from '../../../../components/Pannel/Pannel';
import Text from '../../../../components/Text/Text';
import { useTranslations } from 'next-intl';
import { useSession } from 'next-auth/react';
import AuthGate, { isAllowed } from '../../../../components/AuthGate/AuthGate';
import { IconArrowBigDownLinesFilled } from '@tabler/icons-react';
import { SimpleGrid, TextInput, Select, MultiSelect, Button, Divider } from '@mantine/core';
import { Section } from '../../../../components/Layouts/Layouts';
import { useState, useMemo } from 'react';

export default function Page() {
  //

  //
  // A. Setup variables

  const t = useTranslations('export');
  const { data: session } = useSession();
  const [selectedAgencyId, setSelectedAgencyId] = useState();
  const [selectedLineIds, setSelectedLineIds] = useState([]);
  const [isExportingV18, setIsExportingV18] = useState(false);

  //
  // B. Fetch data

  const { data: agenciesData, error: agenciesError, isLoading: agenciesLoading } = useSWR('/api/agencies');
  const { data: linesData, error: linesError, isLoading: linesLoading } = useSWR('/api/lines');

  //
  // B. Format data

  const agenciesFormattedForSelect = useMemo(() => {
    if (!agenciesData) return [];
    return agenciesData.map((item) => {
      return { value: item._id, label: item.name || '-' };
    });
  }, [agenciesData]);

  const linesFormattedForSelect = useMemo(() => {
    if (!linesData) return [];
    let filteredLineBySelectedAgency = linesData;
    if (selectedAgencyId) filteredLineBySelectedAgency = linesData.filter((item) => item.agencies.includes(selectedAgencyId));
    return filteredLineBySelectedAgency.map((item) => {
      return { value: item._id, label: `(${item.short_name}) ${item.long_name}` };
    });
  }, [linesData, selectedAgencyId]);

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
          loading={isExportingV18}
          header={
            <>
              <IconArrowBigDownLinesFilled size='22px' />
              <Text size='h2' full>
                {t('gtfs_v18.title')}
              </Text>
            </>
          }
        >
          <Section>
            <div>
              <Text size='h2'>{t('gtfs_v18.sections.intro.title')}</Text>
              <Text size='h4'>{t('gtfs_v18.sections.intro.description')}</Text>
            </div>
          </Section>
          <Divider />
          <Section>
            <Select
              label={t('gtfs_v18.form.agencies.label')}
              placeholder={t('gtfs_v18.form.agencies.placeholder')}
              description={t('gtfs_v18.form.agencies.description')}
              nothingFound={t('gtfs_v18.form.agencies.nothingFound')}
              data={agenciesFormattedForSelect}
              value={selectedAgencyId}
              onChange={setSelectedAgencyId}
              searchable
              clearable
            />
            <MultiSelect
              label={t('gtfs_v18.form.lines.label')}
              placeholder={t('gtfs_v18.form.lines.placeholder')}
              description={t('gtfs_v18.form.lines.description')}
              nothingFound={t('gtfs_v18.form.lines.nothingFound')}
              data={linesFormattedForSelect}
              value={selectedLineIds}
              onChange={setSelectedLineIds}
              disabled={!selectedAgencyId}
              searchable
              clearable
            />
          </Section>
          <Divider />
          <Section>
            <SimpleGrid cols={1}>
              <Button onClick={handleExportGTFSv18} loading={isExportingV18} disabled={!selectedAgencyId}>
                {t('gtfs_v18.operations.start.label')}
              </Button>
              <Text size='h4'>{t('gtfs_v18.sections.intro.description')}</Text>
            </SimpleGrid>
          </Section>
        </Pannel>
      }
      second={<Pannel></Pannel>}
      third={<Pannel></Pannel>}
    />
  );
}
