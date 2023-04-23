import useSWR from 'swr';
import { useRouter } from 'next/navigation';
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
  const router = useRouter();
  const { data: version } = useSWR('/api/version');

  if (version && version.latest != pjson.version) {
    router.reload();
  }

  return (
    <Container>
      <TbCloudFilled size={'14px'} />
      <span>{pjson.version}</span>
    </Container>
  );
}
