/* * */

import { Divider } from '@mantine/core';
import Pannel from '@/components/Pannel/Pannel';
import RealtimeExplorerResultTripDetailHeader from '@/components/RealtimeExplorerResultTripDetailHeader/RealtimeExplorerResultTripDetailHeader';
import RealtimeExplorerResultTripDetailMap from '@/components/RealtimeExplorerResultTripDetailMap/RealtimeExplorerResultTripDetailMap';
import RealtimeExplorerResultTripDetailDescription from '@/components/RealtimeExplorerResultTripDetailDescription/RealtimeExplorerResultTripDetailDescription';

/* * */

export default function RealtimeExplorerResultTripDetail() {
  return (
    <Pannel header={<RealtimeExplorerResultTripDetailHeader />}>
      <RealtimeExplorerResultTripDetailMap />
      <Divider />
      <RealtimeExplorerResultTripDetailDescription />
    </Pannel>
  );
}
