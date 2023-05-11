'use client';

import useSWR from 'swr';
import { styled } from '@stitches/react';
import { useState, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm, yupResolver } from '@mantine/form';
import API from '../../../../services/API';
import { Validation as StopValidation } from '../../../../schemas/Stop/validation';
import { Default as StopDefault } from '../../../../schemas/Stop/default';
import { Tooltip, Select, SimpleGrid, Switch, Chip, Checkbox, Group, TextInput, NumberInput, ActionIcon, Text, Divider, Textarea } from '@mantine/core';
import { IconTrash, IconWorldLatitude, IconWorldLongitude, IconVolume } from '@tabler/icons-react';
import Pannel from '../../../../components/Pannel/Pannel';
import SaveButtons from '../../../../components/SaveButtons';
import notify from '../../../../services/notify';
import { openConfirmModal } from '@mantine/modals';
import HeaderTitle from '../../../../components/lists/HeaderTitle';

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

  const [isPlayingSound, setIsPlayingSound] = useState(false);

  const { stop_id } = useParams();

  //
  // B. Fetch data

  const { data: stopData, error: stopError, isLoading: stopLoading } = useSWR(stop_id && `/api/stops/${stop_id}`, { onSuccess: (data) => keepFormUpdated(data) });

  //
  // C. Setup form

  const form = useForm({
    validateInputOnBlur: true,
    validateInputOnChange: true,
    clearInputErrorOnChange: true,
    validate: yupResolver(StopValidation),
    initialValues: stopData || StopDefault,
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
    router.push(`/dashboard/stops/`);
  };

  const handleSave = useCallback(async () => {
    try {
      setIsSaving(true);
      await API({ service: 'stops', resourceId: stop_id, operation: 'edit', method: 'PUT', body: form.values });
      form.resetDirty();
      setIsSaving(false);
      setHasErrorSaving(false);
    } catch (err) {
      console.log(err);
      setIsSaving(false);
      setHasErrorSaving(err);
    }
  }, [stop_id, form]);

  const handleDelete = async () => {
    openConfirmModal({
      title: (
        <Text size={'lg'} fw={700}>
          Eliminar Paragem?
        </Text>
      ),
      centered: true,
      closeOnClickOutside: true,
      children: <Text>Eliminar é irreversível. Tem a certeza que quer eliminar esta Paragem para sempre?</Text>,
      labels: { confirm: 'Eliminar Paragem', cancel: 'Não Eliminar' },
      confirmProps: { color: 'red' },
      onConfirm: async () => {
        try {
          notify(stop_id, 'loading', 'A eliminar Paragem...');
          await API({ service: 'stops', resourceId: stop_id, operation: 'delete', method: 'DELETE' });
          router.push('/dashboard/stops');
          notify(stop_id, 'success', 'Paragem eliminada!');
        } catch (err) {
          console.log(err);
          notify(stop_id, 'error', err.message || 'Occoreu um erro.');
        }
      },
    });
  };

  const handlePlayPhoneticName = async () => {
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(form.values.tts_stop_name || '');
    utterance.lang = 'pt';
    synth.speak(utterance);
  };

  //
  // E. Render components

  return (
    <Pannel
      loading={stopLoading}
      header={
        <>
          <SaveButtons
            isValid={form.isValid()}
            isDirty={form.isDirty()}
            isLoading={stopLoading}
            isErrorValidating={stopError}
            isSaving={isSaving}
            isErrorSaving={hasErrorSaving}
            onValidate={() => handleValidate()}
            onSave={async () => await handleSave()}
            onClose={async () => await handleClose()}
          />
          <HeaderTitle text={form.values.stop_name || 'Paragem Sem Nome'} />
          <Tooltip label='Eliminar Paragem' color='red' position='bottom' withArrow>
            <ActionIcon color='red' variant='light' size='lg' onClick={handleDelete}>
              <IconTrash size='20px' />
            </ActionIcon>
          </Tooltip>
        </>
      }
    >
      <form onSubmit={form.onSubmit(async () => await handleSave())}>
        <Section>
          <SectionTitle>Configurações Gerais da Paragem</SectionTitle>
          <SimpleGrid cols={3}>
            <TextInput placeholder='123456' label='Código da Paragem' {...form.getInputProps('stop_code')} />
            <NumberInput placeholder='38.123456' label='Latitude' precision={6} min={37} max={40} step={0.000001} stepHoldDelay={500} stepHoldInterval={100} hideControls icon={<IconWorldLatitude size='18px' />} {...form.getInputProps('stop_lat')} />
            <NumberInput
              placeholder='-9.654321'
              label='Longitude'
              precision={6}
              min={-10}
              max={-7}
              step={0.000001}
              stepHoldDelay={500}
              stepHoldInterval={100}
              hideControls
              icon={<IconWorldLongitude size='18px' />}
              {...form.getInputProps('stop_lon')}
            />
          </SimpleGrid>
          <SimpleGrid cols={1}>
            <TextInput placeholder='Nome da Paragem' label='Nome da Paragem' {...form.getInputProps('stop_name')} />
          </SimpleGrid>
          <SimpleGrid cols={2}>
            <TextInput placeholder='Nome Curto' label='Nome Curto' {...form.getInputProps('stop_short_name')} />
            <TextInput
              placeholder='Nome Fonético'
              label='Nome Fonético'
              {...form.getInputProps('tts_stop_name')}
              rightSection={
                <ActionIcon onClick={handlePlayPhoneticName} variant='subtle' color='blue' disabled={!form.values.tts_stop_name}>
                  <IconVolume />
                </ActionIcon>
              }
            />
          </SimpleGrid>
        </Section>
        <Divider />
        <Section>
          <SectionTitle>Configuração Gerais da Paragem</SectionTitle>
          Descrição, criar estilos
          <SimpleGrid cols={4}>
            <Checkbox label='Área 1' size='md' />
            <Checkbox label='Área 2' size='md' />
            <Checkbox label='Área 3' size='md' />
            <Checkbox label='Área 4' size='md' />
          </SimpleGrid>
        </Section>
        <Divider />
        <Section>
          <SectionTitle>Administrativo</SectionTitle>
          address, postal_code, jurisdiction, region, district, municipality, parish, locality, stepp_id,
          <SimpleGrid cols={4}></SimpleGrid>
        </Section>
        <Divider />
        <Section>
          <SectionTitle>Infraestrutura</SectionTitle>
          Informações sobre esta secção
          <SimpleGrid cols={2}>
            <Select
              label='Estado do Poste'
              placeholder='Escolha uma opção'
              searchable
              nothingFound='No options'
              {...form.getInputProps('has_pole')}
              data={[
                { value: 0, label: '0 - Não Aplicável' },
                { value: 1, label: '1 - Não existe, mas deve ser colocado' },
                { value: 2, label: '2 - Existe, mas está danificado' },
                { value: 3, label: '3 - Existe e está OK' },
              ]}
            />
            <TextInput placeholder='Tipo de Material do Poste' label='Tipo de Material do Poste' disabled={form.values.has_pole < 2} {...form.getInputProps('pole_material')} />
          </SimpleGrid>
          <SimpleGrid cols={3}>
            <Select
              label='Estado do Abrigo'
              placeholder='Escolha uma opção'
              searchable
              nothingFound='No options'
              {...form.getInputProps('has_shelter')}
              data={[
                { value: 0, label: '0 - Não Existe' },
                { value: 1, label: '1 - Em muito mau estado' },
                { value: 2, label: '2 - Em mau estado' },
                { value: 3, label: '3 - Em estado razoável' },
                { value: 4, label: '4 - Em bom estado' },
                { value: 5, label: '5 - Em muito bom estado' },
              ]}
            />
            <TextInput placeholder='Código do Abrigo' label='Código do Abrigo' disabled={form.values.has_shelter < 1} {...form.getInputProps('shelter_code')} />
            <TextInput placeholder='Concessionário / Gestor do abrigo' label='Concessionário / Gestor do abrigo' disabled={form.values.has_shelter < 1} {...form.getInputProps('shelter_maintainer')} />
          </SimpleGrid>
          <SimpleGrid cols={3}>
            <Select
              label='Estado do Mupi'
              placeholder='Escolha uma opção'
              searchable
              nothingFound='No options'
              {...form.getInputProps('has_mupi')}
              data={[
                { value: 0, label: '0 - Não Existe' },
                { value: 1, label: '1 - Em muito mau estado' },
                { value: 2, label: '2 - Em mau estado' },
                { value: 3, label: '3 - Em estado razoável' },
                { value: 4, label: '4 - Em bom estado' },
                { value: 5, label: '5 - Em muito bom estado' },
              ]}
            />
            <Select
              label='Estado do Banco'
              placeholder='Escolha uma opção'
              searchable
              nothingFound='No options'
              {...form.getInputProps('has_bench')}
              data={[
                { value: 0, label: '0 - Não Existe' },
                { value: 1, label: '1 - Em muito mau estado' },
                { value: 2, label: '2 - Em mau estado' },
                { value: 3, label: '3 - Em estado razoável' },
                { value: 4, label: '4 - Em bom estado' },
                { value: 5, label: '5 - Em muito bom estado' },
              ]}
            />
            <Select
              label='Estado da Papeleira'
              placeholder='Escolha uma opção'
              searchable
              nothingFound='No options'
              {...form.getInputProps('has_trash_bin')}
              data={[
                { value: 0, label: '0 - Não Existe' },
                { value: 1, label: '1 - Em muito mau estado' },
                { value: 2, label: '2 - Em mau estado' },
                { value: 3, label: '3 - Em estado razoável' },
                { value: 4, label: '4 - Em bom estado' },
                { value: 5, label: '5 - Em muito bom estado' },
              ]}
            />
          </SimpleGrid>
          <SimpleGrid cols={2}>
            <Select
              label='Iluminação Pública'
              placeholder='Escolha uma opção'
              searchable
              nothingFound='No options'
              {...form.getInputProps('has_lighting')}
              data={[
                { value: 0, label: '0 - Sem qualquer iluminação' },
                { value: 1, label: '1 - Iluminação insuficiente' },
                { value: 2, label: '2 - Imediações visíveis' },
                { value: 3, label: '3 - Leitura é possível e confortável' },
              ]}
            />
            <Select
              label='Instalação Elétrica'
              placeholder='Escolha uma opção'
              searchable
              nothingFound='No options'
              {...form.getInputProps('has_electricity')}
              data={[
                { value: 0, label: '0 - Indisponível' },
                { value: 1, label: '1 - Disponível' },
              ]}
            />
          </SimpleGrid>
        </Section>
        <Divider />
        <Section>
          <SectionTitle>Suportes de Informação ao Público</SectionTitle>
          has_stop_sign, stop_sign_maintainer, has_pole_frame, shelter_frame_area_cm, has_pip_real_time, pip_real_time_code, has_h2oa_signage, has_schedules, has_network_map, last_schedules_maintenance, last_schedules_check,
          last_stop_sign_maintenance, last_stop_sign_check,
          <SimpleGrid cols={4}></SimpleGrid>
        </Section>
        <Divider />
        <Section>
          <SectionTitle>Acessibilidade</SectionTitle>
          has_sidewalk, sidewalk_type, has_tactile_schedules, stop_access_type, has_crosswalk, has_tactile_pavement, has_abusive_parking, has_audio_stop_info, wheelchair_boarding, last_accessibility_check,
          <SimpleGrid cols={4}></SimpleGrid>
        </Section>
        <Divider />
        <Section>
          <SectionTitle>Serviços</SectionTitle>
          Pequena explicação sobre o que acontece nesta secção
          <SimpleGrid cols={3}>
            <Switch label='Clínica' size='md' {...form.getInputProps('near_health_clinic', { type: 'checkbox' })} />
            <Switch label='Hospital' size='md' {...form.getInputProps('near_hospital', { type: 'checkbox' })} />
            <Switch label='Universidade' size='md' {...form.getInputProps('near_university', { type: 'checkbox' })} />
            <Switch label='Escola' size='md' {...form.getInputProps('near_school', { type: 'checkbox' })} />
            <Switch label='Polícia' size='md' {...form.getInputProps('near_police_station', { type: 'checkbox' })} />
            <Switch label='Bombeiros' size='md' {...form.getInputProps('near_fire_station', { type: 'checkbox' })} />
            <Switch label='Zona Comercial' size='md' {...form.getInputProps('near_shopping', { type: 'checkbox' })} />
            <Switch label='Zona Histórica' size='md' {...form.getInputProps('near_historic_building', { type: 'checkbox' })} />
            <Switch label='Espaço navegante®' size='md' {...form.getInputProps('near_transit_office', { type: 'checkbox' })} />
          </SimpleGrid>
        </Section>
        <Divider />
        <Section>
          <SectionTitle>Ligações Intermodais</SectionTitle>
          Pequena explicação sobre o que acontece nesta secção
          <SimpleGrid cols={3}>
            <Switch label='Metro (metropolitano)' size='md' {...form.getInputProps('subway', { type: 'checkbox' })} />
            <Switch label='Metro de Superfície' size='md' {...form.getInputProps('light_rail', { type: 'checkbox' })} />
            <Switch label='Comboio' size='md' {...form.getInputProps('train', { type: 'checkbox' })} />
            <Switch label='Barco' size='md' {...form.getInputProps('boat', { type: 'checkbox' })} />
            <Switch label='Aeroporto' size='md' {...form.getInputProps('airport', { type: 'checkbox' })} />
            <Switch label='Bicicletas Partilhadas' size='md' {...form.getInputProps('bike_sharing', { type: 'checkbox' })} />
            <Switch label='Estacionamento de Bicicletas' size='md' {...form.getInputProps('bike_parking', { type: 'checkbox' })} />
            <Switch label='Estacionamento de Automóveis' size='md' {...form.getInputProps('car_parking', { type: 'checkbox' })} />
          </SimpleGrid>
        </Section>
        <Divider />
        <Section>
          <SectionTitle>Notas gerais</SectionTitle>
          <Textarea aria-label='Notas gerais sobre a paragem' placeholder='Notas gerais sobre a paragem' autosize minRows={5} maxRows={15} {...form.getInputProps('stop_remarks')} />
        </Section>
      </form>
    </Pannel>
  );
}
