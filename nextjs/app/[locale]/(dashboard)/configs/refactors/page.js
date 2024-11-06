'use client';

/* * */

import AppAuthenticationCheck from '@/components/AppAuthenticationCheck/AppAuthenticationCheck';
import { AppLayoutSection } from '@/components/AppLayoutSection/AppLayoutSection';
import Pannel from '@/components/Pannel/Pannel';
import Text from '@/components/Text/Text';
import API from '@/services/API';
import notify from '@/services/notify';
import { Button, SimpleGrid } from '@mantine/core';
import { openConfirmModal } from '@mantine/modals';
import { useState } from 'react';

/* * */

export default function Page() {
	//

	//
	// A. Setup variables

	const [isImporting, setIsImporting] = useState(false);

	//
	// B. Handle actions

	const handleModifyOfferForSpecialCalendars = async () => {
		openConfirmModal({
			centered: true,
			children: <Text size="h3">Are you sure?</Text>,
			closeOnClickOutside: true,
			confirmProps: { color: 'red' },
			labels: { cancel: 'Cancel', confirm: 'Yes, Modify Offer for Special Calendars' },
			onConfirm: async () => {
				try {
					setIsImporting(true);
					notify('modifyOfferForSpecialCalendars', 'loading', 'Loading');
					await API({ method: 'GET', service: 'configs/refactors/modifyOfferForSpecialCalendars' });
					notify('modifyOfferForSpecialCalendars', 'success', 'success');
					setIsImporting(false);
				}
				catch (error) {
					console.log(error);
					notify('modifyOfferForSpecialCalendars', 'error', error.message || 'Error');
					setIsImporting(false);
				}
			},
			title: <Text size="h2">Modify Offer for Special Calendars?</Text>,
		});
	};

	const handleRemoveSpecialCalendars = async () => {
		openConfirmModal({
			centered: true,
			children: <Text size="h3">Are you sure?</Text>,
			closeOnClickOutside: true,
			confirmProps: { color: 'red' },
			labels: { cancel: 'Cancel', confirm: 'Yes, Remove Special Calendars' },
			onConfirm: async () => {
				try {
					setIsImporting(true);
					notify('removeSpecialCalendars', 'loading', 'Loading');
					await API({ method: 'GET', service: 'configs/refactors/removeSpecialCalendars' });
					notify('removeSpecialCalendars', 'success', 'success');
					setIsImporting(false);
				}
				catch (error) {
					console.log(error);
					notify('removeSpecialCalendars', 'error', error.message || 'Error');
					setIsImporting(false);
				}
			},
			title: <Text size="h2">Remove Special Calendars?</Text>,
		});
	};

	//
	// C. Render components

	return (
		<AppAuthenticationCheck permissions={[{ action: 'admin', scope: 'configs' }]} redirect>
			<Pannel>

				<AppLayoutSection title="Offer Refactors Advanced Operations">
					<SimpleGrid cols={3}>
						<Button color="red" loading={isImporting} onClick={handleModifyOfferForSpecialCalendars}>
							Modify Offer for Special Calendars
						</Button>
						<Button color="red" loading={isImporting} onClick={handleRemoveSpecialCalendars}>
							Remove Special Calendars
						</Button>
					</SimpleGrid>
				</AppLayoutSection>

			</Pannel>
		</AppAuthenticationCheck>
	);

	//
}
