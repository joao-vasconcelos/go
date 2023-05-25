'use client';

import { styled } from '@stitches/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import useSWR from 'swr';
import API from '../../../../services/API';
import { TwoUnevenColumns } from '../../../../components/Layouts/Layouts';
import Pannel from '../../../../components/Pannel/Pannel';
import ListItem from './listItem';
import { TextInput, ActionIcon, Menu } from '@mantine/core';
import { IconCirclePlus, IconArrowBarToDown, IconDots } from '@tabler/icons-react';
import notify from '../../../../services/notify';
import NoDataLabel from '../../../../components/NoDataLabel';
import ErrorDisplay from '../../../../components/ErrorDisplay';
import FooterText from '../../../../components/lists/FooterText';
import { useTranslations } from 'next-intl';
import ListFooter from '../../../../components/ListFooter/ListFooter';
import AuthGate from '../../../../components/AuthGate/AuthGate';

const SearchField = styled(TextInput, {
  width: '100%',
});

export default function Layout({ children }) {
  //

  //
  // A. Setup variables

  const router = useRouter();
  const t = useTranslations('lines');

  const [isCreating, setIsCreating] = useState(false);

  //
  // B. Fetch data

  const { data: linesData, error: linesError, isLoading: linesLoading, isValidating: linesValidating } = useSWR('/api/lines');

  //
  // C. Handle actions

  const handleCreate = async () => {
    try {
      setIsCreating(true);
      notify('new', 'loading', t('operations.create.loading'));
      const response = await API({ service: 'lines', operation: 'create', method: 'GET' });
      router.push(`/dashboard/lines/${response._id}`);
      notify('new', 'success', t('operations.create.success'));
      setIsCreating(false);
    } catch (err) {
      notify('new', 'error', err.message || t('operations.create.error'));
      setIsCreating(false);
      console.log(err);
    }
  };

  //
  // D. Render data

  return (
    <AuthGate permission='lines_view' redirect>
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
                    <Menu.Item icon={<IconCirclePlus size='20px' />} onClick={handleCreate}>
                      {t('operations.create.title')}
                    </Menu.Item>
                    <Menu.Label>Exportar</Menu.Label>
                    <Menu.Item icon={<IconArrowBarToDown size='20px' />}>Download line.txt</Menu.Item>
                  </Menu.Dropdown>
                </Menu>
              </>
            }
            footer={linesData && <ListFooter>{t('list.footer', { count: linesData.length })}</ListFooter>}
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
    </AuthGate>
  );
}
