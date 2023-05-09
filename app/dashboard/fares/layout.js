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

  const { data: faresData, error: faresError, isLoading: faresLoading, isValidating: faresValidating } = useSWR('/api/fares');

  //
  // C. Handle actions

  const handleCreateFare = async () => {
    try {
      setIsCreating(true);
      const response = await API({
        service: 'fares',
        operation: 'create',
        method: 'GET',
      });
      router.push(`/dashboard/fares/${response._id}`);
      notify('new', 'success', 'Tarifário criado com sucesso.');
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
          loading={faresLoading}
          header={
            <>
              <SearchField placeholder='Procurar...' width={'100%'} />
              <Menu shadow='md' position='bottom-end'>
                <Menu.Target>
                  <ActionIcon variant='light' size='lg' loading={faresLoading || isCreating}>
                    <TbDots size='20px' />
                  </ActionIcon>
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Label>Importar</Menu.Label>
                  <Menu.Item icon={<TbCirclePlus size='20px' />} onClick={handleCreateFare}>
                    Novo Tarifário
                  </Menu.Item>
                  <Menu.Label>Exportar</Menu.Label>
                  <Menu.Item icon={<TbArrowBarToDown size='20px' />}>Download fare_attributes.txt</Menu.Item>
                  <Menu.Item icon={<TbArrowBarToDown size='20px' />}>Download fare_rules.txt</Menu.Item>
                </Menu.Dropdown>
              </Menu>
            </>
          }
          footer={faresData && (faresData.length === 1 ? <FooterText text={`Encontrado 1 Tarifário`} /> : <FooterText text={`Encontrados ${faresData.length} Tarifários`} />)}
        >
          <ErrorDisplay error={faresError} loading={faresValidating} />
          {faresData && faresData.length > 0 ? (
            faresData.map((item) => <ListItem key={item._id} _id={item._id} fare_code={item.fare_code} fare_short_name={item.fare_short_name} fare_long_name={item.fare_long_name} price={item.price} currency_type={item.currency_type} />)
          ) : (
            <NoDataLabel />
          )}
        </Pannel>
      }
      second={children}
    />
  );
}
