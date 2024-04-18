'use client';

/* * */

import styles from './PatternsExplorerIdPageImport.module.css';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import GTFSParser from '@/components/GTFSParser/GTFSParser';
import { Button, Divider, SimpleGrid, Text, Tooltip } from '@mantine/core';
import notify from '@/services/notify';
import { usePatternsExplorerContext } from '@/contexts/PatternsExplorerContext';
import { openConfirmModal } from '@mantine/modals';

/* * */

export default function PatternsExplorerIdPageImport() {
  //

  //
  // A. Setup variables

  const t = useTranslations('PatternsExplorerIdPageImport');

  const patternsExplorerContext = usePatternsExplorerContext();

  const [parseResult, setParseResult] = useState();

  //
  // B. Handle actions

  const handleParse = (gtfsAsJson) => {
    try {
      const trips = [];
      for (const route of gtfsAsJson) {
        for (const trip of route.trips) {
          trips.push(trip);
        }
      }
      setParseResult(trips);
    } catch (error) {
      console.log(error);
      setParseResult();
    }
  };

  const handleClearTable = () => {
    setParseResult();
  };

  const handlePathImport = (trip) => {
    openConfirmModal({
      title: (
        <Text size={'lg'} fw={700}>
          Replace Path and Shape?
        </Text>
      ),
      centered: true,
      closeOnClickOutside: true,
      children: (
        <SimpleGrid cols={1}>
          <Text>Tem a certeza que pretende importar este pattern?</Text>
          <Divider />
          <div>
            <Text>COMO ESTÁ AGORA</Text>
            <Text>Paragens: {patternsExplorerContext.item_data?.path.length}</Text>
            <Text>Shape: {patternsExplorerContext.item_data?.shape.extension} metros</Text>
          </div>
          <Divider />
          <div>
            <Text>COMO VAI FICAR DEPOIS DE IMPORTAR</Text>
            <Text>Paragens: {trip.path.length}</Text>
            <Text>Shape: {parseInt(trip.shape.points[trip.shape.points.length - 1].shape_dist_traveled)} metros</Text>
          </div>
        </SimpleGrid>
      ),
      labels: { confirm: 'Sim, importar percurso', cancel: 'Manter como está' },
      onConfirm: async () => {
        try {
          notify('pattern-import', 'loading', t('import.loading'));
          await patternsExplorerContext.importPatternFromGtfs({ shape: trip.shape.points, path: trip.path });
          notify('pattern-import', 'success', t('import.success', { trip_id: trip.trip_id }));
        } catch (error) {
          console.log(error);
          notify('pattern-import', 'error', err.message || t('import.error'));
        }
      },
    });
  };

  //
  // C. Render components

  const TableHeader = () => (
    <div className={styles.tableHeader}>
      <div className={styles.tableHeaderColumn}>{t('table.header.route_id')}</div>
      <div className={styles.tableHeaderColumn}>{t('table.header.trip_headsign')}</div>
      <div className={styles.tableHeaderColumn}>{t('table.header.stop_count')}</div>
      <div className={styles.tableHeaderColumn}>{t('table.header.import')}</div>
    </div>
  );

  const TableBody = () => (
    <div className={styles.tableBody}>
      {parseResult.map((trip) => (
        <div className={styles.tableBodyRow} key={trip.trip_id}>
          <div className={styles.tableBodyColumn}>{trip.route_id}</div>
          <div className={styles.tableBodyColumn}>{trip.trip_headsign}</div>
          <div className={styles.tableBodyColumn}>{trip.path.length}</div>
          <div className={styles.tableBodyColumn}>
            <Tooltip label={t('table.body.import.description')} color="red" width={220} multiline withArrow>
              <Button size="xs" onClick={() => handlePathImport(trip)}>
                {t('table.body.import.title')}
              </Button>
            </Tooltip>
          </div>
        </div>
      ))}
    </div>
  );

  const ParsingResults = () => (
    <div className={styles.container}>
      <div className={styles.title}>{t('title')}</div>
      <div className={styles.tableContainer}>
        <TableHeader />
        <TableBody />
      </div>
      <div>
        <Button size="xs" variant="light" color="gray" onClick={handleClearTable}>
          {t('clear.title')}
        </Button>
      </div>
    </div>
  );

  return parseResult ? <ParsingResults /> : <GTFSParser onParse={handleParse} />;

  //
}
