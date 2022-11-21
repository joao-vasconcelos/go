import { styled } from '../stitches.config';

/* * */
/* TEXT FIELD */
/* Explanation needed. */
/* * */

/* * */
/* STYLES */

const Input = styled('input', {
  border: 'none',
  outline: 'none',
  fontSize: '18px',
  fontWeight: '$regular',
  padding: '7px',
  paddingTop: '5px',
});

export default function TextField({ ...props }) {
  //
  return <Input {...props} />;
}
