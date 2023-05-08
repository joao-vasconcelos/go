import { styled } from '@stitches/react';
import { TbCloudFilled } from 'react-icons/tb';
import pjson from '../../package.json';

const Container = styled('div', {
  display: 'flex',
  alignItems: 'center',
  gap: '$sm',
  color: '$success5',
  fontSize: '$sm',
  fontWeight: 700,
  lineHeight: 1,
});

export default function Component() {
  return (
    <Container>
      <TbCloudFilled size={'14px'} />
      <span>{pjson.version}</span>
    </Container>
  );
}
