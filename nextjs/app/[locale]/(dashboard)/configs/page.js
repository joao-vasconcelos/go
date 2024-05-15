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

	const handleResetTripAnalysis = async () => {
		openConfirmModal({
			title: <Text size="h2">Reset All Trip Analysis?</Text>,
			centered: true,
			closeOnClickOutside: true,
			children: <Text size="h3">Are you sure?</Text>,
			labels: { confirm: 'Yes, Reset All Trip Analysis', cancel: 'Cancel' },
			confirmProps: { color: 'red' },
			onConfirm: async () => {
				try {
					setIsImporting(true);
					notify('resetAllTripAnalysis', 'loading', 'Loading');
					await API({ service: 'configs/refactors/resetAllTripAnalysis', method: 'GET' });
					notify('resetAllTripAnalysis', 'success', 'success');
					setIsImporting(false);
				} catch (error) {
					console.log(error);
					notify('resetAllTripAnalysis', 'error', error.message || 'Error');
					setIsImporting(false);
				}
			},
		});
	};

	const handleRevertDeletedStop = async () => {
		openConfirmModal({
			title: <Text size="h2">Revert Deleted Stop?</Text>,
			centered: true,
			closeOnClickOutside: true,
			children: <Text size="h3">Are you sure?</Text>,
			labels: { confirm: 'Yes, Revert Deleted Stop', cancel: 'Cancel' },
			confirmProps: { color: 'red' },
			onConfirm: async () => {
				try {
					setIsImporting(true);
					notify('revertDeletedStop', 'loading', 'Loading');
					await API({ service: 'configs/refactors/revertDeletedStop', method: 'GET' });
					notify('revertDeletedStop', 'success', 'success');
					setIsImporting(false);
				} catch (error) {
					console.log(error);
					notify('revertDeletedStop', 'error', error.message || 'Error');
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
						<Button onClick={handleResetTripAnalysis} color="red" loading={isImporting}>
              Reset All Trip Analysis
						</Button>
						<Button onClick={handleRevertDeletedStop} color="red" loading={isImporting}>
              Revert Deleted Stop
						</Button>
					</SimpleGrid>
				</AppLayoutSection>
			</Pannel>
		</AppAuthenticationCheck>
	);

	//
}