import useSWR from 'swr';
import PageContainer from '../../components/PageContainer';
import { useState } from 'react';
import { useRouter } from 'next/router';
import Toolbar from '../../components/Toolbar';
import TableSort from '../../components/tableSort';
import { IoAdd } from 'react-icons/io5';
import Button from '../../components/Button';

export default function StopsList(props) {
  //
  const router = useRouter();

  const { data: stops } = useSWR('/api/stops/');

  function handleCreateCustomer() {
    router.push('/stops/create');
  }

  return (
    <PageContainer title={'Stops'}>
      <Toolbar>
        <Button icon={<IoAdd />} label={'Create'} onClick={handleCreateCustomer} />
      </Toolbar>
      {stops && <TableSort data={stops} />}
    </PageContainer>
  );
}
