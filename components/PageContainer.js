import { Group, Loader, LoadingOverlay, Progress } from '@mantine/core';
import { styled } from '../stitches.config';
import { Spacer } from './LayoutUtils';
import { TbChevronRight } from 'react-icons/tb';

/* * */
/* PAGE CONTAINER */
/* Explanation needed. */
/* * */

const Container = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '$md',
  position: 'relative',
  padding: '$md',
});

const Title = styled('p', {
  fontSize: '30px',
  fontWeight: '$bold',
});

const Contents = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '$md',
});

export default function PageContainer({ loading, title = [], children }) {
  return (
    <Container>
      <Group>
        <Group spacing={'sm'}>
          {title.length &&
            title.map((segment, index) => {
              return (
                <>
                  {index > 0 && <TbChevronRight />}
                  <Title key={index}>{segment || '•••'}</Title>
                </>
              );
            })}
        </Group>
        <Spacer width={'full'} />
        {loading && <Loader color='gray' size='sm' />}
      </Group>
      <Contents>{children}</Contents>
    </Container>
  );
}
