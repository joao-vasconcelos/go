'use client';

import { styled } from '@stitches/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Alert, SimpleGrid } from '@mantine/core';
import useSWR from 'swr';
import API from '../../../services/API';
import TwoUnevenColumns from '../../../layouts/TwoUnevenColumns';
import Flex from '../../../layouts/Flex';
import Pannel from '../../../layouts/Pannel';
import { Button, Group, Text, Modal, Select, Stack } from '@mantine/core';
import ListItem from './listItem';
import { TextInput, ActionIcon, Menu } from '@mantine/core';
import { TbCirclePlus, TbArrowBarToDown, TbDots, TbAlertTriangleFilled, TbArrowRight } from 'react-icons/tb';
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

  const { data: agenciesData, error: agenciesError, isLoading: agenciesLoading, isValidating: agenciesValidating } = useSWR('/api/agencies/');

  //
  // C. Handle actions

  const handleCreateAgency = async () => {
    try {
      setIsCreating(true);
      const response = await API({
        service: 'agencies',
        operation: 'create',
        method: 'GET',
      });
      router.push(`/dashboard/agencies/${response.agency_id}`);
      notify('new', 'success', 'Agência criada com sucesso.');
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
          header={
            <>
              <SearchField placeholder='Procurar...' width={'100%'} />
              <Menu shadow='md' position='bottom-end'>
                <Menu.Target>
                  <ActionIcon variant='light' size='lg' loading={agenciesLoading || isCreating}>
                    <TbDots size='20px' />
                  </ActionIcon>
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Label>Importar</Menu.Label>
                  <Menu.Item icon={<TbCirclePlus size='20px' />} onClick={handleCreateAgency}>
                    Nova Agência
                  </Menu.Item>
                  <Menu.Label>Exportar</Menu.Label>
                  <Menu.Item icon={<TbArrowBarToDown size='20px' />}>Download agency.txt</Menu.Item>
                </Menu.Dropdown>
              </Menu>
            </>
          }
          footer={agenciesData && (agenciesData.length === 1 ? <FooterText text={`Encontrada 1 Agência`} /> : <FooterText text={`Encontradas ${agenciesData.length} Agências`} />)}
        >
          <ErrorDisplay error={agenciesError} loading={agenciesValidating} />
          {agenciesData && agenciesData.length > 0 ? agenciesData.map((item) => <ListItem key={item.agency_id} agency_id={item.agency_id} agency_name={item.agency_name} />) : <NoDataLabel />}
        </Pannel>
      }
      second={children}
    />
  );
}
