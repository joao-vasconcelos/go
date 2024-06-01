'use client';

import isAllowed from '@/authentication/isAllowed';
import AppAuthenticationCheck from '@/components/AppAuthenticationCheck/AppAuthenticationCheck';
import HCalendar from '@/components/HCalendar/HCalendar';
import HCalendarPeriodCard from '@/components/HCalendarPeriodCard/HCalendarPeriodCard';
import ListHeader from '@/components/ListHeader/ListHeader';
import Loader from '@/components/Loader/Loader';
import Pannel from '@/components/Pannel/Pannel';
import Text from '@/components/Text/Text';
import API from '@/services/API';
import calculateDateDayType from '@/services/calculateDateDayType';
import notify from '@/services/notify';
import { Button, Modal, Space, Switch } from '@mantine/core';
import { Divider, SegmentedControl, Select, SimpleGrid } from '@mantine/core';
import { DatePicker } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import { openConfirmModal } from '@mantine/modals';
import { IconCalendarPlus } from '@tabler/icons-react';
import dayjs from 'dayjs';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import useSWR from 'swr';

export default function Page() {
	//

	//
	// A. Setup variables

	const t = useTranslations('dates');
	const [isModalPresented, { close: closeModal, open: openModal }] = useDisclosure(false);
	const { data: sessionData } = useSession();
	const isReadOnly = !isAllowed(sessionData, [{ action: 'edit_dates', scope: 'calendars' }], { handleError: true });

	const [selectedCalendarType, setSelectedCalendarType] = useState('range');
	const [selectedDateRange, setSelectedDateRange] = useState([]);
	const [selectedDatesCollection, setSelectedDatesCollection] = useState([]);

	const [isUpdatingDates, setIsUpdatingDates] = useState(false);

	//
	// B. Setup form

	const form = useForm({
		initialValues: { is_holiday: false, period: '1' },
	});

	//
	// C. Fetch data

	const { data: allDatesData, isLoading: allDatesLoading, mutate: allDatesMutate } = useSWR('/api/dates');

	//
	// C. Helper functions

	const isSelectionValid = () => {
		switch (selectedCalendarType) {
			case 'range':
			// Has correct length of two
				if (selectedDateRange && selectedDateRange.length != 2) return false;
				// Both values are not null
				else if (selectedDateRange[0] === null || selectedDateRange[1] === null) return false;
				// Return true otherwise
				else return true;
			case 'multiple':
				return selectedDatesCollection.length > 0;
		}
	};

	const formatSelectedDates = () => {
		// Initiate variable to hold date objects
		let formattedDates = [];
		// Depending on the selection mode
		switch (selectedCalendarType) {
			case 'range':
				let currentDate = dayjs(selectedDateRange[0]);
				const formattedEndDate = dayjs(selectedDateRange[1]).format('YYYYMMDD');
				while (currentDate.format('YYYYMMDD') <= formattedEndDate) {
					formattedDates.push(currentDate.format('YYYYMMDD'));
					currentDate = currentDate.add(1, 'day');
				}
				break;
			case 'multiple':
				for (const currentDate of selectedDatesCollection) {
					formattedDates.push(dayjs(currentDate).format('YYYYMMDD'));
				}
				break;
		}
		// Return the created date objects
		return formattedDates.map((dateString) => {
			return {
				date: dateString,
				day_type: calculateDateDayType(dateString, form.values.is_holiday),
				is_holiday: form.values.is_holiday,
				period: form.values.period,
			};
		});
	};

	//
	// C. Handle actions

	const handleUpdate = async () => {
		try {
			setIsUpdatingDates(true);
			notify('update', 'loading', t('operations.update.loading'));
			const formattedDateObjects = formatSelectedDates();
			await API({ body: formattedDateObjects, method: 'POST', operation: 'create', service: 'dates' });
			allDatesMutate();
			notify('update', 'success', t('operations.update.loading'));
			setSelectedDateRange([]);
			setSelectedDatesCollection([]);
			setIsUpdatingDates(false);
			closeModal();
		}
		catch (error) {
			console.log(error);
			setIsUpdatingDates(false);
			notify('update', 'error', t('operations.update.error'));
		}
	};

	const handleDelete = () => {
		closeModal();
		openConfirmModal({
			centered: true,
			children: <Text size="h3">{t('operations.delete.description')}</Text>,
			closeOnClickOutside: true,
			confirmProps: { color: 'red' },
			labels: { cancel: t('operations.delete.cancel'), confirm: t('operations.delete.confirm') },
			onCancel: openModal(),
			onConfirm: async () => {
				try {
					setIsUpdatingDates(true);
					notify('delete', 'loading', t('operations.delete.loading'));
					const formattedDateObjects = formatSelectedDates();
					await API({ body: formattedDateObjects, method: 'POST', operation: 'delete', service: 'dates' });
					allDatesMutate();
					notify('delete', 'success', t('operations.delete.success'));
					setIsUpdatingDates(false);
					closeModal();
				}
				catch (error) {
					console.log(error);
					setIsUpdatingDates(false);
					notify('delete', 'error', error.message || t('operations.delete.error'));
				}
			},
			title: <Text size="h2">{t('operations.delete.title')}</Text>,
		});
	};

	//
	// D. Render components

	const renderDateCardComponent = ({ key, ...props }) => {
		return <HCalendarPeriodCard key={key} {...props} readOnly={isReadOnly} />;
	};

	//
	// D. Render components

	return (
		<Pannel
			loading={allDatesLoading}
			header={(
				<ListHeader>
					<Space />
					<Text size="h1" full>
						{t('title')}
					</Text>

					<AppAuthenticationCheck permissions={[{ action: 'edit_dates', scope: 'calendars' }]}>
						<div>
							<Button color="blue" leftSection={<IconCalendarPlus size={20} />} onClick={openModal} size="sm" variant="light">
								{t('operations.manage.title')}
							</Button>
						</div>
					</AppAuthenticationCheck>
				</ListHeader>
			)}
		>
			<Modal onClose={closeModal} opened={isModalPresented} size="auto" title={t('operations.manage.title')}>
				<Loader visible={isUpdatingDates} full />
				<form onSubmit={form.onSubmit(handleUpdate)}>
					<SimpleGrid cols={1}>
						<SegmentedControl
							onChange={setSelectedCalendarType}
							value={selectedCalendarType}
							data={[
								{ label: t('form.range.title'), value: 'range' },
								{ label: t('form.multiple.title'), value: 'multiple' },
							]}
						/>

						{selectedCalendarType === 'range' ? <DatePicker numberOfColumns={3} onChange={setSelectedDateRange} type="range" value={selectedDateRange} /> : <DatePicker numberOfColumns={3} onChange={setSelectedDatesCollection} type="multiple" value={selectedDatesCollection} />}

						<Divider />

						<SimpleGrid cols={1}>
							<Select
								label={t('form.period.label')}
								nothingFoundMessage={t('form.period.nothingFound')}
								placeholder={t('form.period.placeholder')}
								{...form.getInputProps('period')}
								readOnly={isReadOnly}
								data={[
									{ label: '1 - Período Escolar', value: '1' },
									{ label: '2 - Período de Férias Escolares', value: '2' },
									{ label: '3 - Período de Verão', value: '3' },
								]}
								searchable
							/>
							<Switch description={t('form.is_holiday.description')} label={t('form.is_holiday.label')} {...form.getInputProps('is_holiday')} readOnly={isReadOnly} />
						</SimpleGrid>
						<SimpleGrid cols={2}>
							<Button disabled={!isSelectionValid()} onClick={handleUpdate} size="lg">
								{t('operations.update.title')}
							</Button>
							<AppAuthenticationCheck permissions={[{ action: 'edit_dates', scope: 'calendars' }]}>
								<Button color="red" disabled={!isSelectionValid()} onClick={handleDelete} size="lg">
									{t('operations.delete.title')}
								</Button>
							</AppAuthenticationCheck>
						</SimpleGrid>
					</SimpleGrid>
				</form>
			</Modal>
			<HCalendar availableDates={allDatesData} renderCardComponent={renderDateCardComponent} />
		</Pannel>
	);
}
