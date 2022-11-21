import { styled } from '../stitches.config';
import TextField from './TextField';
import Select from 'react-select';

/* * */
/* TEXT FIELD */
/* Explanation needed. */
/* * */

/* * */
/* STYLES */

const Label = styled('div', {
  fontSize: '12px',
  textTransform: 'uppercase',
  fontWeight: '$medium',
  color: '$gray10',
  borderBottomWidth: '$md',
  borderBottomStyle: 'solid',
  borderBottomColor: '$gray7',
  padding: '7px',
});

const Error = styled('div', {
  fontSize: '12px',
  textTransform: 'uppercase',
  fontWeight: '$medium',
  color: '$gray0',
  backgroundColor: '$warning5',
  padding: '7px',
});

const Container = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '2px',
  borderWidth: '$md',
  borderStyle: 'solid',
  borderColor: '$gray7',
  borderRadius: '$md',
  variants: {
    isError: {
      true: {
        borderColor: '$warning5',
        [`& ${Label}`]: {
          color: '$warning5',
          borderBottomColor: '$warning5',
        },
      },
    },
  },
});

export default function InputWrapper({ label, error, type, ...props }) {
  //

  let component;

  switch (type) {
    default:
    case 'text':
    case 'number':
      component = <TextField {...props} />;
      break;
    case 'select':
      component = <Select {...props} />;
      break;
  }

  return (
    <>
      <Container isError={error ? true : false}>
        {label && <Label>{label}</Label>}
        {component}
        {error && <Error>{error}</Error>}
      </Container>
    </>
  );
}
