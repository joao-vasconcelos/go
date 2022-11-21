import { styled } from '@stitches/react';
import { useContext } from 'react';
import { Appstate } from '../context/Appstate';
import Button from './Button';

/* * */
/* PANNEL */
/* Explanation needed. */
/* * */

/* */
/* STYLES */

const Container = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '$lg',
  boxShadow: '$lg',
  borderWidth: '$md',
  borderStyle: 'solid',
  borderRadius: '$md',
  maxWidth: '400px',
  padding: '$md',
  backgroundColor: '$gray1',
  variants: {
    color: {
      primary: {
        borderColor: '$primary6',
      },
      secondary: {
        borderColor: '$gray7',
      },
      danger: {
        borderColor: '$danger5',
      },
    },
  },
  defaultVariants: {
    color: 'secondary',
  },
});

const Title = styled('p', {
  color: '$gray12',
  fontSize: '$lg',
  fontWeight: '$bold',
  textTransform: 'uppercase',
  variants: {
    color: {
      danger: {
        color: '$danger5',
      },
    },
  },
});

const MessagesWrapper = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '$md',
  padding: '$xs',
  width: '100%',
});

const Subtitle = styled('p', {
  color: '$gray12',
  fontSize: '$lg',
  fontWeight: '$regular',
  textAlign: 'center',
});

const Message = styled('p', {
  color: '$gray11',
  fontSize: '15px',
  fontWeight: '$regular',
  textAlign: 'center',
});

const ButtonsWrapper = styled('div', {
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  gap: '$md',
});

/* */
/* LOGIC */

export default function Alert({ title, subtitle, message, color, onConfirm, onCancel, ...props }) {
  //

  const appstate = useContext(Appstate);

  async function handleCancel() {
    if (onCancel) await onCancel();
    appstate.setOverlay();
  }

  async function handleConfirm() {
    await onConfirm();
    appstate.setOverlay();
  }

  return (
    <Container color={color} {...props}>
      <MessagesWrapper>
        {title && <Title color={color}>{title}</Title>}
        {subtitle && <Subtitle>{subtitle}</Subtitle>}
        {message && <Message>{message}</Message>}
      </MessagesWrapper>
      <ButtonsWrapper>
        <Button color={color} label={'Confirm'} onClick={handleConfirm} />
        <Button label={'Cancel'} onClick={handleCancel} />
      </ButtonsWrapper>
    </Container>
  );
}
