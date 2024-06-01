'use client';

import Text from '@/components/Text/Text';
import { Modal, SimpleGrid } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import dayjs from 'dayjs';

import styles from './HCalendarToggle.module.css';

export default function HCalendarToggle({ activeDates = [], date, dateObj, onToggle, readOnly }) {
	//

	//
	// A. Setup variables

	const [isModalPresented, { close: closeModal, open: openModal }] = useDisclosure(false);

	const dayString = dayjs(date).format('D');
	const fullDateString = dayjs(date).locale('pt').format('dddd, DD MMM YYYY');

	const isActive = activeDates.includes(date);

	const handleClick = () => {
		if (readOnly) return;
		onToggle(dateObj);
	};

	const handleContextMenu = (event) => {
		event.preventDefault();
		openModal();
	};

	//
	// B. Render components

	return (
		<>
			<Modal onClose={closeModal} opened={isModalPresented} size="500px" title={fullDateString} centered>
				<SimpleGrid cols={1}>
					<Text size="h4">Periodo: {dateObj.period}</Text>
					<Text size="h4">day_type: {dateObj.day_type}</Text>
					<Text size="h4">is Holiday: {dateObj.is_holiday ? 'true' : 'false'}</Text>
					<Text size="h4">Notas sobre esta Data: {dateObj.notes}</Text>
				</SimpleGrid>
			</Modal>
			<div
				className={`${styles.container} ${readOnly && styles.readOnly} ${styles[`period${dateObj.period}`]} ${dateObj.is_holiday && styles.isHoliday} ${dateObj.notes && styles.hasNote} ${isActive && styles.isActive}`}
				onClick={handleClick}
				onContextMenu={handleContextMenu}
			>
				{dayString}
			</div>
		</>
	);
}
