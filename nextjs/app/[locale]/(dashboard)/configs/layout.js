/* * */

import AppAuthenticationCheck from '@/components/AppAuthenticationCheck/AppAuthenticationCheck';
import { OneFullColumn } from '@/components/Layouts/Layouts';

/* * */

export default function Layout({ children }) {
	return (
		<AppAuthenticationCheck permissions={[{ action: 'admin', scope: 'configs' }]} redirect>
			<OneFullColumn first={children} />
		</AppAuthenticationCheck>
	);
}
