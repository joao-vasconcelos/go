/* * */

import { OneFullColumn } from '@/components/Layouts/Layouts';
import NoDataLabel from '@/components/NoDataLabel/NoDataLabel';

/* * */

export default function Page() {
  return <OneFullColumn first={<NoDataLabel text={'Coming Soon'} fill />} />;
}
