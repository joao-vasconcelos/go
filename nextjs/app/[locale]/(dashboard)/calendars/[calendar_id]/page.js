'use client';

import isAllowed from '@/authentication/isAllowed';
import AppAuthenticationCheck from '@/components/AppAuthenticationCheck/AppAuthenticationCheck';
import LockButton from '@/components/AppButtonLock/AppButtonLock';
import { AppLayoutSection } from '@/components/AppLayoutSection/AppLayoutSection';
import AutoSave from '@/components/AutoSave/AutoSave';
import CalendarPatternsView from '@/components/CalendarPatternsView/CalendarPatternsView';
import HCalendar from '@/components/HCalendar/HCalendar';
import HCalendarToggle from '@/components/HCalendarToggle/HCalendarToggle';
import { Section } from '@/components/Layouts/Layouts';
import ListHeader from '@/components/ListHeader/ListHeader';
import Pannel from '@/components/Pannel/Pannel';
import Text from '@/components/Text/Text';
import { CalendarDefault } from '@/schemas/Calendar/default';
import { CalendarValidation } from '@/schemas/Calendar/validation';
import API from '@/services/API';
import calculateDateDayType from '@/services/calculateDateDayType';
import notify from '@/services/notify';
import populate from '@/services/populate';
import { useRouter } from '@/translations/navigation';
import { ActionIcon, Button, Divider, NumberInput, SimpleGrid, TextInput, Tooltip } from '@mantine/core';
import { useForm, yupResolver } from '@mantine/form';
import { openConfirmModal } from '@mantine/modals';
import { IconTrash } from '@tabler/icons-react';
import { useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import useSWR from 'swr';

export default function Page() {
	//

	//
	// A. Setup variables

	const router = useRouter();
	const t = useTranslations('calendars');
	const [isSaving, setIsSaving] = useState(false);
	const [isLocking, setIsLocking] = useState(false);
	const [hasErrorSaving, setHasErrorSaving] = useState();
	const [isDeleting, setIsDeleting] = useState(false);
	const { data: sessionData } = useSession();

	const { calendar_id } = useParams();

	//
	// B. Fetch data

	const { mutate: allCalendarsMutate } = useSWR('/api/calendars');
	const { data: calendarData, error: calendarError, isLoading: calendarLoading, mutate: calendarMutate } = useSWR(calendar_id && `/api/calendars/${calendar_id}`, { onSuccess: data => keepFormUpdated(data) });
	const { data: allDatesData } = useSWR('/api/dates');
	const { data: allCalendarAssociatedPatternsData, isLoading: allCalendarAssociatedPatternsLoading } = useSWR(calendar_id && `/api/calendars/${calendar_id}/associatedPatterns`);

	//
	// C. Setup form

	const form = useForm({
		clearInputErrorOnChange: true,
		initialValues: populate(CalendarDefault, calendarData),
		validate: yupResolver(CalendarValidation),
		validateInputOnBlur: true,
		validateInputOnChange: true,
	});

	const keepFormUpdated = (data) => {
		if (!form.isDirty()) {
			const populated = populate(CalendarDefault, data);
			form.setValues(populated);
			form.resetDirty(populated);
		}
	};

	//
	// D. Setup readonly

	const isReadOnly = !isAllowed(sessionData, [{ action: 'edit', scope: 'calendars' }], { handleError: true }) || calendarData?.is_locked;

	//
	// E. Handle actions

	const handleValidate = () => {
		form.validate();
	};

	const handleClose = async () => {
		router.push(`/calendars/`);
	};

	const handleSave = async () => {
		try {
			setIsSaving(true);
			await API({ body: form.values, method: 'PUT', operation: 'edit', resourceId: calendar_id, service: 'calendars' });
			calendarMutate();
			allCalendarsMutate();
			form.resetDirty();
			setIsSaving(false);
			setIsLocking(false);
			setHasErrorSaving(false);
		}
		catch (error) {
			console.log(error);
			setIsSaving(false);
			setIsLocking(false);
			setHasErrorSaving(error);
		}
	};

	const handleLock = async () => {
		try {
			setIsLocking(true);
			await API({ method: 'PUT', operation: 'lock', resourceId: calendar_id, service: 'calendars' });
			calendarMutate();
			setIsLocking(false);
		}
		catch (error) {
			console.log(error);
			calendarMutate();
			setIsLocking(false);
		}
	};

	const handleDelete = async () => {
		openConfirmModal({
			centered: true,
			children: <Text size="h3">{t('operations.delete.description')}</Text>,
			closeOnClickOutside: true,
			confirmProps: { color: 'red' },
			labels: { cancel: t('operations.delete.cancel'), confirm: t('operations.delete.confirm') },
			onConfirm: async () => {
				try {
					setIsDeleting(true);
					notify(calendar_id, 'loading', t('operations.delete.loading'));
					await API({ method: 'DELETE', operation: 'delete', resourceId: calendar_id, service: 'calendars' });
					allCalendarsMutate();
					router.push('/calendars');
					notify(calendar_id, 'success', t('operations.delete.success'));
					setIsDeleting(false);
				}
				catch (error) {
					console.log(error);
					setIsDeleting(false);
					notify(calendar_id, 'error', error.message || t('operations.delete.error'));
				}
			},
			title: <Text size="h2">{t('operations.delete.title')}</Text>,
		});
	};

	const handleToggleDate = (dateObj) => {
		if (form.values.dates.includes(dateObj.date)) {
			// Date string is present in the array, so remove the object
			const newArray = form.values.dates.filter(date => date !== dateObj.date);
			form.setFieldValue('dates', newArray);
		}
		else {
			// Date string is not present in the array, so add a new object
			form.setFieldValue('dates', [...form.values.dates, dateObj.date]);
		}
	};

	const handleMultiToggleDates = (selectedDates) => {
		//
		const arrayOfSelectedDates = selectedDates.map(dateObj => dateObj.date);
		//
		const datesThatAreNotYetSelected = arrayOfSelectedDates.filter(date => !form.values.dates.includes(date));
		const datesThatAreAlreadySelected = form.values.dates.filter(date => arrayOfSelectedDates.includes(date));
		//
		if (datesThatAreNotYetSelected.length >= datesThatAreAlreadySelected.length) {
			// Include all the dates that were not yet selected
			form.setFieldValue('dates', [...form.values.dates, ...datesThatAreNotYetSelected]);
		}
		else {
			// Remove all the dates that were not yet selected
			const newDatesArray = form.values.dates.filter(date => !arrayOfSelectedDates.includes(date));
			form.setFieldValue('dates', newDatesArray);
		}
	};

	const handleTurnOnDayTypeOne = () => {
		if (!allDatesData) return;
		const matchingDates = allDatesData.filter(dateObj => calculateDateDayType(dateObj.date, dateObj.is_holiday) === '1').map(dateObj => dateObj.date);
		if (!matchingDates.length) return;
		const uniqueSetOfDates = new Set(form.values.dates);
		matchingDates.forEach(date => uniqueSetOfDates.add(date));
		form.setFieldValue('dates', [...uniqueSetOfDates]);
	};

	const handleTurnOffDayTypeOne = () => {
		if (!allDatesData) return;
		const matchingDates = allDatesData.filter(dateObj => calculateDateDayType(dateObj.date, dateObj.is_holiday) === '1').map(dateObj => dateObj.date);
		if (!matchingDates.length) return;
		const uniqueSetOfDates = new Set(form.values.dates);
		matchingDates.forEach(date => uniqueSetOfDates.delete(date));
		form.setFieldValue('dates', [...uniqueSetOfDates]);
	};

	const handleTurnOnDayTypeTwo = () => {
		if (!allDatesData) return;
		const matchingDates = allDatesData.filter(dateObj => calculateDateDayType(dateObj.date, dateObj.is_holiday) === '2').map(dateObj => dateObj.date);
		if (!matchingDates.length) return;
		const uniqueSetOfDates = new Set(form.values.dates);
		matchingDates.forEach(date => uniqueSetOfDates.add(date));
		form.setFieldValue('dates', [...uniqueSetOfDates]);
	};

	const handleTurnOffDayTypeTwo = () => {
		if (!allDatesData) return;
		const matchingDates = allDatesData.filter(dateObj => calculateDateDayType(dateObj.date, dateObj.is_holiday) === '2').map(dateObj => dateObj.date);
		if (!matchingDates.length) return;
		const uniqueSetOfDates = new Set(form.values.dates);
		matchingDates.forEach(date => uniqueSetOfDates.delete(date));
		form.setFieldValue('dates', [...uniqueSetOfDates]);
	};

	const handleTurnOnDayTypeThree = () => {
		if (!allDatesData) return;
		const matchingDates = allDatesData.filter(dateObj => calculateDateDayType(dateObj.date, dateObj.is_holiday) === '3').map(dateObj => dateObj.date);
		if (!matchingDates.length) return;
		const uniqueSetOfDates = new Set(form.values.dates);
		matchingDates.forEach(date => uniqueSetOfDates.add(date));
		form.setFieldValue('dates', [...uniqueSetOfDates]);
	};

	const handleTurnOffDayTypeThree = () => {
		if (!allDatesData) return;
		const matchingDates = allDatesData.filter(dateObj => calculateDateDayType(dateObj.date, dateObj.is_holiday) === '3').map(dateObj => dateObj.date);
		if (!matchingDates.length) return;
		const uniqueSetOfDates = new Set(form.values.dates);
		matchingDates.forEach(date => uniqueSetOfDates.delete(date));
		form.setFieldValue('dates', [...uniqueSetOfDates]);
	};

	const handleTurnOnPeriodOne = () => {
		if (!allDatesData) return;
		const matchingDates = allDatesData.filter(dateObj => dateObj.period === '1').map(dateObj => dateObj.date);
		if (!matchingDates.length) return;
		const uniqueSetOfDates = new Set(form.values.dates);
		matchingDates.forEach(date => uniqueSetOfDates.add(date));
		form.setFieldValue('dates', [...uniqueSetOfDates]);
	};

	const handleTurnOffPeriodOne = () => {
		if (!allDatesData) return;
		const matchingDates = allDatesData.filter(dateObj => dateObj.period === '1').map(dateObj => dateObj.date);
		if (!matchingDates.length) return;
		const uniqueSetOfDates = new Set(form.values.dates);
		matchingDates.forEach(date => uniqueSetOfDates.delete(date));
		form.setFieldValue('dates', [...uniqueSetOfDates]);
	};

	const handleTurnOnPeriodTwo = () => {
		if (!allDatesData) return;
		const matchingDates = allDatesData.filter(dateObj => dateObj.period === '2').map(dateObj => dateObj.date);
		if (!matchingDates.length) return;
		const uniqueSetOfDates = new Set(form.values.dates);
		matchingDates.forEach(date => uniqueSetOfDates.add(date));
		form.setFieldValue('dates', [...uniqueSetOfDates]);
	};

	const handleTurnOffPeriodTwo = () => {
		if (!allDatesData) return;
		const matchingDates = allDatesData.filter(dateObj => dateObj.period === '2').map(dateObj => dateObj.date);
		if (!matchingDates.length) return;
		const uniqueSetOfDates = new Set(form.values.dates);
		matchingDates.forEach(date => uniqueSetOfDates.delete(date));
		form.setFieldValue('dates', [...uniqueSetOfDates]);
	};

	const handleTurnOnPeriodThree = () => {
		if (!allDatesData) return;
		const matchingDates = allDatesData.filter(dateObj => dateObj.period === '3').map(dateObj => dateObj.date);
		if (!matchingDates.length) return;
		const uniqueSetOfDates = new Set(form.values.dates);
		matchingDates.forEach(date => uniqueSetOfDates.add(date));
		form.setFieldValue('dates', [...uniqueSetOfDates]);
	};

	const handleTurnOffPeriodThree = () => {
		if (!allDatesData) return;
		const matchingDates = allDatesData.filter(dateObj => dateObj.period === '3').map(dateObj => dateObj.date);
		if (!matchingDates.length) return;
		const uniqueSetOfDates = new Set(form.values.dates);
		matchingDates.forEach(date => uniqueSetOfDates.delete(date));
		form.setFieldValue('dates', [...uniqueSetOfDates]);
	};

	//
	// F. Setup components

	const renderDateCardComponent = ({ key, ...props }) => {
		return <HCalendarToggle key={key} activeDates={form.values.dates} onToggle={handleToggleDate} readOnly={isReadOnly} {...props} />;
	};

	//
	// E. Render components

	return (
		<Pannel
			loading={calendarLoading || isDeleting}
			header={(
				<ListHeader>
					<AutoSave
						isDirty={form.isDirty()}
						isErrorSaving={hasErrorSaving}
						isErrorValidating={calendarError}
						isLoading={calendarLoading}
						isSaving={isSaving}
						isValid={form.isValid()}
						onClose={async () => await handleClose()}
						onSave={async () => await handleSave()}
						onValidate={() => handleValidate()}
					/>
					<Text size="h1" style={!form.values.name && 'untitled'} full>
						{form.values.name || t('untitled')}
					</Text>
					<AppAuthenticationCheck permissions={[{ action: 'view', scope: 'lines' }]}>
						<CalendarPatternsView calendar_id={calendar_id} />
					</AppAuthenticationCheck>
					<AppAuthenticationCheck permissions={[{ action: 'lock', scope: 'calendars' }]}>
						<LockButton isLocked={calendarData?.is_locked} loading={isLocking} onClick={handleLock} />
					</AppAuthenticationCheck>
					<AppAuthenticationCheck permissions={[{ action: 'delete', scope: 'calendars' }]}>
						<Tooltip color="red" disabled={calendarData?.is_locked || allCalendarAssociatedPatternsData?.length > 0} label={t('operations.delete.title')} position="bottom" withArrow>
							<ActionIcon color="red" disabled={calendarData?.is_locked || allCalendarAssociatedPatternsData?.length > 0} loading={calendarLoading || allCalendarAssociatedPatternsLoading} onClick={handleDelete} size="lg" variant="light">
								<IconTrash size={20} />
							</ActionIcon>
						</Tooltip>
					</AppAuthenticationCheck>
				</ListHeader>
			)}
		>
			<form onSubmit={form.onSubmit(async () => await handleSave())}>
				<Section>
					<div>
						<Text size="h2">{t('sections.config.title')}</Text>
						<Text size="h4">{t('sections.config.description')}</Text>
					</div>
					<SimpleGrid cols={4}>
						<TextInput label={t('form.code.label')} placeholder={t('form.code.placeholder')} {...form.getInputProps('code')} readOnly={isReadOnly} />
						<NumberInput label={t('form.numeric_code.label')} placeholder={t('form.numeric_code.placeholder')} {...form.getInputProps('numeric_code')} min={0} readOnly={isReadOnly} />
					</SimpleGrid>
					<SimpleGrid cols={2}>
						<TextInput label={t('form.name.label')} placeholder={t('form.name.placeholder')} {...form.getInputProps('name')} readOnly={isReadOnly} />
						<TextInput label={t('form.description.label')} placeholder={t('form.description.placeholder')} {...form.getInputProps('description')} readOnly={isReadOnly} />
					</SimpleGrid>
				</Section>
				<Divider />
				<AppLayoutSection>
					<SimpleGrid cols={3}>
						<Button.Group>
							<Button onClick={handleTurnOnDayTypeOne} variant="default" w="100%">
								Ligar Dias Úteis
							</Button>
							<Button onClick={handleTurnOffDayTypeOne} variant="default" w="100%">
								Desligar Dias Úteis
							</Button>
						</Button.Group>
						<Button.Group>
							<Button onClick={handleTurnOnDayTypeTwo} variant="default" w="100%">
								Ligar Sábados
							</Button>
							<Button onClick={handleTurnOffDayTypeTwo} variant="default" w="100%">
								Desligar Sábados
							</Button>
						</Button.Group>
						<Button.Group>
							<Button onClick={handleTurnOnDayTypeThree} variant="default" w="100%">
								Ligar Domingos e Feriados
							</Button>
							<Button onClick={handleTurnOffDayTypeThree} variant="default" w="100%">
								Desligar Domingos e Feriados
							</Button>
						</Button.Group>
					</SimpleGrid>
					<SimpleGrid cols={3}>
						<Button.Group>
							<Button onClick={handleTurnOnPeriodOne} variant="default" w="100%">
								Ligar Escolar
							</Button>
							<Button onClick={handleTurnOffPeriodOne} variant="default" w="100%">
								Desligar Escolar
							</Button>
						</Button.Group>
						<Button.Group>
							<Button onClick={handleTurnOnPeriodTwo} variant="default" w="100%">
								Ligar Férias
							</Button>
							<Button onClick={handleTurnOffPeriodTwo} variant="default" w="100%">
								Desligar Férias
							</Button>
						</Button.Group>
						<Button.Group>
							<Button onClick={handleTurnOnPeriodThree} variant="default" w="100%">
								Ligar Verão
							</Button>
							<Button onClick={handleTurnOffPeriodThree} variant="default" w="100%">
								Desligar Verão
							</Button>
						</Button.Group>
					</SimpleGrid>
				</AppLayoutSection>
				<Divider />
				<HCalendar availableDates={allDatesData} onMultiSelect={handleMultiToggleDates} renderCardComponent={renderDateCardComponent} />
			</form>
		</Pannel>
	);
}
