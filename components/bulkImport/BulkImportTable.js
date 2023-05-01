'use client';

import { useState } from 'react';
import { styled } from '@stitches/react';
import { Checkbox, ActionIcon, Flex, Stack, Text, Code, Button, Tooltip, SimpleGrid } from '@mantine/core';
import { openConfirmModal } from '@mantine/modals';
import { TbCloudUpload, TbX, TbTrash, TbCircleCheckFilled, TbAlertTriangleFilled, TbRotateClockwise2 } from 'react-icons/tb';
import Pannel from '../../layouts/Pannel';
import HeaderTitle from '../lists/HeaderTitle';

const TableRow = styled('div', {
  display: 'grid',
  gridTemplateColumns: '60px repeat(3, 1fr) 120px',
  alignItems: 'center',
  width: '100%',
});

const TableHeader = styled(TableRow, {
  backgroundColor: '$gray4',
  borderBottom: '1px solid $gray5',
});

const TableBody = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '1px',
  width: '100%',
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
        backgroundColor: '$gray2',
        '&:hover': {
          backgroundColor: '$gray3',
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
  padding: '$sm $lg',
  fontSize: '14px',
});

const TableCellHeader = styled(TableCell, {
  minHeight: '45px',
  fontWeight: '$medium',
});

const TableCellBody = styled(TableCell, {
  minHeight: '60px',
});

//

export default function BulkImportTable({ controller }) {
  //

  //
  // A. Set up state variables

  const [checkedRows, setCheckedRows] = useState([]);

  //
  // B. Handle actions

  const handleCheckSingleRow = (row_id) => {
    setCheckedRows((current) => {
      if (current.includes(row_id)) return current.filter((item) => item !== row_id);
      else return [...current, row_id];
    });
  };

  const handleCheckAllRows = () => {
    setCheckedRows((current) => {
      if (current.length === controller.allRows.length) return [];
      else return controller.allRows.map((row) => row.row_id);
    });
  };

  const handleUploadSingleRow = (row) => {
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
          <Code style={{ fontSize: '14px' }}>shape_code: {row.item.shape_code}</Code>
          <Code style={{ fontSize: '14px' }}>shape_distance: {row.item.shape_distance}</Code>
          <Code style={{ fontSize: '14px' }}>shape_points_count: {row.item.shape_points_count}</Code>
        </Flex>
      ),
      labels: { confirm: 'Importar Shape', cancel: 'Cancelar' },
      confirmProps: { color: 'blue' },
      onConfirm: () => {
        if (checkedRows.includes(row.row_id)) handleCheckSingleRow(row.row_id); // Uncheck the row if it was checked
        controller.onUploadSingleInit(row);
      },
    });
  };

  const handleDeleteSingleRow = (row) => {
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
      onConfirm: () => {
        handleCheckSingleRow(row.row_id); // Uncheck the row
        console.log(row);
      },
    });
  };

  const handleUploadBulkInit = () => {
    openConfirmModal({
      title: (
        <Text size={'lg'} fw={700}>
          Importar {checkedRows.length} Shapes?
        </Text>
      ),
      centered: true,
      closeOnClickOutside: true,
      children: (
        <Stack>
          <Text>Se uma shape com o mesmo Código já existir, será atualizada com os pontos desta nova importação. Se não existir, então será criada uma nova shape.</Text>
          <Code style={{ fontSize: '14px' }}>Total de Shapes a importar: {checkedRows.length}</Code>
        </Stack>
      ),
      labels: { confirm: 'Iniciar Importação', cancel: 'Ainda Não' },
      confirmProps: { color: 'blue' },
      onConfirm: () => {
        setCheckedRows([]);
        controller.onUploadBulkInit(checkedRows);
      },
    });
  };

  const handleReset = () => {
    openConfirmModal({
      title: (
        <Text size={'lg'} fw={700}>
          Cancelar importação e limpar lista?
        </Text>
      ),
      centered: true,
      closeOnClickOutside: true,
      children: (
        <Stack>
          <Text>A importação será cancelada.</Text>
        </Stack>
      ),
      labels: { confirm: 'Cancelar Importação e Limpar Lista', cancel: 'Voltar' },
      confirmProps: { color: 'red' },
      onConfirm: () => {
        setCheckedRows([]);
        controller.onReset();
      },
    });
  };

  //
  // 1. Render components

  const IdleRow = ({ row }) => {
    //
    const isThisRowChecked = checkedRows.includes(row.row_id);
    //
    return (
      <TableBodyRow checked={isThisRowChecked}>
        <TableCellBody>
          <Checkbox aria-label='Selecionar linha' checked={isThisRowChecked} onChange={() => handleCheckSingleRow(row.row_id)} transitionDuration={0} />
        </TableCellBody>
        <TableCellBody onClick={() => handleCheckSingleRow(row.row_id)} style={{ cursor: 'pointer' }}>
          {row.item.shape_code || '-'}
        </TableCellBody>
        <TableCellBody>{row.item.shape_extension || 0} km</TableCellBody>
        <TableCellBody>{row.item.points.length}</TableCellBody>
        <TableCellBody>
          <Flex>
            <ActionIcon size='lg' color='blue' onClick={() => handleUploadSingleRow(row)}>
              <TbCloudUpload size='20px' />
            </ActionIcon>
            <ActionIcon size='lg' color='red' onClick={() => handleDeleteSingleRow(row)}>
              <TbTrash size='20px' />
            </ActionIcon>
          </Flex>
        </TableCellBody>
      </TableBodyRow>
    );
  };

  const UploadingRow = ({ row }) => {
    return (
      <TableBodyRow>
        <TableCellBody>
          <ActionIcon size='lg' color='blue' loading />
        </TableCellBody>
        <TableCellBody>{row.item.shape_code || '-'}</TableCellBody>
        <TableCellBody>{row.item.shape_extension || 0} km</TableCellBody>
        <TableCellBody>{row.item.points.length}</TableCellBody>
        <TableCellBody />
      </TableBodyRow>
    );
  };

  const UploadedRow = ({ row }) => {
    return (
      <TableBodyRow uploaded>
        <TableCellBody>
          <ActionIcon size='sm' color='green' variant='transparent' aria-label='Shape uploaded'>
            <TbCircleCheckFilled size='20px' />
          </ActionIcon>
        </TableCellBody>
        <TableCellBody>{row.item.shape_code || '-'}</TableCellBody>
        <TableCellBody>{row.item.shape_extension || 0} km</TableCellBody>
        <TableCellBody>{row.item.points.length}</TableCellBody>
        <TableCellBody />
      </TableBodyRow>
    );
  };

  const ErrorRow = ({ row }) => {
    return (
      <TableBodyRow error>
        <TableCellBody>
          <ActionIcon size='sm' color='red' variant='transparent' aria-label='Error uploading'>
            <TbAlertTriangleFilled size='20px' />
          </ActionIcon>
        </TableCellBody>
        <TableCellBody>{row.item.shape_code || '-'}</TableCellBody>
        <TableCellBody>{row.item.shape_extension || 0} km</TableCellBody>
        <TableCellBody>{row.item.points.length}</TableCellBody>
        <TableCellBody>
          <Tooltip label='Tentar Novamente' position='left' color='gray' withArrow>
            <ActionIcon size='lg' variant='default' aria-label='Shape uploaded'>
              <TbCloudUpload size='20px' />
            </ActionIcon>
          </Tooltip>
        </TableCellBody>
      </TableBodyRow>
    );
  };

  //
  // 1. Render components

  return (
    <Pannel
      header={
        <>
          <ActionIcon size='lg' onClick={handleReset}>
            <TbX size='20px' />
          </ActionIcon>
          <HeaderTitle text='shjdh' />
        </>
      }
      footer={
        <SimpleGrid cols={2} w='100%'>
          <Button onClick={handleUploadBulkInit} disabled={!checkedRows.length}>
            Iniciar Importação de {checkedRows.length} shapes
          </Button>
          <Button color='red' onClick={handleReset}>
            Cancelar e Limpar Lista
          </Button>
        </SimpleGrid>
      }
    >
      <TableHeader>
        <TableCellHeader>
          <Checkbox
            aria-label='Selecionar todas'
            checked={checkedRows.length === controller.allRows.length}
            indeterminate={checkedRows.length > 0 && checkedRows.length !== controller.allRows.length}
            onChange={handleCheckAllRows}
            transitionDuration={0}
          />
        </TableCellHeader>
        <TableCellHeader>shape_code</TableCellHeader>
        <TableCellHeader>Extensão</TableCellHeader>
        <TableCellHeader>Número de Pontos</TableCellHeader>
      </TableHeader>
      <TableBody>
        {controller.allRows.map((row) => {
          // Is this row uploading?
          if (controller.currentlyUploadingRow && controller.currentlyUploadingRow.row_id === row.row_id) {
            return <UploadingRow key={row.row_id} row={row} />;
          }
          // Is this row pending?
          else if (controller.pendingRows.find((elem) => elem && elem.row_id === row.row_id)) {
            return <UploadingRow key={row.row_id} row={row} />;
          }
          // Is this row uploaded?
          else if (controller.uploadedRows.find((elem) => elem && elem.row_id === row.row_id)) {
            return <UploadedRow key={row.row_id} row={row} />;
          }
          // If not, put the idle row
          else return <IdleRow key={row.row_id} row={row} />;
        })}
      </TableBody>
    </Pannel>
  );

  //
}
