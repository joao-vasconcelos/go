'use client';

import { styled } from '@stitches/react';
import { useDisclosure } from '@mantine/hooks';
import { Modal, SimpleGrid, TextInput, Select, Stack, Title, Button } from '@mantine/core';
import dayjs from 'dayjs';

const CardDefault = styled('div', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  height: '100%',
  fontSize: '12px',
  fontWeight: '$medium',
});

const Spacer = styled(CardDefault, {
  backgroundColor: '$gray0',
});

const Placeholder = styled(CardDefault, {
  backgroundColor: '$gray0',
  color: '$gray2',
});

const DateCardContainer = styled(CardDefault, {
  color: '$info9',
  cursor: 'pointer',
  border: '1px solid transparent',
  backgroundColor: '$gray3',
  transition: 'all 100ms ease',
  '&:hover': {
    // border: '1px solid $gray0',
    boxShadow: '$md',
    color: '$info9',
    backgroundColor: '$info2',
  },
  '&:active': {
    border: '1px solid $gray0',
    boxShadow: '$md',
    transform: 'scale(1.05)',
    color: '$info9',
    backgroundColor: '$info3',
  },
  variants: {
    selected: {
      true: {
        border: '1px solid $gray0',
        boxShadow: '$md',
        transform: 'scale(1.2)',
        color: '$gray0',
        backgroundColor: '$info9',
      },
    },
    active: {
      true: {
        color: '$gray0',
        backgroundColor: '$info9',
        '&:hover': {
          color: '$gray0',
          backgroundColor: '$info9',
        },
      },
    },
  },
});

export default function DateCardToggle({ cardType, dateObj, date, period, onToggleDate }) {
  //

  //
  // A. Setup variables

  const [isModalPresented, { open: openModal, close: closeModal }] = useDisclosure(false);

  const dayString = dayjs(date).format('D');
  const fullDateString = dayjs(date).locale('pt').format('dddd, DD MMM YYYY');

  const handleToggleDate = () => {
    onToggleDate(dateObj);
  };

  const handleToggleMonth = () => {
    onToggleDate(dateObj);
  };

  const handleEditDate = (event) => {
    event.preventDefault();
    openModal();
  };

  //
  // B. Render components

  const DateCardSelectable = () => {};

  switch (cardType) {
    default:
    case 'spacer':
      return <Spacer />;

    case 'placeholder':
      return <Placeholder>{dayString}</Placeholder>;

    case 'date':
      return (
        <>
          <Modal opened={isModalPresented} onClose={closeModal} title='Authentication' size='500px' centered>
            <SimpleGrid cols={1}>
              <Stack cols={1}>
                <Title>{fullDateString}</Title>
                <Select
                  label='Período'
                  placeholder='Período'
                  searchable
                  nothingFound='Sem opções'
                  data={[
                    { value: 1, label: '1 - Período Escolar' },
                    { value: 2, label: '2 - Período de Férias Escolares' },
                    { value: 3, label: '3 - Período de Verão' },
                  ]}
                />
                <Select
                  label='Feriado'
                  placeholder='Feriado'
                  searchable
                  nothingFound='Sem opções'
                  data={[
                    { value: 0, label: '0 - As datas escolhidas não são Feriado' },
                    { value: 1, label: '1 - Definir estas datas como Feriado' },
                  ]}
                />
              </Stack>
              <Button size='lg'>Adicionar estas datas</Button>
              <Button size='lg' variant='light' color='red'>
                Eliminar estas datas
              </Button>
            </SimpleGrid>
          </Modal>
          <DateCardContainer active={dateObj.active} selected={isModalPresented} onClick={handleToggleDate} onContextMenu={handleEditDate}>
            {dayString}
          </DateCardContainer>
        </>
      );
  }
}
