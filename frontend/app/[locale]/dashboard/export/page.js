'use client';

import useSWR from 'swr';
import { ThreeEvenColumns } from '@/components/Layouts/Layouts';
import Pannel from '@/components/Pannel/Pannel';
import Text from '@/components/Text/Text';
import { useTranslations } from 'next-intl';
import { useSession } from 'next-auth/react';
import AuthGate, { isAllowed } from '@/components/AuthGate/AuthGate';
import { IconArrowBigDownLinesFilled } from '@tabler/icons-react';
import { SimpleGrid, TextInput, Select, MultiSelect, Button, Divider } from '@mantine/core';
import { Section } from '@/components/Layouts/Layouts';
import { useState, useMemo } from 'react';
import API from '@/services/API';
import ExportResult from '@/components/ExportResult/ExportResult';

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

  const { data: exportsData, error: exportsError, isLoading: exportsLoading } = useSWR('/api/exports', { refreshInterval: 250 });
  const { data: agenciesData, error: agenciesError, isLoading: agenciesLoading } = useSWR('/api/agencies');
  const { data: allLinesData, error: linesError, isLoading: linesLoading } = useSWR('/api/lines');

  //
  // B. Format data

  const agenciesFormattedForSelect = useMemo(() => {
    if (!agenciesData) return [];
    return agenciesData.map((item) => {
      return { value: item._id, label: item.name || '-' };
    });
  }, [agenciesData]);

  const linesFormattedForSelect = useMemo(() => {
    if (!allLinesData) return [];
    let filteredLineBySelectedAgency = allLinesData;
    if (selectedAgencyId) filteredLineBySelectedAgency = allLinesData.filter((item) => item.agency === selectedAgencyId);
    return filteredLineBySelectedAgency.map((item) => {
      return { value: item._id, label: `(${item.short_name}) ${item.long_name}` };
    });
  }, [allLinesData, selectedAgencyId]);

  //
  // D. Handle actions

  const handleExportGTFSv18 = async () => {
    try {
      setIsExportingV18(true);
      await API({ service: 'exports', operation: 'gtfs_v18', method: 'POST', body: { agency_id: selectedAgencyId, lines: selectedLineIds } });
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
          loading={exportsLoading}
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
          <Section>{exportsData && exportsData.map((item) => <ExportResult key={item._id} item={item} />)}</Section>
          <Divider />
        </Pannel>
      }
      second={
        <Pannel
          loading={isExportingV18}
          header={
            <>
              <IconArrowBigDownLinesFilled size='22px' />
              <Text size='h2' full>
                Exportar Plano de Oferta (v29)
              </Text>
            </>
          }
        >
          <Section>
            <div>
              <Text size='h2'>Exportar Plano de Oferta (v29)</Text>
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
      third={
        <Pannel
          loading={isExportingV18}
          header={
            <>
              <IconArrowBigDownLinesFilled size='22px' />
              <Text size='h2' full>
                Exportar Afetação
              </Text>
            </>
          }
        >
          <Section>
            <div>
              <Text size='h2'>Exportar Afetação</Text>
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
    />
  );
}
