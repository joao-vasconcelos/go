'use client';

import isAllowed from '@/authentication/isAllowed';
import AppAuthenticationCheck from '@/components/AppAuthenticationCheck/AppAuthenticationCheck';
import LockButton from '@/components/AppButtonLock/AppButtonLock';
import AutoSave from '@/components/AutoSave/AutoSave';
import { Section } from '@/components/Layouts/Layouts';
import ListHeader from '@/components/ListHeader/ListHeader';
import Pannel from '@/components/Pannel/Pannel';
import Text from '@/components/Text/Text';
import { AgencyDefault } from '@/schemas/Agency/default';
import { AgencyValidation } from '@/schemas/Agency/validation';
import API from '@/services/API';
import notify from '@/services/notify';
import parseDate from '@/services/parseDate';
import parseStringToDate from '@/services/parseStringToDate';
import populate from '@/services/populate';
import { useRouter } from '@/translations/navigation';
import { ActionIcon, Divider, NumberInput, Select, SimpleGrid, TextInput, Tooltip } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
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
	const t = useTranslations('agencies');
	const [isSaving, setIsSaving] = useState(false);
	const [isLocking, setIsLocking] = useState(false);
	const [hasErrorSaving, setHasErrorSaving] = useState();
	const [isDeleting, setIsDeleting] = useState(false);
	const { data: sessionData } = useSession();

	const { agency_id } = useParams();

	//
	// B. Fetch data

	const { mutate: allAgenciesMutate } = useSWR('/api/agencies');
	const { data: agencyData, error: agencyError, isLoading: agencyLoading, mutate: agencyMutate } = useSWR(agency_id && `/api/agencies/${agency_id}`, { onSuccess: data => keepFormUpdated(data) });

	//
	// C. Setup form

	const form = useForm({
		clearInputErrorOnChange: true,
		initialValues: populate(AgencyDefault, agencyData),
		validate: yupResolver(AgencyValidation),
		validateInputOnBlur: true,
		validateInputOnChange: true,
	});

	const keepFormUpdated = (data) => {
		if (!form.isDirty()) {
			const populated = populate(AgencyDefault, data);
			form.setValues(populated);
			form.resetDirty(populated);
		}
	};

	//
	// D. Setup readonly

	const isReadOnly = !isAllowed(sessionData, [{ action: 'edit', scope: 'agencies' }], { handleError: true }) || agencyData?.is_locked;

	//
	// E. Handle actions

	const handleValidate = () => {
		form.validate();
	};

	const handleClose = async () => {
		router.push(`/agencies/`);
	};

	const handleSave = async () => {
		try {
			setIsSaving(true);
			await API({ body: form.values, method: 'PUT', operation: 'edit', resourceId: agency_id, service: 'agencies' });
			agencyMutate();
			allAgenciesMutate();
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
			await API({ method: 'PUT', operation: 'lock', resourceId: agency_id, service: 'agencies' });
			agencyMutate();
			setIsLocking(false);
		}
		catch (error) {
			console.log(error);
			agencyMutate();
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
					notify(agency_id, 'loading', t('operations.delete.loading'));
					await API({ method: 'DELETE', operation: 'delete', resourceId: agency_id, service: 'agencies' });
					allAgenciesMutate();
					router.push('/agencies');
					notify(agency_id, 'success', t('operations.delete.success'));
					setIsDeleting(false);
				}
				catch (error) {
					console.log(error);
					setIsDeleting(false);
					notify(agency_id, 'error', error.message || t('operations.delete.error'));
				}
			},
			title: <Text size="h2">{t('operations.delete.title')}</Text>,
		});
	};

	//
	// F. Render components

	return (
		<Pannel
			loading={agencyLoading || isDeleting}
			header={(
				<ListHeader>
					<AutoSave isDirty={form.isDirty()} isErrorSaving={hasErrorSaving} isErrorValidating={agencyError} isLoading={agencyLoading} isSaving={isSaving} isValid={form.isValid()} onClose={async () => await handleClose()} onSave={async () => await handleSave()} onValidate={() => handleValidate()} />
					<Text size="h1" style={!form.values.name && 'untitled'} full>
						{form.values.name || t('untitled')}
					</Text>
					<AppAuthenticationCheck permissions={[{ action: 'lock', scope: 'agencies' }]}>
						<LockButton isLocked={agencyData?.is_locked} loading={isLocking} onClick={handleLock} />
					</AppAuthenticationCheck>
					<AppAuthenticationCheck permissions={[{ action: 'delete', scope: 'agencies' }]}>
						<Tooltip color="red" label={t('operations.delete.title')} position="bottom" withArrow>
							<ActionIcon color="red" onClick={handleDelete} size="lg" variant="light">
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
					<SimpleGrid cols={1}>
						<TextInput label={t('form.name.label')} placeholder={t('form.name.placeholder')} {...form.getInputProps('name')} readOnly={isReadOnly} />
					</SimpleGrid>
					<SimpleGrid cols={3}>
						<TextInput label={t('form.code.label')} placeholder={t('form.code.placeholder')} {...form.getInputProps('code')} readOnly={isReadOnly} />
						<Select data={[{ label: 'Português (Portugal)', value: 'pt' }]} label={t('form.lang.label')} nothingFoundMessage={t('form.lang.nothingFound')} placeholder={t('form.lang.placeholder')} {...form.getInputProps('lang')} readOnly={isReadOnly} searchable />
						<Select data={['Europe/Lisbon']} label={t('form.timezone.label')} nothingFoundMessage={t('form.timezone.nothingFound')} placeholder={t('form.timezone.placeholder')} {...form.getInputProps('timezone')} readOnly={isReadOnly} searchable />
					</SimpleGrid>
					<SimpleGrid cols={2}>
						<TextInput label={t('form.phone.label')} placeholder={t('form.phone.placeholder')} {...form.getInputProps('phone')} readOnly={isReadOnly} />
						<TextInput label={t('form.email.label')} placeholder={t('form.email.placeholder')} {...form.getInputProps('email')} readOnly={isReadOnly} />
					</SimpleGrid>
					<SimpleGrid cols={2}>
						<TextInput label={t('form.url.label')} placeholder={t('form.url.placeholder')} {...form.getInputProps('url')} readOnly={isReadOnly} />
						<TextInput label={t('form.fare_url.label')} placeholder={t('form.fare_url.placeholder')} {...form.getInputProps('fare_url')} readOnly={isReadOnly} />
					</SimpleGrid>
				</Section>
				<Divider />
				<Section>
					<div>
						<Text size="h2">{t('sections.operation.title')}</Text>
						<Text size="h4">{t('sections.operation.description')}</Text>
					</div>
					<SimpleGrid cols={2}>
						<DatePickerInput
							description={t('form.operation_start_date.description')}
							dropdownType="modal"
							label={t('form.operation_start_date.label')}
							placeholder={t('form.operation_start_date.placeholder')}
							readOnly={isReadOnly}
							value={parseStringToDate(form.values.operation_start_date)}
							onChange={(date) => {
								console.log(date);
								form.setFieldValue('operation_start_date', parseDate(date));
							}}
							clearable
						/>
					</SimpleGrid>
				</Section>
				<Divider />
				<Section>
					<div>
						<Text size="h2">{t('sections.financials.title')}</Text>
						<Text size="h4">{t('sections.financials.description')}</Text>
					</div>
					<SimpleGrid cols={2}>
						<NumberInput
							description={t('form.price_per_km.description')}
							label={t('form.price_per_km.label')}
							placeholder={t('form.price_per_km.placeholder')}
							{...form.getInputProps('price_per_km')}
							decimalScale={2}
							decimalSeparator="."
							min={0}
							precision={2}
							prefix="€ "
							readOnly={isReadOnly}
							step={0.01}
							thousandSeparator=" "
							fixedDecimalScale
						/>
						<NumberInput
							description={t('form.total_vkm_per_year.description')}
							label={t('form.total_vkm_per_year.label')}
							placeholder={t('form.total_vkm_per_year.placeholder')}
							{...form.getInputProps('total_vkm_per_year')}
							decimalScale={0}
							decimalSeparator="."
							min={0}
							precision={0}
							readOnly={isReadOnly}
							step={1}
							suffix=" km"
							thousandSeparator=" "
							fixedDecimalScale
						/>
					</SimpleGrid>
				</Section>
			</form>
		</Pannel>
	);
}
