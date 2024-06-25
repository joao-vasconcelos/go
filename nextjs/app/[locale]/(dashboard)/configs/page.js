'use client';

/* * */

import AppAuthenticationCheck from '@/components/AppAuthenticationCheck/AppAuthenticationCheck';
import { AppLayoutSection } from '@/components/AppLayoutSection/AppLayoutSection';
import NoDataLabel from '@/components/NoDataLabel/NoDataLabel';
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
	// D. Handle actiona

	const handleResetTripAnalysis = async () => {
		openConfirmModal({
			centered: true,
			children: <Text size="h3">Are you sure?</Text>,
			closeOnClickOutside: true,
			confirmProps: { color: 'red' },
			labels: { cancel: 'Cancel', confirm: 'Yes, Reset All Trip Analysis' },
			onConfirm: async () => {
				try {
					setIsImporting(true);
					notify('resetAllTripAnalysis', 'loading', 'Loading');
					await API({ method: 'GET', service: 'configs/refactors/resetAllTripAnalysis' });
					notify('resetAllTripAnalysis', 'success', 'success');
					setIsImporting(false);
				}
				catch (error) {
					console.log(error);
					notify('resetAllTripAnalysis', 'error', error.message || 'Error');
					setIsImporting(false);
				}
			},
			title: <Text size="h2">Reset All Trip Analysis?</Text>,
		});
	};

	// const handleImportNewStopNames = async () => {
	// 	openConfirmModal({
	// 		centered: true,
	// 		children: <Text size="h3">Are you sure?</Text>,
	// 		closeOnClickOutside: true,
	// 		confirmProps: { color: 'red' },
	// 		labels: { cancel: 'Cancel', confirm: 'Yes, Import New Stop Names' },
	// 		onConfirm: async () => {
	// 			try {
	// 				setIsImporting(true);
	// 				notify('importNewStopNames', 'loading', 'Loading');
	// 				await API({ method: 'GET', service: 'configs/imports/stops/new_stop_names' });
	// 				notify('importNewStopNames', 'success', 'success');
	// 				setIsImporting(false);
	// 			}
	// 			catch (error) {
	// 				console.log(error);
	// 				notify('importNewStopNames', 'error', error.message || 'Error');
	// 				setIsImporting(false);
	// 			}
	// 		},
	// 		title: <Text size="h2">Import New Stop Names?</Text>,
	// 	});
	// };

	// const handleRemoveSpecialCalendars = async () => {
	// 	openConfirmModal({
	// 		title: <Text size="h2">Remove Special Calendars?</Text>,
	// 		centered: true,
	// 		closeOnClickOutside: true,
	// 		children: <Text size="h3">Are you sure?</Text>,
	// 		labels: { confirm: 'Yes, Remove Special Calendars', cancel: 'Cancel' },
	// 		confirmProps: { color: 'red' },
	// 		onConfirm: async () => {
	// 			try {
	// 				setIsImporting(true);
	// 				notify('removeSpecialCalendars', 'loading', 'Loading');
	// 				await API({ service: 'configs/refactors/removeSpecialCalendars', method: 'GET' });
	// 				notify('removeSpecialCalendars', 'success', 'success');
	// 				setIsImporting(false);
	// 			} catch (error) {
	// 				console.log(error);
	// 				notify('removeSpecialCalendars', 'error', error.message || 'Error');
	// 				setIsImporting(false);
	// 			}
	// 		},
	// 	});
	// };

	//
	// C. Render components

	return (
		<AppAuthenticationCheck permissions={[{ action: 'admin', scope: 'configs' }]} redirect>
			<Pannel>
				<AppLayoutSection>
					{/* <NoDataLabel text="No operations available" /> */}
					<SimpleGrid cols={3}>
						<Button color="red" loading={isImporting} onClick={handleResetTripAnalysis}>
							Reset All Trip Analysis
						</Button>
						{/* <Button color="red" loading={isImporting} onClick={handleImportNewStopNames}>
							Import New Stop Names
						</Button> */}
					</SimpleGrid>
				</AppLayoutSection>
			</Pannel>
		</AppAuthenticationCheck>
	);

	//
}
