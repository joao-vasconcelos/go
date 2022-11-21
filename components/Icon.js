import { styled } from '../stitches.config';
import Button from './Button';

/* * */
/* ICONBUTTON */
/* Explanation needed. */
/* * */

/* * */
/* STYLES */

const IconWrapper = styled(Button, {
  margin: 0,
  width: '0',
  width: 'unset',
  // aspectRatio: '9/8',
});

export default function Icon({ children, ...props }) {
  //
  return <IconWrapper {...props}>{children}</IconWrapper>;
}
