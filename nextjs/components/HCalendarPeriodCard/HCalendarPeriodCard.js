'use client';

import AppAuthenticationCheck from '@/components/AppAuthenticationCheck/AppAuthenticationCheck';
import { DateDefault } from '@/schemas/Date/default';
import calculateDateDayType from '@/services/calculateDateDayType';
import populate from '@/services/populate';
import { Button, LoadingOverlay, Modal, Select, SimpleGrid, Switch, Textarea } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import dayjs from 'dayjs';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import useSWR from 'swr';

import API from '../../services/API';
import Text from '../Text/Text';
import styles from './HCalendarPeriodCard.module.css';

export default function HCalendarPeriodCard({ date, dateObj, readOnly }) {
	//

	//
	// A. Setup variables
	const t = useTranslations('dates');
	const [isModalPresented, { close: closeModal, open: openModal }] = useDisclosure(false);
	const [isUpdating, setIsUpdating] = useState(false);
	const [hasErrorUpdating, setHasErrorUpdating] = useState(false);

	const dayString = dayjs(date).format('D');
	const fullDateString = dayjs(date).locale('pt').format('dddd, DD MMM YYYY');

	//
	// B. Render components

	const form = useForm({
		initialValues: populate(DateDefault, dateObj),
	});

	//
	// C. Fetch data

	const { mutate: allDatesMutate } = useSWR('/api/dates');

	//
	// B. Render components

	const handleUpdate = async () => {
		try {
			setIsUpdating(true);
			const dayType = calculateDateDayType(form.values.date, form.values.is_holiday);
			await API({ body: { ...form.values, day_type: dayType }, method: 'PUT', operation: 'edit', resourceId: dateObj._id, service: 'dates' });
			allDatesMutate();
			setIsUpdating(false);
			setHasErrorUpdating(false);
			closeModal();
		}
		catch (error) {
			console.log(error);
			setIsUpdating(false);
			setHasErrorUpdating(error);
		}
	};

	const handleDelete = async () => {
		try {
			setIsUpdating(true);
			await API({ method: 'DELETE', operation: 'delete', resourceId: dateObj._id, service: 'dates' });
			allDatesMutate();
			setIsUpdating(false);
			setHasErrorUpdating(false);
			closeModal();
		}
		catch (error) {
			console.log(error);
			setIsUpdating(false);
			setHasErrorUpdating(error);
		}
	};

	//
	// B. Render components

	return (
		<>
			<Modal onClose={closeModal} opened={isModalPresented} size="500px" title={fullDateString} centered>
				<form onSubmit={form.onSubmit(handleUpdate)}>
					<LoadingOverlay visible={isUpdating} />
					<SimpleGrid cols={1}>
						<Select
							label={t('form.period.label')}
							nothingFoundMessage={t('form.period.nothingFound')}
							placeholder={t('form.period.placeholder')}
							{...form.getInputProps('period')}
							readOnly={readOnly}
							data={[
								{ label: '1 - Período Escolar', value: '1' },
								{ label: '2 - Período de Férias Escolares', value: '2' },
								{ label: '3 - Período de Verão', value: '3' },
							]}
							searchable
						/>
						<Text size="h4">day_type: {dateObj.day_type}</Text>
						<Switch description="is_holiday or not" label="is_holiday" {...form.getInputProps('is_holiday', { type: 'checkbox' })} />
						<Textarea label={t('form.notes.label')} minRows={5} placeholder={t('form.notes.placeholder')} {...form.getInputProps('notes')} readOnly={readOnly} />
						<AppAuthenticationCheck permissions={[{ action: 'edit_dates', scope: 'calendars' }]}>
							<SimpleGrid cols={2}>
								<Button onClick={handleUpdate} size="lg">
									{t('operations.update.title')}
								</Button>
								<Button color="red" onClick={handleDelete} size="lg" variant="light">
									{t('operations.delete.title')}
								</Button>
							</SimpleGrid>
						</AppAuthenticationCheck>
					</SimpleGrid>
				</form>
			</Modal>
			<div className={`${styles.container} ${readOnly && styles.readOnly} ${styles[`period${dateObj.period}`]} ${dateObj.is_holiday && styles.isHoliday} ${dateObj.notes && styles.hasNote}`} onClick={openModal}>
				{dayString}
			</div>
		</>
	);
}
