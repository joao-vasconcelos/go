'use client';

import useSWR from 'swr';
import { styled } from '@stitches/react';
import { useState, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm, yupResolver } from '@mantine/form';
import API from '../../../../../services/API';
import { MapContainer, TileLayer, Polyline } from 'react-leaflet';
import { Validation as ShapeValidation } from '../../../../../schemas/Shape/validation';
import { Default as ShapeDefault } from '../../../../../schemas/Shape/default';
import { Tooltip, SimpleGrid, TextInput, ActionIcon, Divider, Text, Button, Group } from '@mantine/core';
import { IconTrash } from '@tabler/icons-react';
import Pannel from '../../../../../components/Pannel/Pannel';
import SaveButtons from '../../../../../components/SaveButtons';
import notify from '../../../../../services/notify';
import { openConfirmModal } from '@mantine/modals';
import HeaderTitle from '../../../../../components/lists/HeaderTitle';
import ImportShapeFromText from './ImportShapeFromText';
import DynamicTable from '../../../../../components/DynamicTable';
import OpenStreetMap from '../../../../../components/OpenStreetMap';

const SectionTitle = styled('p', {
  fontSize: '20px',
  fontWeight: 'bold',
  color: '$gray12',
});

const Section = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  padding: '$lg',
  gap: '$md',
  width: '100%',
  maxHeight: '100%',
});

export default function Page() {
  //

  //
  // A. Setup variables

  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [hasErrorSaving, setHasErrorSaving] = useState();

  const { shape_id } = useParams();

  //
  // B. Fetch data
  const { data: shapeData, error: shapeError, isLoading: shapeLoading } = useSWR(shape_id && `/api/shapes/${shape_id}`, { onSuccess: (data) => keepFormUpdated(data) });

  //
  // C. Setup form

  const form = useForm({
    validateInputOnBlur: true,
    validateInputOnChange: true,
    clearInputErrorOnChange: true,
    validate: yupResolver(ShapeValidation),
    initialValues: shapeData || ShapeDefault,
  });

  const keepFormUpdated = (data) => {
    if (!form.isDirty()) {
      form.setValues(data);
      form.resetDirty(data);
    }
  };

  //
  // D. Handle actions

  const handleValidate = () => {
    form.validate();
  };

  const handleClose = async () => {
    router.push(`/dashboard/shapes`);
  };

  const handleSave = useCallback(async () => {
    try {
      setIsSaving(true);
      await API({ service: 'shapes', resourceId: shape_id, operation: 'edit', method: 'PUT', body: form.values });
      form.resetDirty();
      setIsSaving(false);
      setHasErrorSaving(false);
    } catch (err) {
      console.log(err);
      setIsSaving(false);
      setHasErrorSaving(err);
    }
  }, [shape_id, form]);

  const handleDelete = async () => {
    openConfirmModal({
      title: (
        <Text size={'lg'} fw={700}>
          Eliminar Shape?
        </Text>
      ),
      centered: true,
      closeOnClickOutside: true,
      children: <Text>Eliminar é irreversível. Tem a certeza que quer eliminar esta Shape para sempre?</Text>,
      labels: { confirm: 'Eliminar Shape', cancel: 'Não Eliminar' },
      confirmProps: { color: 'red' },
      onConfirm: async () => {
        try {
          notify(shape_id, 'loading', 'A eliminar Shape...');
          await API({ service: 'shapes', resourceId: shape_id, operation: 'delete', method: 'DELETE' });
          router.push('/dashboard/shapes');
          notify(shape_id, 'success', 'Shape eliminada!');
        } catch (err) {
          console.log(err);
          notify(shape_id, 'error', err.message || 'Occoreu um erro.');
        }
      },
    });
  };

  const handleShapeDelete = async () => {
    openConfirmModal({
      title: (
        <Text size={'lg'} fw={700}>
          Eliminar Pontos Shape?
        </Text>
      ),
      centered: true,
      closeOnClickOutside: true,
      children: (
        <Text>
          Eliminar os pontos da shapes é irreversível. Esta ação não irá eliminar a associação desta shape com determinados patterns, no entanto irá produzir um erro ao gerar o GTFS. Será necessário importar novamente os pontos da shape. Tem a
          certeza que quer eliminar os pontos desta Shape para sempre?
        </Text>
      ),
      labels: { confirm: 'Eliminar Pontos da Shape', cancel: 'Não Eliminar' },
      confirmProps: { color: 'red' },
      onConfirm: async () => {
        try {
          notify('shape-points-delete', 'loading', 'A eliminar pontos da Shape...');
          form.setFieldValue('points', []);
          notify('shape-points-delete', 'success', 'Pontos eliminados!');
        } catch (err) {
          console.log(err);
          notify('shape-points-delete', 'error', err.message || 'Occoreu um erro.');
        }
      },
    });
  };

  //
  // E. Render components

  console.log(shapeData);

  return (
    <Pannel
      loading={shapeLoading}
      header={
        <>
          <SaveButtons
            isValid={form.isValid()}
            isDirty={form.isDirty()}
            isLoading={shapeLoading}
            isErrorValidating={shapeError}
            isSaving={isSaving}
            isErrorSaving={hasErrorSaving}
            onValidate={() => handleValidate()}
            onSave={async () => await handleSave()}
            onClose={async () => await handleClose()}
          />
          <HeaderTitle text={form.values.shape_name || 'Shape Sem Nome'} />
          <Tooltip label='Eliminar Shape' color='red' position='bottom' withArrow>
            <ActionIcon color='red' variant='light' size='lg' onClick={handleDelete}>
              <IconTrash size='20px' />
            </ActionIcon>
          </Tooltip>
        </>
      }
    >
      <form onSubmit={form.onSubmit(async () => await handleSave())}>
        <Section>
          <SectionTitle>Detalhes da Shape</SectionTitle>
          <SimpleGrid cols={2}>
            <TextInput label='Nome da Shape' placeholder='Shape da Linha 1234' {...form.getInputProps('shape_name')} />
            <TextInput label='Código da Shape' placeholder='1234_0_0001' {...form.getInputProps('shape_code')} />
          </SimpleGrid>
        </Section>
      </form>
      <Divider />
      <Section>
        <SectionTitle>Mapa</SectionTitle>
        <p>controlos do mapa</p>
        <OpenStreetMap>
          {shapeData && shapeData.geojson && shapeData.geojson.geometry && shapeData.geojson.geometry.coordinates && (
            <>
              <div>posdiusah</div>
              <Polyline pathOptions={{ color: 'purple' }} positions={shapeData.geojson.geometry.coordinates} />
            </>
          )}
        </OpenStreetMap>
      </Section>
      <Divider />
      <Section>
        <SectionTitle>Importar / Atualizar Shape</SectionTitle>
        <ImportShapeFromText onImport={(result) => form.setFieldValue('points', result)} />
      </Section>
      <Divider />
      <Section>
        <SectionTitle>Pontos GTFS</SectionTitle>
        <Group>
          <Button variant='light' color='red' onClick={handleShapeDelete}>
            Eliminar Pontos da Shape
          </Button>
        </Group>
        <DynamicTable
          data={(shapeData && shapeData.points) || []}
          isLoading={shapeLoading}
          columns={[
            { label: 'shape_pt_sequence', key: 'shape_pt_sequence' },
            { label: 'shape_pt_lat', key: 'shape_pt_lat' },
            { label: 'shape_pt_lon', key: 'shape_pt_lon' },
            { label: 'shape_dist_traveled', key: 'shape_dist_traveled' },
          ]}
        />
      </Section>
    </Pannel>
  );
}
