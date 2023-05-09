'use client';

import { styled } from '@stitches/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import useSWR from 'swr';
import API from '../../../services/API';
import { TwoUnevenColumns } from '../../../components/Layouts/Layouts';
import Pannel from '../../../components/Pannel/Pannel';
import ListItem from './listItem';
import { TextInput, ActionIcon, Menu } from '@mantine/core';
import { TbCirclePlus, TbArrowBarToDown, TbDots } from 'react-icons/tb';
import notify from '../../../services/notify';
import NoDataLabel from '../../../components/NoDataLabel';
import ErrorDisplay from '../../../components/ErrorDisplay';
import FooterText from '../../../components/lists/FooterText';

const SearchField = styled(TextInput, {
  width: '100%',
});

export default function Layout({ children }) {
  //

  //
  // A. Setup variables

  const router = useRouter();

  const [isCreating, setIsCreating] = useState(false);

  //
  // B. Fetch data

  const { data: calendarsData, error: calendarsError, isLoading: calendarsLoading, isValidating: calendarsValidating } = useSWR('/api/calendars');

  //
  // C. Handle actions

  const handleCreateCalendar = async () => {
    try {
      setIsCreating(true);
      const response = await API({
        service: 'calendars',
        operation: 'create',
        method: 'GET',
      });
      router.push(`/dashboard/calendars/${response._id}`);
      notify('new', 'success', 'Calendário criado com sucesso.');
      setIsCreating(false);
    } catch (err) {
      setIsCreating(false);
      console.log(err);
      notify('new', 'error', err.message);
    }
  };

  //
  // D. Render data

  return (
    <TwoUnevenColumns
      first={
        <Pannel
          loading={calendarsLoading}
          header={
            <>
              <SearchField placeholder='Procurar...' width={'100%'} />
              <Menu shadow='md' position='bottom-end'>
                <Menu.Target>
                  <ActionIcon variant='light' size='lg' loading={calendarsLoading || isCreating}>
                    <TbDots size='20px' />
                  </ActionIcon>
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Label>Importar</Menu.Label>
                  <Menu.Item icon={<TbCirclePlus size='20px' />} onClick={handleCreateCalendar}>
                    Novo Calendário
                  </Menu.Item>
                  <Menu.Label>Exportar</Menu.Label>
                  <Menu.Item icon={<TbArrowBarToDown size='20px' />}>Download calendar_dates.txt</Menu.Item>
                  <Menu.Label>Dados Relacionados</Menu.Label>
                  <Menu.Item icon={<TbArrowBarToDown size='20px' />} onClick={() => router.push('/dashboard/dates')}>
                    Editar Datas
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            </>
          }
          footer={calendarsData && (calendarsData.length === 1 ? <FooterText text={`Encontrado 1 Calendário`} /> : <FooterText text={`Encontrados ${calendarsData.length} Calendários`} />)}
        >
          <ErrorDisplay error={calendarsError} loading={calendarsValidating} />
          {calendarsData && calendarsData.length > 0 ? calendarsData.map((item) => <ListItem key={item._id} _id={item._id} code={item.code} name={item.name} />) : <NoDataLabel />}
        </Pannel>
      }
      second={children}
    />
  );
}
