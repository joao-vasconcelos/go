import useSWR from 'swr';
import PageContainer from '../../components/PageContainer';
import { useState } from 'react';
import TableSort from '../../components/tableSort';

export default function BaseDemo(props) {
  //

  const { data: stops } = useSWR('/api/stops/');

  return <PageContainer title={'Stops'}>{stops && <TableSort data={stops} />}</PageContainer>;
}
