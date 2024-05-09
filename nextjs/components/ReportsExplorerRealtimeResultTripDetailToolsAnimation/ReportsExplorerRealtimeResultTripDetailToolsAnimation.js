'use client';

/* * */

import Standout from '@/components/Standout/Standout';
import { useReportsExplorerRealtimeContext } from '@/contexts/ReportsExplorerRealtimeContext';
import { Button, SimpleGrid, Slider } from '@mantine/core';
import { IconKeyframes, IconPlayerPause, IconPlayerPlay } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

/* * */

const ANIMATION_SPEED = 200; // The faster the slower

/* * */

export default function ReportsExplorerRealtimeResultTripDetailToolsAnimation() {
	//

	//
	// A. Setup variables

	const t = useTranslations('ReportsExplorerRealtimeResultTripDetailToolsAnimation');
	const reportsExplorerRealtimeContext = useReportsExplorerRealtimeContext();

	const [isPlaying, setIsPlaying] = useState(false);

	//
	// B. Transform data

	useEffect(() => {
		if (!isPlaying) return;
		if (reportsExplorerRealtimeContext.selectedTrip.event_animation_index > reportsExplorerRealtimeContext.selectedTrip.positions.length) {
			reportsExplorerRealtimeContext.updateEventAnimationIndex(0);
		}
		const animationInterval = setInterval(() => {
			reportsExplorerRealtimeContext.updateEventAnimationIndex(reportsExplorerRealtimeContext.selectedTrip.event_animation_index + 1);
		}, ANIMATION_SPEED);
		return () => clearInterval(animationInterval);
	}, [isPlaying, reportsExplorerRealtimeContext]);

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
				value={reportsExplorerRealtimeContext.selectedTrip.event_animation_index}
				onChange={reportsExplorerRealtimeContext.updateEventAnimationIndex}
				marks={[
					{ value: 0 },
					{ value: reportsExplorerRealtimeContext.selectedTrip.positions?.length * 0.25 },
					{ value: reportsExplorerRealtimeContext.selectedTrip.positions?.length * 0.5 },
					{ value: reportsExplorerRealtimeContext.selectedTrip.positions?.length * 0.75 },
					{ value: reportsExplorerRealtimeContext.selectedTrip.positions?.length },
				]}
				step={1}
				defaultValue={reportsExplorerRealtimeContext.selectedTrip.positions?.length}
				max={reportsExplorerRealtimeContext.selectedTrip.positions?.length}
				disabled={!reportsExplorerRealtimeContext.selectedTrip.positions?.length}
			/>
		</Standout>
	);

	//
}