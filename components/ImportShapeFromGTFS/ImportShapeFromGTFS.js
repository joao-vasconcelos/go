'use client';

import { useState, useCallback } from 'react';
import { SimpleGrid, Textarea, Button, Alert } from '@mantine/core';
import { parseShapesCsv } from '../../app/[locale]/dashboard/shapes/shapesTxtParser';
import { IconInfoCircleFilled } from '@tabler/icons-react';
import { IconUpload, IconPhoto, IconX } from '@tabler/icons-react';
import { Group, Text, useMantineTheme, rem } from '@mantine/core';
import { Dropzone, MIME_TYPES } from '@mantine/dropzone';
import { useTranslations } from 'next-intl';
import { useForm } from '@mantine/form';
import API from '../../services/API';

//

export default function ImportShapeFromGTFS({ onImport }) {
  //

  //
  // A. Setup variables

  const t = useTranslations('ImportShapeFromGTFS');
  const [isUploading, setIsUploading] = useState(false);
  const [hasUploadError, setHasUploadError] = useState(false);
  const [parseResult, setParseResult] = useState();

  //
  // C. Setup form

  const form = useForm({
    validateInputOnBlur: true,
    validateInputOnChange: true,
    clearInputErrorOnChange: true,
  });

  //
  // D. Handle actions

  const handleUpload = async (files) => {
    try {
      console.log('files', files);
      setIsUploading(true);
      const formData = new FormData();
      formData.append('file', files[0]);
      const res = await fetch('/api/parse/gtfs', { method: 'POST', body: formData });
      const data = await res.json();
      const trips = [];
      for (const routeResult of data) {
        for (const trip of routeResult.trips) {
          trips.push(trip);
        }
      }
      console.log(trips);
      setParseResult(trips);
      setIsUploading(false);
      setHasUploadError(false);
    } catch (err) {
      console.log(err);
      setIsUploading(false);
    }
  };

  const handleShapeImport = (trip) => {
    onImport(trip.shape.points);
  };

  //
  // E. Render components

  const UploadFileDropzone = () => (
    <Dropzone loading={isUploading} onDrop={handleUpload} onReject={(files) => console.log('rejected files', files)} maxSize={3 * 1024 ** 2} accept={MIME_TYPES.zip}>
      <Group position='center' spacing='xl' style={{ height: 100, pointerEvents: 'none' }}>
        <Dropzone.Accept>
          <IconUpload size='3.2rem' stroke={1.5} />
        </Dropzone.Accept>
        <Dropzone.Reject>
          <IconX size='3.2rem' stroke={1.5} />
        </Dropzone.Reject>
        <Dropzone.Idle>
          <IconPhoto size='3.2rem' stroke={1.5} />
        </Dropzone.Idle>

        <div>
          <Text size='xl' inline>
            Drag GTFS zip here or click to select file
          </Text>
          <Text size='sm' color='dimmed' inline mt={7}>
            Attach as many files as you like, each file should not exceed 5mb
          </Text>
        </div>
      </Group>
    </Dropzone>
  );

  const ParseResultTable = () => (
    <>
      {parseResult.map((trip) => (
        <div key={trip.trip_id} onClick={() => handleShapeImport(trip)}>
          {trip.shape_id}
          {trip.trip_headsign}
        </div>
      ))}
      <div onClick={() => setParseResult('')}>Clear</div>
    </>
  );

  return parseResult ? <ParseResultTable /> : <UploadFileDropzone />;

  //
}
