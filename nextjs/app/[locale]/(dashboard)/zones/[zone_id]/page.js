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
import { ZoneDefault } from '@/schemas/Zone/default';
import { ZoneValidation } from '@/schemas/Zone/validation';
import API from '@/services/API';
import notify from '@/services/notify';
import populate from '@/services/populate';
import { useRouter } from '@/translations/navigation';
import { ActionIcon, Button, ColorInput, Divider, JsonInput, SimpleGrid, Slider, TextInput, Tooltip } from '@mantine/core';
import { useForm, yupResolver } from '@mantine/form';
import { openConfirmModal } from '@mantine/modals';
import { IconTrash } from '@tabler/icons-react';
import bbox from '@turf/bbox';
import { useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { useCallback, useEffect, useState } from 'react';
import { Layer, Source, useMap } from 'react-map-gl/maplibre';
import useSWR from 'swr';

export default function Page() {
	//

	//
	// A. Setup variables

	const router = useRouter();
	const t = useTranslations('zones');
	const [isSaving, setIsSaving] = useState(false);
	const [isLocking, setIsLocking] = useState(false);
	const [hasErrorSaving, setHasErrorSaving] = useState();
	const [isDeleting, setIsDeleting] = useState(false);
	const [newGeojson, setNewGeojson] = useState('');
	const { data: sessionData } = useSession();
	const { singleZoneMap } = useMap();

	const { zone_id } = useParams();

	//
	// B. Fetch data

	const { mutate: allZonesMutate } = useSWR('/api/zones');
	const { data: zoneData, error: zoneError, isLoading: zoneLoading, mutate: zoneMutate } = useSWR(zone_id && `/api/zones/${zone_id}`, { onSuccess: data => keepFormUpdated(data) });

	//
	// C. Setup form

	const form = useForm({
		clearInputErrorOnChange: true,
		initialValues: populate(ZoneDefault, zoneData),
		validate: yupResolver(ZoneValidation),
		validateInputOnBlur: true,
		validateInputOnChange: true,
	});

	const keepFormUpdated = (data) => {
		if (!form.isDirty()) {
			const populated = populate(ZoneDefault, data);
			form.setValues(populated);
			form.resetDirty(populated);
		}
	};

	//
	// D. Setup readonly

	const isReadOnly = !isAllowed(sessionData, [{ action: 'edit', scope: 'zones' }], { handleError: true }) || zoneData?.is_locked;

	//
	// E. Handle actions

	const handleValidate = () => {
		form.validate();
	};

	const handleClose = async () => {
		router.push(`/zones/`);
	};

	const handleSave = useCallback(async () => {
		try {
			setIsSaving(true);
			await API({ body: form.values, method: 'PUT', operation: 'edit', resourceId: zone_id, service: 'zones' });
			zoneMutate();
			allZonesMutate();
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
	}, [zone_id, form, zoneMutate, allZonesMutate]);

	const handleLock = async () => {
		try {
			setIsLocking(true);
			await API({ method: 'PUT', operation: 'lock', resourceId: zone_id, service: 'zones' });
			zoneMutate();
			setIsLocking(false);
		}
		catch (error) {
			console.log(error);
			zoneMutate();
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
					notify(`${zone_id}-delete`, 'loading', t('operations.delete.loading'));
					await API({ method: 'DELETE', operation: 'delete', resourceId: zone_id, service: 'zones' });
					allZonesMutate();
					router.push('/zones');
					notify(`${zone_id}-delete`, 'success', t('operations.delete.success'));
					setIsDeleting(false);
				}
				catch (error) {
					console.log(error);
					setIsDeleting(false);
					notify(`${zone_id}-delete`, 'error', error.message || t('operations.delete.error'));
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
					notify(`${zone_id}-import_geojson`, 'loading', t('operations.import_geojson.loading'));
					const parsedGeojson = JSON.parse(newGeojson);
					form.setFieldValue('geojson', parsedGeojson);
					await handleSave();
					setNewGeojson('');
					notify(`${zone_id}-import_geojson`, 'success', t('operations.import_geojson.success'));
				}
				catch (error) {
					console.log(error);
					notify(`${zone_id}-import_geojson`, 'error', error.message || t('operations.import_geojson.error'));
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
					notify(`${zone_id}-delete_geojson`, 'loading', t('operations.delete_geojson.loading'));
					form.setFieldValue('geojson', ZoneDefault.geojson);
					await handleSave();
					setNewGeojson('');
					notify(`${zone_id}-delete_geojson`, 'success', t('operations.delete_geojson.success'));
				}
				catch (error) {
					console.log(error);
					notify(`${zone_id}-delete_geojson`, 'error', error.message || t('operations.delete_geojson.error'));
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
				singleZoneMap?.fitBounds(
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
	}, [form.values.geojson, singleZoneMap]);

	//
	// E. Render components

	return (
		<Pannel
			loading={zoneLoading || isDeleting}
			header={(
				<ListHeader>
					<AutoSave isDirty={form.isDirty()} isErrorSaving={hasErrorSaving} isErrorValidating={zoneError} isLoading={zoneLoading} isSaving={isSaving} isValid={form.isValid()} onClose={async () => await handleClose()} onSave={async () => await handleSave()} onValidate={() => handleValidate()} />
					<Text size="h1" style={!form.values.name && 'untitled'} full>
						{form.values.name || t('untitled')}
					</Text>
					<AppAuthenticationCheck permissions={[{ action: 'lock', scope: 'zones' }]}>
						<LockButton isLocked={zoneData?.is_locked} loading={isLocking} onClick={handleLock} />
					</AppAuthenticationCheck>
					<AppAuthenticationCheck permissions={[{ action: 'delete', scope: 'zones' }]}>
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
					<OSMMap id="singleZone" mapStyle="map" scrollZoom={false}>
						{form.values?.geojson?.geometry?.coordinates?.length > 0
						&& (
							<Source data={form.values.geojson} id="single-zone" type="geojson">
								<Layer id="single-zone-fill" layout={{}} paint={{ 'fill-color': form.values.fill_color, 'fill-opacity': form.values.fill_opacity }} source="single-zone" type="fill" />
								<Layer id="single-zone-border" layout={{}} paint={{ 'line-color': form.values.border_color, 'line-opacity': form.values.border_opacity, 'line-width': form.values.border_width }} source="single-zone" type="line" />
							</Source>
						)}
					</OSMMap>
				</div>

				<Divider />

				<Section>
					<div>
						<Text size="h2">{t('sections.config.title')}</Text>
						<Text size="h4">{t('sections.config.description')}</Text>
					</div>
					<SimpleGrid cols={2}>
						<TextInput label={t('form.name.label')} placeholder={t('form.name.placeholder')} {...form.getInputProps('name')} readOnly={isReadOnly} />
						<TextInput label={t('form.code.label')} placeholder={t('form.code.placeholder')} {...form.getInputProps('code')} readOnly={isReadOnly} />
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
