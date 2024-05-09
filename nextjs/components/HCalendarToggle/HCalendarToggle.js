'use client';

import styles from './HCalendarToggle.module.css';
import { useDisclosure } from '@mantine/hooks';
import { Modal, SimpleGrid } from '@mantine/core';
import dayjs from 'dayjs';
import Text from '@/components/Text/Text';

export default function HCalendarToggle({ date, dateObj, activeDates = [], onToggle, readOnly }) {
	//

	//
	// A. Setup variables

	const [isModalPresented, { open: openModal, close: closeModal }] = useDisclosure(false);

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
			<Modal opened={isModalPresented} onClose={closeModal} title={fullDateString} size="500px" centered>
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