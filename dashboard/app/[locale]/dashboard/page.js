import { OneFullColumn } from '@/components/Layouts/Layouts';
import NoDataLabel from '@/components/NoDataLabel/NoDataLabel';
import TripsOverview from '@/components/TripsOverview/TripsOverview';

export default function Page() {
  return (
    <OneFullColumn
      first={
        <>
          {/* <NoDataLabel text={'Coming Soon'} fill /> */}
          <TripsOverview />
        </>
      }
    />
  );
}
