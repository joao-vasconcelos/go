'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { styled } from '@stitches/react';
import { Checkbox, ActionIcon, Text, Code, TextInput, Button, Tooltip, SimpleGrid } from '@mantine/core';
import { openConfirmModal } from '@mantine/modals';
import { keys } from '@mantine/utils';
import API from '../../../services/API';
import notify from '../../../services/notify';
import { TbCloudUpload, TbTrash, TbCircleCheckFilled, TbPlayerStopFilled, TbAlertTriangleFilled, TbRotateClockwise2 } from 'react-icons/tb';
import Flex from '../../../layouts/Flex';

const Container = styled('div', {
  width: '100%',
  backgroundColor: '$gray0',
  border: '1px solid $gray3',
  marginBottom: '50px',
});

const TableRow = styled('div', {
  display: 'grid',
  gridTemplateColumns: '40px repeat(4, 1fr) 120px',
  alignItems: 'center',
  width: '100%',
});

const TableHeader = styled(TableRow, {
  backgroundColor: '$gray2',
  borderBottom: '1px solid $gray5',
});

const TableBody = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '1px',
  width: '100%',
  maxHeight: '500px',
  overflow: 'scroll',
  backgroundColor: '$gray5',
});

const TableBodyRow = styled(TableRow, {
  backgroundColor: '$gray0',
  '&:hover': {
    backgroundColor: '$gray1',
  },
  variants: {
    checked: {
      true: {
        backgroundColor: '$gray1',
        '&:hover': {
          backgroundColor: '$gray2',
        },
      },
    },
    uploaded: {
      true: {
        color: '$success9',
        backgroundColor: '$success0',
        '&:hover': {
          backgroundColor: '$success0',
        },
      },
    },
    error: {
      true: {
        color: '$danger9',
        backgroundColor: '$danger0',
        '&:hover': {
          backgroundColor: '$danger0',
        },
      },
    },
  },
});

const TableCell = styled('div', {
  display: 'flex',
  alignItems: 'center',
  width: '100%',
  padding: '$sm $md',
  fontSize: '14px',
  minHeight: '60px',
});

const TableCellHeader = styled(TableCell, {
  fontWeight: '$medium',
});

const TableCellBody = styled(TableCell, {});

//

export default function BulkImportTable({ data = [] }) {
  //
  // 1. Set up state variables

  const [checked, setChecked] = useState(false);
  const [isUploadingShapes, setIsUploadingShapes] = useState(false);
  const currentUploadIndex = useRef(0);
  const [allRows, setAllRows] = useState([
    { shape_id: '1', shape_name: '', import_status: 'unchecked', points: [] },
    { shape_id: '2', shape_name: '', import_status: 'unchecked', points: [] },
    { shape_id: '3', shape_name: '', import_status: 'unchecked', points: [] },
    { shape_id: '4', shape_name: '', import_status: 'unchecked', points: [] },
    { shape_id: '5', shape_name: '', import_status: 'unchecked', points: [] },
    { shape_id: '6', shape_name: '', import_status: 'unchecked', points: [] },
  ]);

  //
  // 1. Render components

  const handleCheckAllRows = (value) => {
    const allRows_new = [...allRows];
    allRows_new.forEach((item) => {
      if (item.import_status === 'checked' || item.import_status === 'unchecked') {
        item.import_status = value ? 'checked' : 'unchecked';
      }
    });
    setAllRows(allRows_new);
    setChecked(value);
  };

  const handleRowCheck = (index, row, value) => {
    const allRows_new = [...allRows];
    if (allRows_new[index].import_status === 'checked' || allRows_new[index].import_status === 'unchecked') {
      allRows_new[index].import_status = value ? 'checked' : 'unchecked';
    }
    let allChecked = true;
    allRows_new.forEach((item) => (allChecked = item.import_status === 'checked' && allChecked));
    setChecked(allChecked);
    setAllRows(allRows_new);
  };

  const handleRowName = (index, row, value) => {
    const allRows_new = [...allRows];
    allRows_new[index] = { ...row, shape_name: value };
    setAllRows(allRows_new);
  };

  const handleRowUpload = (index, row, value) => {
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
          await API({ service: 'shapes', operation: 'import', method: 'POST', body: row });
          notify('shape-points-single-add', 'success', 'Shape Importada com sucesso!');
          const allRows_new = [...allRows];
          allRows_new[index] = { ...row, import_status: 'uploaded' };
          setAllRows(allRows_new);
        } catch (err) {
          console.log(err);
          notify('shape-points-single-add', 'error', err.message || 'Occoreu um erro.');
          const allRows_new = [...allRows];
          allRows_new[index] = { ...row, import_status: 'error' };
          setAllRows(allRows_new);
        }
      },
    });
  };

  const handleRowDelete = (index) => {
    openConfirmModal({
      title: (
        <Text size={'lg'} fw={700}>
          Remover Shape da Tabela de Importação?
        </Text>
      ),
      centered: true,
      closeOnClickOutside: true,
      children: <Text>Se remover a shape da tabela de importação, terá de importar o ficheiro novamente para que volte a ficar disponível.</Text>,
      labels: { confirm: 'Remover Shape', cancel: 'Não Remover' },
      confirmProps: { color: 'red' },
      onConfirm: async () => {
        const allRows_new = [...allRows];
        allRows_new.splice(index, 1);
        setAllRows(allRows_new);
      },
    });
  };

  const handleImportInit = () => {
    openConfirmModal({
      title: (
        <Text size={'lg'} fw={700}>
          Importar {allRows.length} Shapes?
        </Text>
      ),
      centered: true,
      closeOnClickOutside: true,
      children: (
        <Flex direction='column'>
          <Text>Se uma shape com o mesmo ID já existir, será atualizada com os pontos desta nova importação. Se não existir, então será criada uma nova shape.</Text>
          <Code style={{ fontSize: '14px' }}>Total de Shapes a importar: {allRows.length}</Code>
        </Flex>
      ),
      labels: { confirm: 'Iniciar Importação', cancel: 'Ainda Não' },
      confirmProps: { color: 'blue' },
      onConfirm: async () => {
        const allRows_new = [...allRows];
        allRows_new.forEach((item) => {
          if (item.import_status === 'checked') {
            item.import_status = 'waiting';
          }
        });
        setAllRows(allRows_new);
        const delay = () => new Promise((resolve) => setTimeout(resolve, 100));
        setIsUploadingShapes(true);
        // await recursiveStartUpload(allRows_new, 0);
        // for (const [index, currentRow] of allRows_new.entries()) {
        //   if (currentRow.import_status !== 'waiting') continue;
        //   //   await startRowUpload(allRows_new, index, currentRow);
        //   try {
        //     allRows_new[index].import_status = 'uploading';
        //     setAllRows(allRows_new);
        //     notify(`shape-points-bulk-add-${currentRow.shape_id}`, 'loading', `A Importar Shape ${currentRow.shape_id}...`);
        //     await API({ service: 'shapes', operation: 'import', method: 'POST', body: currentRow });
        //     // setUploadProgressAbsolute(index);
        //     // setUploadProgressPercentage((index * 100) / allParsedShapes.length);
        //     notify(`shape-points-bulk-add-${currentRow.shape_id}`, 'success', `Shape ${currentRow.shape_id} Importada com Sucesso!`);
        //     allRows_new[index].import_status = 'uploaded';
        //     setAllRows(allRows_new);
        //     await delay();
        //   } catch (err) {
        //     console.log(err);
        //     notify(`shape-points-bulk-add-${currentRow.shape_id}`, 'error', err.message || `Occoreu um erro na importação da Shape ${currentShape.shape_id}: ${err.message}`);
        //     allRows_new[index].import_status = 'error';
        //     setAllRows(allRows_new);
        //   }
        // }
      },
    });
  };

  const delay = () => new Promise((resolve) => setTimeout(resolve, 100));

  const recursiveStartUpload = useCallback(async (allRows_new, index) => {
    console.log('index', index);
    if (index < allRows_new.length) {
      const currentRow = allRows_new[index];
      if (currentRow.import_status === 'waiting') {
        try {
          allRows_new[index].import_status = 'uploading';
          setAllRows(allRows_new);
          notify(`shape-points-bulk-add-${currentRow.shape_id}`, 'loading', `A Importar Shape ${currentRow.shape_id}...`);
          await API({ service: 'shapes', operation: 'import', method: 'POST', body: currentRow });
          // setUploadProgressAbsolute(index);
          // setUploadProgressPercentage((index * 100) / allParsedShapes.length);
          notify(`shape-points-bulk-add-${currentRow.shape_id}`, 'success', `Shape ${currentRow.shape_id} Importada com Sucesso!`);
          allRows_new[index].import_status = 'uploaded';
          setAllRows(allRows_new);
        } catch (err) {
          console.log(err);
          notify(`shape-points-bulk-add-${currentRow.shape_id}`, 'error', err.message || `Occoreu um erro na importação da Shape ${currentShape.shape_id}: ${err.message}`);
          allRows_new[index].import_status = 'error';
          setAllRows(allRows_new);
        }
      }
      currentUploadIndex.current = index + 1;
    }
  }, []);

  useEffect(() => {
    async function startRowUpload() {
      console.log('currentUploadIndex.current', currentUploadIndex.current);
      const index = currentUploadIndex.current;
      const allRows_new = [...allRows];
      if (isUploadingShapes) {
        if (index < allRows_new.length) {
          const currentRow = allRows_new[index];
          if (currentRow.import_status === 'waiting') {
            try {
              allRows_new[index].import_status = 'uploading';
              setAllRows(allRows_new);
              notify(`shape-points-bulk-add-${currentRow.shape_id}`, 'loading', `A Importar Shape ${currentRow.shape_id}...`);
              await API({ service: 'shapes', operation: 'import', method: 'POST', body: currentRow });
              notify(`shape-points-bulk-add-${currentRow.shape_id}`, 'success', `Shape ${currentRow.shape_id} Importada com Sucesso!`);
              allRows_new[index].import_status = 'uploaded';
            } catch (err) {
              console.log(err);
              notify(`shape-points-bulk-add-${currentRow.shape_id}`, 'error', err.message || `Occoreu um erro na importação da Shape ${currentShape.shape_id}: ${err.message}`);
              allRows_new[index].import_status = 'error';
            }
          }
          currentUploadIndex.current = index + 1;
          setAllRows(allRows_new);
        }
      }
    }
  }, [allRows, isUploadingShapes]);

  //
  // 1. Render components

  return (
    <>
      <Container>
        <TableHeader>
          <TableCellHeader>
            <Checkbox aria-label='Selecionar todas' checked={checked} onChange={({ currentTarget }) => handleCheckAllRows(currentTarget.checked)} />
          </TableCellHeader>
          <TableCellHeader>Nome da Shape</TableCellHeader>
          <TableCellHeader>shape_id</TableCellHeader>
          <TableCellHeader>Extensão</TableCellHeader>
          <TableCellHeader>Número de Pontos</TableCellHeader>
        </TableHeader>
        <TableBody>
          {allRows.map((row, index) => (
            <BulkImportTableRowShape key={index} index={index} row={row} onCheck={handleRowCheck} onName={handleRowName} onUpload={handleRowUpload} onDelete={handleRowDelete} />
          ))}
        </TableBody>
      </Container>
      <SimpleGrid cols={2}>
        <Button onClick={handleImportInit}>Iniciar Importação de {allRows.length} shapes</Button>
        <Button color='red'>Cancelar e Limpar Lista</Button>
      </SimpleGrid>
    </>
  );
}

export function BulkImportTableRowShape({ index, row, onCheck, onName, onUpload, onDelete }) {
  //

  //
  // 3. Render components

  const IdleRow = (
    <TableBodyRow checked={row.import_status === 'checked'}>
      <TableCellBody>
        <Checkbox aria-label='Selecionar linha' checked={row.import_status === 'checked'} onChange={({ currentTarget }) => onCheck(index, row, currentTarget.checked)} />
      </TableCellBody>
      <TableCellBody>
        <TextInput placeholder='. . .' value={row.shape_name} onChange={({ currentTarget }) => onName(index, row, currentTarget.value)} />
      </TableCellBody>
      <TableCellBody>{row.shape_id || '-'}</TableCellBody>
      <TableCellBody>{row.shape_extension || 0} km</TableCellBody>
      <TableCellBody>{row.points.length}</TableCellBody>
      <TableCellBody>
        <Flex>
          <ActionIcon size='lg' color='blue' onClick={() => onUpload(index, row)}>
            <TbCloudUpload size='20px' />
          </ActionIcon>
          <ActionIcon size='lg' color='red' onClick={() => onDelete(index)}>
            <TbTrash size='20px' />
          </ActionIcon>
        </Flex>
      </TableCellBody>
    </TableBodyRow>
  );

  //
  // 3. Render components

  const ErrorRow = (
    <TableBodyRow error>
      <TableCellBody>
        <ActionIcon size='sm' color='red' variant='transparent' aria-label='Error uploading'>
          <TbAlertTriangleFilled size='20px' />
        </ActionIcon>
      </TableCellBody>
      <TableCellBody>
        <TextInput placeholder='. . .' value={row.shape_name} onChange={({ currentTarget }) => onName(index, row, currentTarget.value)} />
      </TableCellBody>
      <TableCellBody>{row.shape_id || '-'}</TableCellBody>
      <TableCellBody>{row.shape_extension || 0} km</TableCellBody>
      <TableCellBody>{row.points.length}</TableCellBody>
      <TableCellBody>
        <Tooltip label='Tentar Novamente' position='left' color='gray' withArrow>
          <ActionIcon size='lg' variant='default' aria-label='Shape uploaded'>
            <TbCloudUpload size='20px' />
          </ActionIcon>
        </Tooltip>
      </TableCellBody>
    </TableBodyRow>
  );

  //
  // 3. Render components

  const UploadingRow = (
    <TableBodyRow>
      <TableCellBody>
        <ActionIcon size='lg' color='blue' loading />
      </TableCellBody>
      <TableCellBody>{row.shape_name || '-'}</TableCellBody>
      <TableCellBody>{row.shape_id || '-'}</TableCellBody>
      <TableCellBody>{row.shape_extension || 0} km</TableCellBody>
      <TableCellBody>{row.points.length}</TableCellBody>
      <TableCellBody>
        <Tooltip label='Cancelar envio' color='red'>
          <ActionIcon size='lg' color='red' onClick={() => onDelete(index)}>
            <TbPlayerStopFilled size='20px' />
          </ActionIcon>
        </Tooltip>
      </TableCellBody>
    </TableBodyRow>
  );

  //
  // 3. Render components

  const UploadedRow = (
    <TableBodyRow uploaded>
      <TableCellBody>
        <ActionIcon size='sm' color='green' variant='transparent' aria-label='Shape uploaded'>
          <TbCircleCheckFilled size='20px' />
        </ActionIcon>
      </TableCellBody>
      <TableCellBody>{row.shape_name || '-'}</TableCellBody>
      <TableCellBody>{row.shape_id || '-'}</TableCellBody>
      <TableCellBody>{row.shape_extension || 0} km</TableCellBody>
      <TableCellBody>{row.points.length}</TableCellBody>
      <TableCellBody />
    </TableBodyRow>
  );

  //
  // 3. Render components

  switch (row.import_status) {
    default:
    case 'checked':
    case 'unchecked':
      return IdleRow;
    case 'uploading':
      return UploadingRow;
    case 'uploaded':
      return UploadedRow;
    case 'error':
      return ErrorRow;
  }

  //
}
