'use client';

import { styled } from '@stitches/react';
import { Draggable } from '@hello-pangea/dnd';
import { TbChevronUp, TbChevronDown, TbChevronRight, TbGripVertical } from 'react-icons/tb';

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
  padding: '$sm',
  fontSize: '14px',
});

const TableCellHeader = styled(TableCell, {
  minHeight: '45px',
  fontWeight: '$medium',
});

const TableCellBody = styled(TableCell, {
  minHeight: '60px',
});

const Container = styled('div', {
  display: 'flex',
  flexDirection: 'row',
  //   alignItems: 'center',
  width: '100%',
  //   marginBottom: '$md',
  overflow: 'hidden',
  border: '1px solid $gray4',
  borderBottom: 'none',
  //   borderRadius: '$md',
  backgroundColor: '$gray0',
  transition: 'box-shadow 300ms ease, background-color 300ms ease',
  cursor: 'pointer',
  '&:hover': {
    // boxShadow: '$xs',
    backgroundColor: '$gray0',
  },
  '&:active': {
    backgroundColor: '$gray1',
  },
});

const Toolbar = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '$md',
  color: '$gray5',
  transition: 'color 300ms ease',
  '&:hover': {
    color: '$gray8',
  },
  '&:active': {
    color: '$gray8',
  },
});

const Wrapper = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'start',
  width: '100%',
  gap: '$sm',
  padding: '$md',
});

const Text = styled('p', {
  lineHeight: '1',
  variants: {
    isUntitled: {
      true: {
        color: '$gray6',
        fontWeight: '$regular',
        fontStyle: 'italic',
      },
    },
  },
});

const Title = styled(Text, {
  fontSize: '18px',
  color: '$gray12',
  fontWeight: '$medium',
  lineHeight: '1',
});

const Subtitle = styled(Text, {
  fontSize: '14px',
  color: '$gray8',
  fontWeight: '$bold',
  lineHeight: '1',
});

export default function StopSequenceCard({ index }) {
  //

  return (
    <Draggable draggableId={index.toString()} index={index}>
      {(provided) => (
        <TableBodyRow ref={provided.innerRef} {...provided.draggableProps}>
          <TableCellBody {...provided.dragHandleProps}>
            <TbGripVertical size='20px' />
          </TableCellBody>
          <TableCellBody onClick={() => handleCheckSingleRow(row.row_id)} style={{ cursor: 'pointer' }}>
            {index}
          </TableCellBody>
          <TableCellBody>{index || 0} km</TableCellBody>
          <TableCellBody>{index}</TableCellBody>
          <TableCellBody>
            {/* <Flex>
              <ActionIcon size='lg' color='blue' onClick={() => handleUploadSingleRow(row)}>
                <TbCloudUpload size='20px' />
              </ActionIcon>
              <ActionIcon size='lg' color='red' onClick={() => handleDeleteSingleRow(row)}>
                <TbTrash size='20px' />
              </ActionIcon>
            </Flex> */}
          </TableCellBody>
        </TableBodyRow>
      )}
    </Draggable>
  );

  return (
    <Draggable draggableId={index.toString()} index={index}>
      {(provided) => (
        <Container ref={provided.innerRef} {...provided.draggableProps}>
          <Toolbar {...provided.dragHandleProps}>
            <TbChevronUp size='20px' />
            <TbChevronDown size='20px' />
          </Toolbar>
          <Wrapper>
            {/* <Subtitle isUntitled={!stop_code}>{stop_code ? stop_code : '000000'}</Subtitle> */}
            {/* <Title isUntitled={!stop_name}>{stop_name ? stop_name : 'Paragem Sem Nome'}</Title> */}
          </Wrapper>
          <Toolbar>
            <TbChevronRight size='20px' />
          </Toolbar>
        </Container>
      )}
    </Draggable>
  );
}
