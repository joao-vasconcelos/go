'use client';

/* * */

import { PlansList } from '@/components/_plans/PlansList';
import AppAuthenticationCheck from '@/components/AppAuthenticationCheck/AppAuthenticationCheck';
import { OneFullColumn } from '@/components/Layouts/Layouts';
import { PlansContextProvider } from '@/contexts/PlansContext';

/* * */

export function PlansMain() {
	return (
		<AppAuthenticationCheck permissions={[{ action: 'navigate', scope: 'plans' }]} redirect>
			<PlansContextProvider>
				<OneFullColumn first={<PlansList />} />
			</PlansContextProvider>
		</AppAuthenticationCheck>
	);
}
