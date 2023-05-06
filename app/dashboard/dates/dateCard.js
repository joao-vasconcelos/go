'use client';

import { styled } from '@stitches/react';
import { useDisclosure } from '@mantine/hooks';
import { Modal } from '@mantine/core';
import dayjs from 'dayjs';

const CardDefault = styled('div', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  height: '100%',
  fontSize: '14px',
  fontWeight: '$medium',
});

const Spacer = styled(CardDefault, {
  backgroundColor: '$gray0',
});

const Placeholder = styled(CardDefault, {
  backgroundColor: '$gray1',
  color: '$gray3',
});

const DateCardContainer = styled(CardDefault, {
  color: '$info9',
  //   boxShadow: '$md',
  cursor: 'pointer',
  border: '1px solid transparent',
  backgroundColor: '$info1',
  transition: 'all 300ms ease',
  '&:hover': {
    border: '1px solid $gray0',
    boxShadow: '$md',
    transform: 'scale(1.1)',
    color: '$info9',
    backgroundColor: '$info2',
  },
  '&:active': {
    boxShadow: '$md',
    transform: 'scale(1.05)',
    color: '$info9',
    backgroundColor: '$info3',
  },
});

export default function DateCard({ cardType, date, period }) {
  //

  const [isModalPresented, { open: openModal, close: closeModal }] = useDisclosure(false);

  const dayString = dayjs(date).format('DD');

  switch (cardType) {
    default:
    case 'spacer':
      return <Spacer />;

    case 'placeholder':
      return <Placeholder>{dayString}</Placeholder>;

    case 'date':
      return (
        <>
          <Modal opened={isModalPresented} onClose={closeModal} title='Authentication' size='auto' centered>
            {date}
          </Modal>
          <DateCardContainer onClick={openModal}>{dayString}</DateCardContainer>
        </>
      );
  }
}
