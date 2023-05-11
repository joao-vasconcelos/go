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

  const { data: linesData, error: linesError, isLoading: linesLoading, isValidating: linesValidating } = useSWR('/api/lines');

  //
  // C. Handle actions

  const handleCreateAgency = async () => {
    try {
      setIsCreating(true);
      const response = await API({
        service: 'lines',
        operation: 'create',
        method: 'GET',
      });
      router.push(`/dashboard/lines/${response._id}`);
      notify('new', 'success', 'Linha criada com sucesso.');
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
          loading={linesLoading}
          header={
            <>
              <SearchField placeholder='Procurar...' width={'100%'} />
              <Menu shadow='md' position='bottom-end'>
                <Menu.Target>
                  <ActionIcon variant='light' size='lg' loading={linesLoading || isCreating}>
                    <IconDots size='20px' />
                  </ActionIcon>
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Label>Importar</Menu.Label>
                  <Menu.Item icon={<IconCirclePlus size='20px' />} onClick={handleCreateAgency}>
                    Nova Linha
                  </Menu.Item>
                  <Menu.Label>Exportar</Menu.Label>
                  <Menu.Item icon={<IconArrowBarToDown size='20px' />}>Download line.txt</Menu.Item>
                </Menu.Dropdown>
              </Menu>
            </>
          }
          footer={linesData && (linesData.length === 1 ? <FooterText text={`Encontrada 1 Linha`} /> : <FooterText text={`Encontradas ${linesData.length} Linhas`} />)}
        >
          <ErrorDisplay error={linesError} loading={linesValidating} />
          {linesData && linesData.length > 0 ? (
            linesData.map((item) => <ListItem key={item._id} _id={item._id} line_short_name={item.line_short_name} line_long_name={item.line_long_name} line_color={item.line_color} line_text_color={item.line_tex} />)
          ) : (
            <NoDataLabel />
          )}
        </Pannel>
      }
      second={children}
    />
  );
}
