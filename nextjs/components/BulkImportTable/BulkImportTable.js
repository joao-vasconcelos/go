'use client';

import { ActionIcon, Button, Checkbox, Code, Flex, SimpleGrid, Stack, Text, Tooltip } from '@mantine/core';
import { openConfirmModal } from '@mantine/modals';
import { styled } from '@stitches/react';
import { IconAlertTriangleFilled, IconCircleCheckFilled, IconCloudUpload, IconRotateClockwise2, IconTrash, IconX } from '@tabler/icons-react';
import { useState } from 'react';

import Pannel from '../Pannel/Pannel';
import HeaderTitle from '../lists/HeaderTitle';

const TableRow = styled('div', {
	alignItems: 'center',
	display: 'grid',
	gridTemplateColumns: '60px repeat(3, 1fr) 120px',
	width: '100%',
});

const TableHeader = styled(TableRow, {
	backgroundColor: '$gray4',
	borderBottom: '1px solid $gray5',
});

const TableBody = styled('div', {
	backgroundColor: '$gray5',
	display: 'flex',
	flexDirection: 'column',
	gap: '1px',
	overflow: 'scroll',
	width: '100%',
});

const TableBodyRow = styled(TableRow, {
	'&:hover': {
		backgroundColor: '$gray1',
	},
	'backgroundColor': '$gray0',
	'variants': {
		checked: {
			true: {
				'&:hover': {
					backgroundColor: '$gray3',
				},
				'backgroundColor': '$gray2',
			},
		},
		error: {
			true: {
				'&:hover': {
					backgroundColor: '$danger0',
				},
				'backgroundColor': '$danger0',
				'color': '$danger9',
			},
		},
		uploaded: {
			true: {
				'&:hover': {
					backgroundColor: '$success0',
				},
				'backgroundColor': '$success0',
				'color': '$success9',
			},
		},
	},
});

const TableCell = styled('div', {
	alignItems: 'center',
	display: 'flex',
	fontSize: '14px',
	padding: '$sm $lg',
	width: '100%',
});

const TableCellHeader = styled(TableCell, {
	fontWeight: '$medium',
	minHeight: '45px',
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
			if (current.includes(row_id)) return current.filter(item => item !== row_id);
			else return [...current, row_id];
		});
	};

	const handleCheckAllRows = () => {
		setCheckedRows((current) => {
			if (current.length === controller.allRows.length) return [];
			else return controller.allRows.map(row => row.row_id);
		});
	};

	const handleUploadSingleRow = (row) => {
		openConfirmModal({
			centered: true,
			children: (
				<Flex direction="column">
					<Text>Se uma shape com o mesmo ID já existir, será atualizada com os pontos desta nova importação. Se não existir, então será criada uma nova shape.</Text>
					<Code style={{ fontSize: '14px' }}>code: {row.item.code}</Code>
					<Code style={{ fontSize: '14px' }}>distance: {row.item.distance}</Code>
					<Code style={{ fontSize: '14px' }}>points_count: {row.item.points_count}</Code>
				</Flex>
			),
			closeOnClickOutside: true,
			confirmProps: { color: 'blue' },
			labels: { cancel: 'Cancelar', confirm: 'Importar Shape' },
			onConfirm: () => {
				if (checkedRows.includes(row.row_id)) handleCheckSingleRow(row.row_id); // Uncheck the row if it was checked
				controller.onUploadSingleInit(row);
			},
			title: (
				<Text fw={700} size="lg">
					Importar esta Shape?
				</Text>
			),
		});
	};

	const handleDeleteSingleRow = (row) => {
		openConfirmModal({
			centered: true,
			children: <Text>Se remover a shape da tabela de importação, terá de importar o ficheiro novamente para que volte a ficar disponível.</Text>,
			closeOnClickOutside: true,
			confirmProps: { color: 'red' },
			labels: { cancel: 'Não Remover', confirm: 'Remover Shape' },
			onConfirm: () => {
				handleCheckSingleRow(row.row_id); // Uncheck the row
				console.log(row);
			},
			title: (
				<Text fw={700} size="lg">
					Remover Shape da Tabela de Importação?
				</Text>
			),
		});
	};

	const handleUploadBulkInit = () => {
		openConfirmModal({
			centered: true,
			children: (
				<Stack>
					<Text>Se uma shape com o mesmo Código já existir, será atualizada com os pontos desta nova importação. Se não existir, então será criada uma nova shape.</Text>
					<Code style={{ fontSize: '14px' }}>Total de Shapes a importar: {checkedRows.length}</Code>
				</Stack>
			),
			closeOnClickOutside: true,
			confirmProps: { color: 'blue' },
			labels: { cancel: 'Ainda Não', confirm: 'Iniciar Importação' },
			onConfirm: () => {
				setCheckedRows([]);
				controller.onUploadBulkInit(checkedRows);
			},
			title: (
				<Text fw={700} size="lg">
					Importar {checkedRows.length} Shapes?
				</Text>
			),
		});
	};

	const handleReset = () => {
		openConfirmModal({
			centered: true,
			children: (
				<Stack>
					<Text>A importação será cancelada.</Text>
				</Stack>
			),
			closeOnClickOutside: true,
			confirmProps: { color: 'red' },
			labels: { cancel: 'Voltar', confirm: 'Cancelar Importação e Limpar Lista' },
			onConfirm: () => {
				setCheckedRows([]);
				controller.onReset();
			},
			title: (
				<Text fw={700} size="lg">
					Cancelar importação e limpar lista?
				</Text>
			),
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
					<Checkbox aria-label="Selecionar linha" checked={isThisRowChecked} onChange={() => handleCheckSingleRow(row.row_id)} transitionDuration={0} />
				</TableCellBody>
				<TableCellBody onClick={() => handleCheckSingleRow(row.row_id)} style={{ cursor: 'pointer' }}>
					{row.item.code || '-'}
				</TableCellBody>
				<TableCellBody>{row.item.distance || 0} km</TableCellBody>
				<TableCellBody>{row.item.points.length}</TableCellBody>
				<TableCellBody>
					<Flex>
						<ActionIcon color="blue" onClick={() => handleUploadSingleRow(row)} size="lg">
							<IconCloudUpload size="20px" />
						</ActionIcon>
						<ActionIcon color="red" onClick={() => handleDeleteSingleRow(row)} size="lg">
							<IconTrash size="20px" />
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
					<ActionIcon color="blue" size="lg" loading />
				</TableCellBody>
				<TableCellBody>{row.item.code || '-'}</TableCellBody>
				<TableCellBody>{row.item.distance || 0} km</TableCellBody>
				<TableCellBody>{row.item.points.length}</TableCellBody>
				<TableCellBody />
			</TableBodyRow>
		);
	};

	const UploadedRow = ({ row }) => {
		return (
			<TableBodyRow uploaded>
				<TableCellBody>
					<ActionIcon aria-label="Shape uploaded" color="green" size="sm" variant="transparent">
						<IconCircleCheckFilled size="20px" />
					</ActionIcon>
				</TableCellBody>
				<TableCellBody>{row.item.code || '-'}</TableCellBody>
				<TableCellBody>{row.item.distance || 0} km</TableCellBody>
				<TableCellBody>{row.item.points.length}</TableCellBody>
				<TableCellBody />
			</TableBodyRow>
		);
	};

	const ErrorRow = ({ row }) => {
		return (
			<TableBodyRow error>
				<TableCellBody>
					<ActionIcon aria-label="Error uploading" color="red" size="sm" variant="transparent">
						<IconAlertTriangleFilled size="20px" />
					</ActionIcon>
				</TableCellBody>
				<TableCellBody>{row.item.code || '-'}</TableCellBody>
				<TableCellBody>{row.item.distance || 0} km</TableCellBody>
				<TableCellBody>{row.item.points.length}</TableCellBody>
				<TableCellBody>
					<Tooltip color="gray" label="Tentar Novamente" position="left" withArrow>
						<ActionIcon aria-label="Shape uploaded" size="lg" variant="default">
							<IconCloudUpload size="20px" />
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
			footer={(
				<SimpleGrid cols={2} w="100%">
					<Button disabled={!checkedRows.length} onClick={handleUploadBulkInit}>
						Iniciar Importação de {checkedRows.length} shapes
					</Button>
					<Button color="red" onClick={handleReset}>
						Cancelar e Limpar Lista
					</Button>
				</SimpleGrid>
			)}
			header={(
				<>
					<ActionIcon onClick={handleReset} size="lg">
						<IconX size="20px" />
					</ActionIcon>
					<HeaderTitle text="Import Shapes" />
				</>
			)}
		>
			<TableHeader>
				<TableCellHeader>
					<Checkbox
						aria-label="Selecionar todas"
						checked={checkedRows.length === controller.allRows.length}
						indeterminate={checkedRows.length > 0 && checkedRows.length !== controller.allRows.length}
						onChange={handleCheckAllRows}
						transitionDuration={0}
					/>
				</TableCellHeader>
				<TableCellHeader>code</TableCellHeader>
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
					else if (controller.pendingRows.find(elem => elem && elem.row_id === row.row_id)) {
						return <UploadingRow key={row.row_id} row={row} />;
					}
					// Is this row uploaded?
					else if (controller.uploadedRows.find(elem => elem && elem.row_id === row.row_id)) {
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
