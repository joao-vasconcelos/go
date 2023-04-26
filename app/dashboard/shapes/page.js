'use client';

import useSWR from 'swr';
import { styled } from '@stitches/react';
import { useRef, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, yupResolver } from '@mantine/form';
import API from '../../../services/API';
import { Validation as ShapeValidation } from '../../../schemas/Shape/validation';
import { Default as ShapeDefault } from '../../../schemas/Shape/default';
import { Tooltip, Textarea, Table, SimpleGrid, Progress, TextInput, Code, ActionIcon, Divider, Group, Text, useMantineTheme, rem, Button, Alert, Loader, Stack } from '@mantine/core';
import { TbUpload, TbForbid2, TbDragDrop, TbAlertTriangleFilled, TbCheck } from 'react-icons/tb';
import Pannel from '../../../layouts/Pannel';
import SaveButtons from '../../../components/SaveButtons';
import notify from '../../../services/notify';
import { openConfirmModal } from '@mantine/modals';
import HeaderTitle from '../../../components/lists/HeaderTitle';
import ImportShapeFromText from '../../../components/importShapes/ImportShapeFromText';
import Flex from '../../../layouts/Flex';
import DynamicTable from '../../../components/DynamicTable';
import { IconUpload, IconPhoto, IconX } from '@tabler/icons-react';
import { Dropzone, DropzoneProps, IMAGE_MIME_TYPE } from '@mantine/dropzone';
import parseShapesCsv from '../../../services/parseShapesCsv';

const SectionTitle = styled('p', {
  fontSize: '20px',
  fontWeight: 'bold',
  color: '$gray12',
});

const Section = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  padding: '$lg',
  gap: '$md',
  width: '100%',
  maxHeight: '100%',
});

export default function Page(props) {
  //

  //
  // A. Setup variables

  const [isParsingFiles, setIsParsingFiles] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isImportError, setIsImportError] = useState();
  const [shapesToImport, setShapesToImport] = useState([]);
  const [shapesImportProgressAbsolute, setShapesImportProgressAbsolute] = useState(0);
  const [shapesImportProgressPercentage, setShapesImportProgressPercentage] = useState(0);

  const shouldCancelUpload = useRef(false);

  //
  // B. Fetch data

  //
  // C. Setup form

  //
  // D. Handle actions

  const handleFilesDrop = async (files) => {
    try {
      // Display loading UI
      setIsParsingFiles(true);
      // Define a temporary variable to hold shapes
      let shapesToImport_temp = [];
      // For each file
      for (const currentFile of files) {
        // Parse the shapes in the file
        const shapesFromFile = await parseShapesCsv(currentFile);
        // For each parsed shape in the file
        for (const currentShape of shapesFromFile) {
          // For each parsed shape in the file
          shapesToImport_temp.push({
            shape_was_imported_api: 'Aguarda início da importação',
            ...currentShape,
          });
        }
      }
      // Display the shapes in the UI
      setIsImportError();
      setShapesToImport(shapesToImport_temp);
      setIsParsingFiles(false);
      //
    } catch (err) {
      setIsImportError(err.message);
      setIsParsingFiles(false);
    }
  };

  const handleFilesReject = (files) => {
    console.log('rejected files', files);
  };

  const handleImportInit = () => {
    openConfirmModal({
      title: (
        <Text size={'lg'} fw={700}>
          Importar todas as Shapes?
        </Text>
      ),
      centered: true,
      closeOnClickOutside: true,
      children: (
        <Flex direction='column'>
          <Text>Se uma shape com o mesmo ID já existir, será atualizada com os pontos desta nova importação. Se não existir, então será criada uma nova shape.</Text>
          <Code style={{ fontSize: '14px' }}>Total de Shapes a importar: {shapesToImport.length}</Code>
        </Flex>
      ),
      labels: { confirm: 'Importar Todas as Shapes', cancel: 'Não Importar' },
      confirmProps: { color: 'blue' },
      onConfirm: async () => {
        shouldCancelUpload.current = false;
        setIsUploading(true);
        for (const [index, currentShape] of shapesToImport.entries()) {
          try {
            if (shouldCancelUpload.current) break;
            notify(`shape-points-bulk-add-${currentShape.shape_id}`, 'loading', `A Importar Shape ${currentShape.shape_id}...`);
            await API({ service: 'shapes', operation: 'import', method: 'POST', body: [currentShape] });
            setShapesImportProgressAbsolute(index);
            setShapesImportProgressPercentage((index * 100) / shapesToImport.length);
            notify(`shape-points-bulk-add-${currentShape.shape_id}`, 'success', `Shape ${currentShape.shape_id} Importada com Sucesso!`);
          } catch (err) {
            console.log(err);
            notify(`shape-points-bulk-add-${currentShape.shape_id}`, 'error', err.message || `Occoreu um erro na importação da Shape ${currentShape.shape_id}: ${err.message}`);
            setIsUploading(false);
          }
        }
        setIsUploading(false);
      },
    });
  };

  const handleImportCancel = () => {
    setIsImportError();
    setShapesToImport([]);
    shouldCancelUpload.current = true;
  };

  const handleUploadAbort = () => {
    openConfirmModal({
      title: (
        <Text size={'lg'} fw={700}>
          Cancelar importação?
        </Text>
      ),
      centered: true,
      closeOnClickOutside: true,
      children: (
        <Flex direction='column'>
          <Text>Uma vez cancelada não é possível continuar a importação. Será necessário começar de novo.</Text>
        </Flex>
      ),
      labels: { confirm: 'Cancelar a Importação', cancel: 'Continuar a Importar' },
      confirmProps: { color: 'red' },
      onConfirm: async () => {
        shouldCancelUpload.current = true;
        setShapesImportProgressAbsolute(0);
        setShapesImportProgressPercentage(0);
      },
    });
  };

  const handleRowClick = async (row) => {
    openConfirmModal({
      title: (
        <Text size={'lg'} fw={700}>
          Importar esta Shape?
        </Text>
      ),
      centered: true,
      closeOnClickOutside: true,
      children: (
        <Flex direction='column'>
          <Text>Se uma shape com o mesmo ID já existir, será atualizada com os pontos desta nova importação. Se não existir, então será criada uma nova shape.</Text>
          <Code style={{ fontSize: '14px' }}>shape_id: {row.shape_id}</Code>
          <Code style={{ fontSize: '14px' }}>shape_distance: {row.shape_distance}</Code>
          <Code style={{ fontSize: '14px' }}>shape_points_count: {row.shape_points_count}</Code>
        </Flex>
      ),
      labels: { confirm: 'Importar Shape', cancel: 'Cancelar' },
      confirmProps: { color: 'blue' },
      onConfirm: async () => {
        try {
          notify('shape-points-single-add', 'loading', `A Importar Shape ${row.shape_id}...`);
          await API({ service: 'shapes', operation: 'import', method: 'POST', body: [row] });
          notify('shape-points-single-add', 'success', 'Shape Importada com sucesso!');
        } catch (err) {
          console.log(err);
          notify('shape-points-single-add', 'error', err.message || 'Occoreu um erro.');
        }
      },
    });
  };

  //
  // E. Render components

  return (
    <>
      {!shapesToImport.length && (
        <Section style={{ padding: 0 }}>
          {isImportError && (
            <Alert icon={<TbAlertTriangleFilled size='20px' />} title='Ocorreu um erro na importação' color='red'>
              {isImportError}
            </Alert>
          )}
          <Dropzone onDrop={handleFilesDrop} onReject={handleFilesReject} accept={['text/plain', 'text/csv']} loading={isParsingFiles}>
            <Group position='center' spacing='xl' style={{ minHeight: '300px', pointerEvents: 'none' }}>
              <Dropzone.Accept>
                <Flex>
                  <TbUpload size='40px' />
                  <div>
                    <Text size='xl' inline>
                      Largue para iniciar a importação.
                    </Text>
                    <Text size='sm' color='dimmed' inline mt={7}>
                      Este processo irá criar novas shapes. Será necessário posteriormente associar estas shapes aos patterns.
                    </Text>
                  </div>
                </Flex>
              </Dropzone.Accept>
              <Dropzone.Reject>
                <Flex>
                  <TbForbid2 size='40px' />
                  <div>
                    <Text size='xl' inline>
                      Adicione apenas ficheiros TXT ou CSV.
                    </Text>
                    <Text size='sm' color='dimmed' inline mt={7}>
                      Não é possível aceitar esta seleção.
                    </Text>
                  </div>
                </Flex>
              </Dropzone.Reject>
              <Dropzone.Idle>
                <Flex>
                  <TbDragDrop size='40px' />
                  <div>
                    <Text size='xl' inline>
                      Adicione um ficheiro shapes.txt para importar em lote.
                    </Text>
                    <Text size='sm' color='dimmed' inline mt={7}>
                      Este processo irá criar novas shapes. Será necessário posteriormente associar estas shapes aos patterns.
                    </Text>
                  </div>
                </Flex>
              </Dropzone.Idle>
            </Group>
          </Dropzone>
        </Section>
      )}
      {shapesToImport.length > 0 && (
        <Pannel
          header={
            shapesToImport.length > 0 && (
              <>
                {shapesToImport.length > 0 && !isUploading && (
                  <Alert icon={<TbCheck size='20px' />} title={`Encontradas ${shapesToImport.length} shapes`} color='green' w='100%'>
                    Os pontos das shapes com o mesmo ID serão atualizados com o conteúdo desta importação.
                  </Alert>
                )}
                {shapesToImport.length > 0 && isUploading && (
                  <Alert icon={<Loader size='20px' />} title={`A Importar ${shapesToImport.length} Shapes...`} color='blue' w='100%'>
                    <Flex direction='column'>
                      <Text>
                        A importar Shape {shapesImportProgressAbsolute} de {shapesToImport.length}...
                      </Text>
                      <Progress aria-label='Progresso da Importação' value={shapesImportProgressPercentage} w={'100%'} animate />
                      <Button size='xs' color='gray' variant='light' onClick={handleUploadAbort}>
                        Cancelar Importação
                      </Button>
                    </Flex>
                  </Alert>
                )}
              </>
            )
          }
        >
          <Section>
            <DynamicTable
              data={shapesToImport || []}
              isLoading={isParsingFiles}
              columns={[
                { label: 'ID da Shape', key: 'shape_id' },
                { label: 'Extensão (km)', key: 'shape_distance' },
                { label: 'Número de Pontos', key: 'shape_points_count' },
                { label: 'Importação OK?', key: 'shape_was_imported_api' },
              ]}
              onRowClick={!isUploading && handleRowClick}
            />
            <SimpleGrid cols={2} pb={'lg'}>
              <Button onClick={handleImportInit} disabled={!shapesToImport.length || isUploading}>
                {`Iniciar Importação (${shapesToImport.length} shapes)`}
              </Button>
              <Button color='red' onClick={handleImportCancel} disabled={!shapesToImport.length || isUploading}>
                Cancelar e Limpar Lista
              </Button>
            </SimpleGrid>
          </Section>
        </Pannel>
      )}
    </>
  );
}
