'use client';

/* * */

import { useState } from 'react';
import API from '@/services/API';
import { SimpleGrid, Button } from '@mantine/core';
import Pannel from '@/components/Pannel/Pannel';
import Text from '@/components/Text/Text';
import notify from '@/services/notify';
import { openConfirmModal } from '@mantine/modals';
import AppAuthenticationCheck from '@/components/AppAuthenticationCheck/AppAuthenticationCheck';
import { AppLayoutSection } from '@/components/AppLayoutSection/AppLayoutSection';
import NoDataLabel from '@/components/NoDataLabel/NoDataLabel';

/* * */

export default function Page() {
	//

	//
	// A. Setup variables

	const [isImporting, setIsImporting] = useState(false);

	//
	// D. Handle actiona

	const handleAddArchiveSlaStatus = async () => {
		openConfirmModal({
			title: <Text size="h2">Add Archive SLA Status?</Text>,
			centered: true,
			closeOnClickOutside: true,
			children: <Text size="h3">Are you sure?</Text>,
			labels: { confirm: 'Yes, Add Archive SLA Status', cancel: 'Cancel' },
			confirmProps: { color: 'red' },
			onConfirm: async () => {
				try {
					setIsImporting(true);
					notify('addArchiveSlaStatus', 'loading', 'Loading');
					await API({ service: 'configs/refactors/addArchiveSlaStatus', method: 'GET' });
					notify('addArchiveSlaStatus', 'success', 'success');
					setIsImporting(false);
				} catch (error) {
					console.log(error);
					notify('addArchiveSlaStatus', 'error', error.message || 'Error');
					setIsImporting(false);
				}
			},
		});
	};

	//
	// C. Render components

	return (
		<AppAuthenticationCheck permissions={[{ scope: 'configs', action: 'admin' }]} redirect>
			<Pannel>
				<AppLayoutSection>
					<NoDataLabel text="No operations available" />
					<SimpleGrid cols={3}>
						<Button onClick={handleAddArchiveSlaStatus} color="red" loading={isImporting}>
              Add Archive SLA Status
						</Button>
					</SimpleGrid>
				</AppLayoutSection>
			</Pannel>
		</AppAuthenticationCheck>
	);

	//
}