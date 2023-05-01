'use client';

import { styled } from '@stitches/react';
import { Tooltip, Select, MultiSelect, TextInput, ActionIcon, Chip, Divider } from '@mantine/core';
import { TbExternalLink, TbSquaresFilled, TbTrash } from 'react-icons/tb';

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
        <div>ROUTE (1234) São Pedro Sintra (Chão Meninos) - Mira Sintra (Junta Freguesia)</div>
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
          <SectionTitle>Detalhes da Linha</SectionTitle>
          <Flex>
            <TextInput placeholder='1234' label='Número da Linha' miw={'200px'} />
            <TextInput placeholder='Origem - Destino' label='Nome da Linha' w={'100%'} />
          </Flex>
          <Flex>
            <MultiSelect label='Agência(s)' placeholder='Operadores(s) afetos' searchable nothingFound='Sem opções' w={'100%'} data={['41 - Viação Alvorada', '42 - Rodoviária de Lisboa', '43 - TST', '44 - Alsa Todi']} />
          </Flex>
          <Flex>
            <Select label='Tarifário' placeholder='Tipo de Linha' searchable nothingFound='Sem opções' w={'100%'} data={['Rápida', 'Longa', 'Próxima', 'Mar', 'Inter-regional']} />
          </Flex>
        </Section>
        <Divider />
        <Section>
          <SectionTitle>Atributos</SectionTitle>
          <Flex>
            <Chip variant='filled'>Linha Circular</Chip>
            <Chip variant='filled'>Permite Mobilidade Reduzida</Chip>
            <Chip variant='filled'>Permite Bicicletas</Chip>
          </Flex>
          <Flex>
            <Select label='Propulsão' placeholder='Tipo de veículo' searchable nothingFound='Sem opções' data={['Elétrico', 'Gás Natural', 'Diesel']} />
            <Select label='Propulsão' placeholder='Tipo de veículo' searchable nothingFound='Sem opções' data={['Elétrico', 'Gás Natural', 'Diesel']} />
          </Flex>
        </Section>
        <Divider />
        <Section>
          <SectionTitle>Rotas</SectionTitle>
          <Flex>
            <Chip variant='filled'>Linha Circular</Chip>
            <Chip variant='filled'>Permite Mobilidade Reduzida</Chip>
            <Chip variant='filled'>Permite Bicicletas</Chip>
          </Flex>
          <Flex>
            <Select label='Propulsão' placeholder='Tipo de veículo' searchable nothingFound='Sem opções' data={['Elétrico', 'Gás Natural', 'Diesel']} />
            <Select label='Propulsão' placeholder='Tipo de veículo' searchable nothingFound='Sem opções' data={['Elétrico', 'Gás Natural', 'Diesel']} />
          </Flex>
        </Section>
      </Body>
    </Container>
  );
}
