'use client';

import isAllowed from '@/authentication/isAllowed';
import AppAuthenticationCheck from '@/components/AppAuthenticationCheck/AppAuthenticationCheck';
import LockButton from '@/components/AppButtonLock/AppButtonLock';
import AutoSave from '@/components/AutoSave/AutoSave';
import { Section } from '@/components/Layouts/Layouts';
import ListHeader from '@/components/ListHeader/ListHeader';
import OSMMap from '@/components/OSMMap/OSMMap';
import Pannel from '@/components/Pannel/Pannel';
import Text from '@/components/Text/Text';
import { MunicipalityDefault } from '@/schemas/Municipality/default';
import { MunicipalityOptions } from '@/schemas/Municipality/options';
import { MunicipalityValidation } from '@/schemas/Municipality/validation';
import API from '@/services/API';
import notify from '@/services/notify';
import populate from '@/services/populate';
import { useRouter } from '@/translations/navigation';
import { ActionIcon, Button, ColorInput, Divider, JsonInput, Select, SimpleGrid, Slider, TextInput, Tooltip } from '@mantine/core';
import { useForm, yupResolver } from '@mantine/form';
import { openConfirmModal } from '@mantine/modals';
import { IconTrash } from '@tabler/icons-react';
import { useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { Layer, Source, useMap } from 'react-map-gl/maplibre';
import useSWR from 'swr';

export default function Page() {
	//

	//
	// A. Setup variables

	const router = useRouter();
	const t = useTranslations('municipalities');
	const [isSaving, setIsSaving] = useState(false);
	const [isLocking, setIsLocking] = useState(false);
	const [hasErrorSaving, setHasErrorSaving] = useState();
	const [isDeleting, setIsDeleting] = useState(false);
	const { data: sessionData } = useSession();
	const [newGeojson, setNewGeojson] = useState('');
	const { municipality_id } = useParams();
	const { singleMunicipalityMap } = useMap();

	//
	// B. Fetch data

	const { mutate: allMunicipalitiesMutate } = useSWR('/api/municipalities');
	const { data: municipalityData, error: municipalityError, isLoading: municipalityLoading, mutate: municipalityMutate } = useSWR(municipality_id && `/api/municipalities/${municipality_id}`, { onSuccess: data => keepFormUpdated(data) });

	//
	// C. Setup form

	const form = useForm({
		clearInputErrorOnChange: true,
		initialValues: populate(MunicipalityDefault, municipalityData),
		validate: yupResolver(MunicipalityValidation),
		validateInputOnBlur: true,
		validateInputOnChange: true,
	});

	const keepFormUpdated = (data) => {
		if (!form.isDirty()) {
			const populated = populate(MunicipalityDefault, data);
			form.setValues(populated);
			form.resetDirty(populated);
		}
	};

	//
	// D. Setup readonly

	const isReadOnly = !isAllowed(sessionData, [{ action: 'edit', scope: 'municipalities' }], { handleError: true }) || municipalityData?.is_locked;

	//
	// E. Handle actions

	const handleValidate = () => {
		form.validate();
	};

	const handleClose = async () => {
		router.push(`/municipalities/`);
	};

	const handleSave = async () => {
		try {
			setIsSaving(true);
			await API({ body: form.values, method: 'PUT', operation: 'edit', resourceId: municipality_id, service: 'municipalities' });
			municipalityMutate();
			allMunicipalitiesMutate();
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
			await API({ method: 'PUT', operation: 'lock', resourceId: municipality_id, service: 'municipalities' });
			municipalityMutate();
			setIsLocking(false);
		}
		catch (error) {
			console.log(error);
			municipalityMutate();
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
					notify(municipality_id, 'loading', t('operations.delete.loading'));
					await API({ method: 'DELETE', operation: 'delete', resourceId: municipality_id, service: 'municipalities' });
					allMunicipalitiesMutate();
					router.push('/municipalities');
					notify(municipality_id, 'success', t('operations.delete.success'));
					setIsDeleting(false);
				}
				catch (error) {
					console.log(error);
					setIsDeleting(false);
					notify(municipality_id, 'error', error.message || t('operations.delete.error'));
				}
			},
			title: <Text size="h2">{t('operations.delete.title')}</Text>,
		});
	};

	const handleImportGeojson = async () => {
		openConfirmModal({
			centered: true,
			children: <Text size="h3">{t('operations.import_geojson.description')}</Text>,
			closeOnClickOutside: true,
			labels: { cancel: t('operations.import_geojson.cancel'), confirm: t('operations.import_geojson.confirm') },
			onConfirm: async () => {
				try {
					notify(`${municipality_id}-import_geojson`, 'loading', t('operations.import_geojson.loading'));
					const parsedGeojson = JSON.parse(newGeojson);
					form.setFieldValue('geojson', parsedGeojson);
					await handleSave();
					setNewGeojson('');
					notify(`${municipality_id}-import_geojson`, 'success', t('operations.import_geojson.success'));
				}
				catch (error) {
					console.log(error);
					notify(`${municipality_id}-import_geojson`, 'error', error.message || t('operations.import_geojson.error'));
				}
			},
			title: <Text size="h2">{t('operations.import_geojson.title')}</Text>,
		});
	};

	const handleDeleteGeojson = async () => {
		openConfirmModal({
			centered: true,
			children: <Text size="h3">{t('operations.delete_geojson.description')}</Text>,
			closeOnClickOutside: true,
			confirmProps: { color: 'red' },
			labels: { cancel: t('operations.delete_geojson.cancel'), confirm: t('operations.delete_geojson.confirm') },
			onConfirm: async () => {
				try {
					notify(`${municipality_id}-delete_geojson`, 'loading', t('operations.delete_geojson.loading'));
					form.setFieldValue('geojson', MunicipalityDefault.geojson);
					await handleSave();
					setNewGeojson('');
					notify(`${municipality_id}-delete_geojson`, 'success', t('operations.delete_geojson.success'));
				}
				catch (error) {
					console.log(error);
					notify(`${municipality_id}-delete_geojson`, 'error', error.message || t('operations.delete_geojson.error'));
				}
			},
			title: <Text size="h2">{t('operations.delete_geojson.title')}</Text>,
		});
	};

	//
	// E. Transform data

	useEffect(() => {
		try {
			if (form.values?.geojson?.geometry?.coordinates?.length > 0) {
				// Calculate the bounding box of the feature
				const [minLng, minLat, maxLng, maxLat] = bbox(form.values.geojson);
				// Calculate the bounding box of the feature
				singleMunicipalityMap?.fitBounds(
					[
						[minLng, minLat],
						[maxLng, maxLat],
					],
					{ duration: 2000, padding: 100 },
				);
			}
		}
		catch (error) {
			console.log(error);
		}
		//
	}, [form.values.geojson, singleMunicipalityMap]);

	//
	// E. Render components

	return (
		<Pannel
			loading={municipalityLoading || isDeleting}
			header={(
				<ListHeader>
					<AutoSave
						isDirty={form.isDirty()}
						isErrorSaving={hasErrorSaving}
						isErrorValidating={municipalityError}
						isLoading={municipalityLoading}
						isSaving={isSaving}
						isValid={form.isValid()}
						onClose={async () => await handleClose()}
						onSave={async () => await handleSave()}
						onValidate={() => handleValidate()}
					/>
					<Text size="h1" style={!form.values.name && 'untitled'} full>
						{form.values.name || t('untitled')}
					</Text>
					<AppAuthenticationCheck permissions={[{ action: 'lock', scope: 'municipalities' }]}>
						<LockButton isLocked={municipalityData?.is_locked} loading={isLocking} onClick={handleLock} />
					</AppAuthenticationCheck>
					<AppAuthenticationCheck permissions={[{ action: 'delete', scope: 'municipalities' }]}>
						<Tooltip color="red" label={t('operations.delete.title')} position="bottom" withArrow>
							<ActionIcon color="red" onClick={handleDelete} size="lg" variant="light">
								<IconTrash size="20px" />
							</ActionIcon>
						</Tooltip>
					</AppAuthenticationCheck>
				</ListHeader>
			)}
		>
			<form onSubmit={form.onSubmit(async () => await handleSave())}>
				<div style={{ height: 400 }}>
					<OSMMap id="singleMunicipality" mapStyle="map" scrollZoom={false}>
						{form.values?.geojson?.geometry?.coordinates?.length > 0
						&& (
							<Source data={form.values.geojson} id="single-municipality" type="geojson">
								<Layer id="single-municipality-fill" layout={{}} paint={{ 'fill-color': form.values.fill_color, 'fill-opacity': form.values.fill_opacity }} source="single-municipality" type="fill" />
								<Layer id="single-municipality-border" layout={{}} paint={{ 'line-color': form.values.border_color, 'line-opacity': form.values.border_opacity, 'line-width': form.values.border_width }} source="single-municipality" type="line" />
							</Source>
						)}
					</OSMMap>
				</div>
				<Section>
					<Text size="h2">{t('sections.config.title')}</Text>
					<SimpleGrid cols={2}>
						<TextInput label={t('form.code.label')} placeholder={t('form.code.placeholder')} {...form.getInputProps('code')} readOnly={isReadOnly} />
						<TextInput label={t('form.prefix.label')} placeholder={t('form.prefix.placeholder')} {...form.getInputProps('prefix')} readOnly={isReadOnly} />
					</SimpleGrid>
					<SimpleGrid cols={1}>
						<TextInput label={t('form.name.label')} placeholder={t('form.name.placeholder')} {...form.getInputProps('name')} readOnly={isReadOnly} />
					</SimpleGrid>
					<SimpleGrid cols={2}>
						<Select label={t('form.district.label')} nothingFoundMessage={t('form.district.nothingFound')} placeholder={t('form.district.placeholder')} {...form.getInputProps('district')} data={MunicipalityOptions.district} readOnly={isReadOnly} searchable />
						<Select label={t('form.region.label')} nothingFoundMessage={t('form.region.nothingFound')} placeholder={t('form.region.placeholder')} {...form.getInputProps('region')} data={MunicipalityOptions.region} readOnly={isReadOnly} searchable />
					</SimpleGrid>
				</Section>

				<Divider />

				<Section>
					<div>
						<Text size="h2">{t('sections.map_representation.title')}</Text>
						<Text size="h4">{t('sections.map_representation.description')}</Text>
					</div>
					<SimpleGrid cols={2}>
						<ColorInput label={t('form.fill_color.label')} placeholder={t('form.fill_color.placeholder')} {...form.getInputProps('fill_color')} readOnly={isReadOnly} />
						<ColorInput label={t('form.border_color.label')} placeholder={t('form.border_color.placeholder')} {...form.getInputProps('border_color')} readOnly={isReadOnly} />
					</SimpleGrid>
					<SimpleGrid cols={3}>
						<div>
							<Text size="h4">{t('form.fill_opacity.label')}</Text>
							<Slider
								{...form.getInputProps('fill_opacity')}
								disabled={isReadOnly}
								max={1}
								min={0}
								precision={2}
								step={0.01}
								marks={[
									{ label: '20%', value: 0.2 },
									{ label: '50%', value: 0.5 },
									{ label: '80%', value: 0.8 },
								]}
							/>
						</div>
						<div>
							<Text size="h4">{t('form.border_opacity.label')}</Text>
							<Slider
								{...form.getInputProps('border_opacity')}
								disabled={isReadOnly}
								max={1}
								min={0}
								precision={2}
								step={0.01}
								marks={[
									{ label: '20%', value: 0.2 },
									{ label: '50%', value: 0.5 },
									{ label: '80%', value: 0.8 },
								]}
							/>
						</div>
						<div>
							<Text size="h4">{t('form.border_width.label')}</Text>
							<Slider
								{...form.getInputProps('border_width')}
								disabled={isReadOnly}
								max={6}
								min={0}
								precision={1}
								step={0.5}
								marks={[
									{ label: '0', value: 0 },
									{ label: '2', value: 2 },
									{ label: '4', value: 4 },
									{ label: '6', value: 6 },
								]}
							/>
						</div>
					</SimpleGrid>
				</Section>

				<Divider />

				<Section>
					<div>
						<Text size="h2">{t('sections.geojson.title')}</Text>
						<Text size="h4">{t('sections.geojson.description')}</Text>
					</div>
					<SimpleGrid cols={1}>
						<JsonInput label={t('form.geojson.label')} maxRows={10} minRows={5} onChange={setNewGeojson} placeholder={t('form.geojson.placeholder')} readOnly={isReadOnly} validationError={t('form.geojson.validation_error')} value={newGeojson} autosize formatOnBlur />
					</SimpleGrid>
					<SimpleGrid cols={2}>
						<Button disabled={!newGeojson || isReadOnly} onClick={handleImportGeojson}>
							{t('operations.import_geojson.title')}
						</Button>
						<Button color="red" disabled={form.values.geojson?.geometry?.coordinates?.length === 0 || isReadOnly} onClick={handleDeleteGeojson}>
							{t('operations.delete_geojson.title')}
						</Button>
					</SimpleGrid>
				</Section>
			</form>
		</Pannel>
	);
}
