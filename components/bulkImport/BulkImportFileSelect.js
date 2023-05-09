'use client';

import { useState } from 'react';
import { Group, Text, Alert, Stack } from '@mantine/core';
import { Dropzone } from '@mantine/dropzone';
import { TbUpload, TbBan, TbDragDrop, TbAlertTriangleFilled } from 'react-icons/tb';

export default function BulkImportFileSelect({ filesParser, onParse }) {
  //

  //
  // A. Setup variables

  const [isParsing, setIsParsing] = useState(false);
  const [hasParsingError, setHasParsingError] = useState(false);

  //
  // B. Handle actions

  const handleAcceptedFilesDrop = async (acceptedFiles) => {
    try {
      // Update the UI to reflect parsing init
      setIsParsing(true);
      setHasParsingError();
      // Parse the files using the provided parser
      const parsedData = await filesParser(acceptedFiles);
      // Update the UI to reflect parsing end
      // and pass the result to the next handler
      setIsParsing(false);
      onParse(parsedData);
      //
    } catch (err) {
      setHasParsingError(err.message);
      setIsParsing(false);
    }
  };

  const handleRejectedFilesDrop = (rejectedFiles) => {
    return;
  };

  //
  // C. Render components

  const ErrorAlert = () => (
    <Alert icon={<TbAlertTriangleFilled size='20px' />} title='Ocorreu um erro na importação' color='red'>
      {hasParsingError || 'Não foi possível importar o(s) ficheiro(s). Por favor verifique a formatação.'}
    </Alert>
  );

  const DropZoneIdle = () => (
    <Dropzone.Idle>
      <Group>
        <TbDragDrop size='40px' />
        <div>
          <Text size='xl' inline>
            Adicione um ficheiro shapes.txt para importar em lote.
          </Text>
          <Text size='sm' color='dimmed' inline mt={7}>
            Este processo irá criar novas shapes. Será necessário posteriormente associar estas shapes aos patterns.
          </Text>
        </div>
      </Group>
    </Dropzone.Idle>
  );

  const DropZoneAccept = () => (
    <Dropzone.Accept>
      <Group>
        <TbUpload size='40px' />
        <div>
          <Text size='xl' inline>
            Largue para iniciar a importação.
          </Text>
          <Text size='sm' color='dimmed' inline mt={7}>
            Este processo irá criar novas shapes. Será necessário posteriormente associar estas shapes aos patterns.
          </Text>
        </div>
      </Group>
    </Dropzone.Accept>
  );

  const DropZoneReject = () => (
    <Dropzone.Reject>
      <Group>
        <TbBan size='40px' />
        <div>
          <Text size='xl' inline>
            Adicione apenas ficheiros TXT ou CSV.
          </Text>
          <Text size='sm' color='dimmed' inline mt={7}>
            Não é possível aceitar esta seleção.
          </Text>
        </div>
      </Group>
    </Dropzone.Reject>
  );

  return (
    <Stack>
      {hasParsingError && <ErrorAlert />}
      <Dropzone onDrop={handleAcceptedFilesDrop} onReject={handleRejectedFilesDrop} accept={['text/plain', 'text/csv']} loading={isParsing}>
        <Group position='center' p='lg' mih='300px' style={{ pointerEvents: 'none' }}>
          <DropZoneIdle />
          <DropZoneAccept />
          <DropZoneReject />
        </Group>
      </Dropzone>
    </Stack>
  );
}
