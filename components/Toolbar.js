import { styled } from '../stitches.config';

const Container = styled('div', {
  display: 'flex',
  flexDirection: 'row',
  marginBottom: '$sm',
  gap: '$md',
});

export default function Toolbar({ children }) {
  return <Container>{children}</Container>;
}
