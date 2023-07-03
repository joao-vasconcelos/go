'use client';

import styles from './ImportPatternFromGTFS.module.css';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import GTFSParser from '@/components/GTFSParser/GTFSParser';
import { Button, Tooltip } from '@mantine/core';
import notify from '@/services/notify';

//

export default function ImportPatternFromGTFS({ onImport }) {
  //

  //
  // A. Setup variables

  const t = useTranslations('ImportPatternFromGTFS');
  const [isParsing, setIsParsing] = useState(false);
  const [hasParseError, setHasParseError] = useState(false);
  const [parseResult, setParseResult] = useState();

  //
  // B. Handle actions

  const handleParse = (gtfsAsJson) => {
    try {
      setHasParseError();
      setIsParsing(true);
      const trips = [];
      for (const route of gtfsAsJson) {
        for (const trip of route.trips) {
          trips.push(trip);
        }
      }
      setParseResult(trips);
      setIsParsing(false);
    } catch (err) {
      console.log(err);
      setParseResult();
      setHasParseError(err);
    }
  };

  const handleClearTable = () => {
    setParseResult();
    setIsParsing();
    setHasParseError();
  };

  const handlePathImport = (trip) => {
    onImport({ shape: trip.shape.points, path: trip.path });
    // setParseResult();
    // setIsParsing();
    // setHasParseError();
    notify('pattern-import', 'success', t('import.success', { trip_id: trip.trip_id }));
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
            <Tooltip label={t('table.body.import.description')} color='red' width={220} multiline withArrow>
              <Button size='xs' onClick={() => handlePathImport(trip)}>
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
        <Button size='xs' variant='light' color='gray' onClick={handleClearTable}>
          {t('clear.title')}
        </Button>
      </div>
    </div>
  );

  return parseResult ? <ParsingResults /> : <GTFSParser onParse={handleParse} />;

  //
}
