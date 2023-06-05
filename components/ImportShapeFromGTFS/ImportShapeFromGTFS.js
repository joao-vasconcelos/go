'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import GTFSParser from '@/components/GTFSParser/GTFSParser';

//

export default function ImportShapeFromGTFS({ onImport }) {
  //

  //
  // A. Setup variables

  const t = useTranslations('ImportShapeFromGTFS');
  const [isParsing, setIsParsing] = useState(false);
  const [hasParseError, setHasParseError] = useState(false);
  const [parseResult, setParseResult] = useState();

  //
  // D. Handle actions

  const handleShapeImport = (trip) => {
    onImport(trip.shape.points);
  };

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

  //
  // E. Render components

  const ParseResultTable = () => (
    <>
      {parseResult.map((trip) => (
        <div key={trip.trip_id} onClick={() => handleShapeImport(trip)}>
          {trip.shape_id}
          {trip.trip_headsign}
        </div>
      ))}
      <div onClick={() => setParseResult()}>Clear</div>
    </>
  );

  return parseResult ? <ParseResultTable /> : <GTFSParser onParse={handleParse} />;

  //
}
