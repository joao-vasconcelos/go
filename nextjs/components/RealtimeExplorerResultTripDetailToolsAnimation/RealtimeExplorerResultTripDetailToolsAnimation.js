'use client';

/* * */

import Standout from '@/components/Standout/Standout';
import { useRealtimeExplorerContext } from '@/contexts/RealtimeExplorerContext';
import { Button, SimpleGrid, Slider } from '@mantine/core';
import { IconKeyframes, IconPlayerPause, IconPlayerPlay } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

/* * */

const ANIMATION_SPEED = 200; // The faster the slower

/* * */

export default function RealtimeExplorerResultTripDetailToolsAnimation() {
  //

  //
  // A. Setup variables

  const t = useTranslations('RealtimeExplorerResultTripDetailToolsAnimation');
  const realtimeExplorerContext = useRealtimeExplorerContext();

  const [isPlaying, setIsPlaying] = useState(false);

  //
  // B. Transform data

  useEffect(() => {
    if (!isPlaying) return;
    if (realtimeExplorerContext.selectedTrip.event_animation_index > realtimeExplorerContext.selectedTrip.positions.length) {
      realtimeExplorerContext.updateEventAnimationIndex(0);
    }
    const animationInterval = setInterval(() => {
      realtimeExplorerContext.updateEventAnimationIndex(realtimeExplorerContext.selectedTrip.event_animation_index + 1);
    }, ANIMATION_SPEED);
    return () => clearInterval(animationInterval);
  }, [isPlaying, realtimeExplorerContext]);

  //
  // C. Handle actions

  const handleToggleAnimation = () => {
    setIsPlaying((prev) => !prev);
  };

  //
  // D. Render components

  return (
    <Standout icon={<IconKeyframes size={20} />} title={t('title')} description={t('description')} collapsible defaultOpen={false}>
      <SimpleGrid cols={2} style={{ alignSelf: 'flex-start' }}>
        <Button size="xs" variant="light" color={isPlaying ? 'orange' : 'gray'} onClick={handleToggleAnimation} leftSection={isPlaying ? <IconPlayerPause size={20} /> : <IconPlayerPlay size={20} />}>
          {isPlaying ? t('actions.pause') : t('actions.play')}
        </Button>
      </SimpleGrid>
      <Slider
        color={isPlaying ? 'orange' : 'gray'}
        value={realtimeExplorerContext.selectedTrip.event_animation_index}
        onChange={realtimeExplorerContext.updateEventAnimationIndex}
        marks={[
          { value: 0 },
          { value: realtimeExplorerContext.selectedTrip.positions?.length * 0.25 },
          { value: realtimeExplorerContext.selectedTrip.positions?.length * 0.5 },
          { value: realtimeExplorerContext.selectedTrip.positions?.length * 0.75 },
          { value: realtimeExplorerContext.selectedTrip.positions?.length },
        ]}
        step={1}
        defaultValue={realtimeExplorerContext.selectedTrip.positions?.length}
        max={realtimeExplorerContext.selectedTrip.positions?.length}
        disabled={!realtimeExplorerContext.selectedTrip.positions?.length}
      />
    </Standout>
  );

  //
}
