'use client';

import useSWR from 'swr';
import { styled } from '@stitches/react';
import { TbArrowMoveRight, TbArrowMoveLeft, TbChevronRight, TbAlertTriangleFilled } from 'react-icons/tb';
import { Skeleton } from '@mantine/core';

const Container = styled('div', {
  display: 'flex',
  flexDirection: 'row',
  width: '100%',
  marginBottom: '$md',
  overflow: 'hidden',
  borderRadius: '$md',
  border: '1px solid $gray4',
  backgroundColor: '$gray0',
  variants: {
    clickable: {
      true: {
        transition: 'box-shadow 300ms ease, background-color 300ms ease',
        cursor: 'pointer',
        '&:hover': {
          boxShadow: '$xs',
          backgroundColor: '$gray0',
        },
        '&:active': {
          backgroundColor: '$gray1',
        },
      },
    },
  },
});

const DirectionIcon = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '$md',
});

const Toolbar = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '$md',
  color: '$gray5',
  transition: 'color 300ms ease',
  '&:hover': {
    color: '$gray8',
  },
  '&:active': {
    color: '$gray8',
  },
});

const Wrapper = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'start',
  width: '100%',
  gap: '$sm',
  padding: '$md',
});

const Text = styled('p', {
  lineHeight: '1',
  variants: {
    isUntitled: {
      true: {
        color: '$gray6',
        fontWeight: '$regular',
        fontStyle: 'italic',
      },
    },
  },
});

const Title = styled(Text, {
  fontSize: '18px',
  color: '$gray12',
  fontWeight: '$medium',
  lineHeight: '1',
});

const Subtitle = styled(Text, {
  fontSize: '14px',
  color: '$gray8',
  fontWeight: '$medium',
  lineHeight: '1',
});

export default function PatternCard({ pattern_id, direction, onOpen }) {
  //

  //
  // A. Setup variables

  //
  // B. Fetch data

  const { data: patternData, error: patternError, isLoading: patternLoading } = useSWR(pattern_id && `/api/patterns/${pattern_id}`);

  //
  // E. Render components

  const WhenLoading = () => (
    <Container>
      <Toolbar>
        <DirectionIcon>{direction > 0 ? <TbArrowMoveRight size='30px' /> : <TbArrowMoveLeft size='30px' />}</DirectionIcon>
      </Toolbar>
      <Wrapper>
        <Skeleton height={20} width='30%' radius='sm' />
        <Skeleton height={25} width='100%' radius='sm' />
      </Wrapper>
    </Container>
  );

  const WhenError = () => (
    <Container>
      <Toolbar>
        <TbAlertTriangleFilled size='20px' />
      </Toolbar>
      <Wrapper>
        <Title>Ocorreu um erro</Title>
        <Subtitle>{patternError && patternError.message ? patternError.message : 'Não foi possível carregar este pattern.'}</Subtitle>
      </Wrapper>
    </Container>
  );

  const WhenLoaded = () => (
    <Container clickable>
      <Toolbar>
        <DirectionIcon>{direction > 0 ? <TbArrowMoveRight size='30px' /> : <TbArrowMoveLeft size='30px' />}</DirectionIcon>
      </Toolbar>
      <Wrapper>
        <Subtitle>{direction > 0 ? 'Outbound' : 'Inbound'}</Subtitle>
        <Title isUntitled={!patternData.headsign}>{patternData.headsign ? patternData.headsign : 'Pattern sem Headsign'}</Title>
      </Wrapper>
      <Toolbar>
        <TbChevronRight size='20px' />
      </Toolbar>
    </Container>
  );

  if (patternLoading) return <WhenLoading />;
  else if (patternError) return <WhenError />;
  else if (patternData) return <WhenLoaded />;

  //
}
