import useSWR from 'swr';
import { useRouter } from 'next/router';
import { styled } from '@stitches/react';
import { IoCloudSharp } from 'react-icons/io5';
import pjson from '../package.json';

const ReloadButton = styled('div', {
  display: 'flex',
  alignItems: 'center',
  gap: '$sm',
  padding: '$sm $md',
  color: '$gray8',
  fontSize: '$sm',
  fontWeight: 700,
  lineHeight: 1,
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: '$success1',
    color: '$success8',
  },
});

export default function AppVersion() {
  const router = useRouter();
  const { data: version } = useSWR('/api/version');

  if (version && version.latest != pjson.version) {
    router.reload();
  }

  return (
    <ReloadButton>
      <IoCloudSharp />
      <span>Version {pjson.version}</span>
    </ReloadButton>
  );
}
