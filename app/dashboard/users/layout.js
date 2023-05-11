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
import { IconCirclePlus, IconArrowBarToDown, IconDots } from '@tabler/icons-react';
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

  const { data: usersData, error: usersError, isLoading: usersLoading, isValidating: usersValidating } = useSWR('/api/users/');

  //
  // C. Handle actions

  const handleCreateUser = async () => {
    try {
      setIsCreating(true);
      const response = await API({
        service: 'users',
        operation: 'create',
        method: 'GET',
      });
      router.push(`/dashboard/users/${response._id}`);
      notify('new', 'success', 'Utilizador criado com sucesso.');
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
          loading={usersLoading}
          header={
            <>
              <SearchField placeholder='Procurar...' width={'100%'} />
              <Menu shadow='md' position='bottom-end'>
                <Menu.Target>
                  <ActionIcon variant='light' size='lg' loading={usersLoading || isCreating}>
                    <IconDots size='20px' />
                  </ActionIcon>
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Label>Importar</Menu.Label>
                  <Menu.Item icon={<IconCirclePlus size='20px' />} onClick={handleCreateUser}>
                    Novo Utilizador
                  </Menu.Item>
                  <Menu.Label>Exportar</Menu.Label>
                  <Menu.Item icon={<IconArrowBarToDown size='20px' />}>Download CSV</Menu.Item>
                </Menu.Dropdown>
              </Menu>
            </>
          }
          footer={usersData && (usersData.length === 1 ? <FooterText text={`Encontrado 1 Utilizador`} /> : <FooterText text={`Encontrados ${usersData.length} Utilizadores`} />)}
        >
          <ErrorDisplay error={usersError} loading={usersValidating} />
          {usersData && usersData.length > 0 ? usersData.map((item) => <ListItem key={item._id} _id={item._id} name={item.name} email={item.email} />) : <NoDataLabel />}
        </Pannel>
      }
      second={children}
    />
  );
}
