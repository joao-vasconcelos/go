'use client';

import { styled } from '@stitches/react';
import { Tooltip, Select, Button, MultiSelect, SegmentedControl, TextInput, ActionIcon, Chip, Divider } from '@mantine/core';
import { TbExternalLink, TbTextPlus, TbSquaresFilled, TbTrash } from 'react-icons/tb';

const Container = styled('div', {
  display: 'grid',
  gridTemplateColumns: '1fr',
  gridTemplateRows: '50px 1fr',
  width: '100%',
  backgroundColor: '#ffffff',
  border: '1px solid rgba(0,0,0,0.1)',
  borderRadius: '3px',
  boxShadow: 'md',
  position: 'absolute',
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
  overflow: 'auto',
});

const Header = styled('div', {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '$sm',
  padding: '$md',
  width: '100%',
  borderBottom: '1px solid rgba(0,0,0,0.1)',
});

const Body = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  overflow: 'scroll',
});

const SectionTitle = styled('p', {
  fontSize: '20px',
  fontWeight: 'bold',
  //   textTransform: 'uppercase',
  color: 'rgba(0,0,0,1)',
  //   paddingBottom: '10px',
});

const Flex = styled('div', {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: '$md',
});

const Section = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  padding: '$lg',
  gap: '$md',
  width: '100%',
  maxHeight: '100%',
});

export default function Page() {
  return (
    <Container>
      <Header>
        <div>PATTERN (1234) São Pedro Sintra (Chão Meninos) - Mira Sintra (Junta Freguesia)</div>
        <Flex>
          <Tooltip label='Ver no site' color='blue' position='bottom' withArrow>
            <ActionIcon color='blue' variant='light' size='lg'>
              <TbExternalLink size='20px' />
            </ActionIcon>
          </Tooltip>
          <Tooltip label='Duplicar linha' color='blue' position='bottom' withArrow>
            <ActionIcon color='blue' variant='light' size='lg'>
              <TbSquaresFilled size='20px' />
            </ActionIcon>
          </Tooltip>
          <Tooltip label='Eliminar Linha' color='red' position='bottom' withArrow>
            <ActionIcon color='red' variant='light' size='lg'>
              <TbTrash size='20px' />
            </ActionIcon>
          </Tooltip>
        </Flex>
      </Header>
      <Body>
        <Section>
          <SectionTitle>Pattern</SectionTitle>
          <Flex>
            <SegmentedControl
              data={[
                { label: 'Inbound', value: '0' },
                { label: 'Outbound', value: '1' },
              ]}
            />
          </Flex>
          <Flex>
            <TextInput placeholder='1234' label='Headsign' w={'100%'} />
          </Flex>
        </Section>
        <Divider />
        <Section>
          <SectionTitle>Percurso</SectionTitle>
          <Flex>
            <Select label='Shape' placeholder='Tipo de Linha' searchable clearable nothingFound='Sem opções' w={'100%'} data={['Rápida', 'Longa', 'Próxima', 'Mar', 'Inter-regional']} />
          </Flex>
          <Flex>
            <Button leftIcon={<TbTextPlus size='20px' />} variant='subtle' color='gray'>
              Importar nova shape
            </Button>
          </Flex>
        </Section>
        <Divider />
        <Section>
          <SectionTitle>Paragens</SectionTitle>
          table
        </Section>
        <Divider />
        <Section>
          <SectionTitle>Horários</SectionTitle>
          table
        </Section>
      </Body>
    </Container>
  );
}
