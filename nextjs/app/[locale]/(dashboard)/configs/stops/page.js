'use client';

/* * */

import AppAuthenticationCheck from '@/components/AppAuthenticationCheck/AppAuthenticationCheck';
import { AppLayoutSection } from '@/components/AppLayoutSection/AppLayoutSection';
import Pannel from '@/components/Pannel/Pannel';
import Text from '@/components/Text/Text';
import API from '@/services/API';
import notify from '@/services/notify';
import { Button, SimpleGrid, TextInput } from '@mantine/core';
import { openConfirmModal } from '@mantine/modals';
import { useState } from 'react';

/* * */

export default function Page() {
	//

	//
	// A. Setup variables

	const [isImporting, setIsImporting] = useState(false);

	const [textInputValue, setTextInputValue] = useState('');

	//
	// B. Handle actions

	const handleRevertDeletedStop = async () => {
		openConfirmModal({
			centered: true,
			children: <Text size="h3">Are you sure?</Text>,
			closeOnClickOutside: true,
			confirmProps: { color: 'red' },
			labels: { cancel: 'Cancel', confirm: 'Yes, Revert Deleted Stop' },
			onConfirm: async () => {
				try {
					setIsImporting(true);
					notify('revertDeletedStop', 'loading', 'Loading');
					await API({ method: 'GET', service: `stops/${textInputValue}/revert` });
					notify('revertDeletedStop', 'success', 'success');
					setIsImporting(false);
				}
				catch (error) {
					console.log(error);
					notify('revertDeletedStop', 'error', error.message || 'Error');
					setIsImporting(false);
				}
			},
			title: <Text size="h2">Revert Deleted Stop?</Text>,
		});
	};

	//
	// C. Render components

	return (
		<AppAuthenticationCheck permissions={[{ action: 'admin', scope: 'configs' }]} redirect>
			<Pannel>

				<AppLayoutSection title="Offer Stops Advanced Operations">
					<SimpleGrid cols={3}>
						<TextInput onChange={event => setTextInputValue(event.currentTarget.value)} placeholder="Enter Stop Code" value={textInputValue} />
						<Button color="red" loading={isImporting} onClick={handleRevertDeletedStop}>
							Revert Deleted Stop
						</Button>
					</SimpleGrid>
				</AppLayoutSection>

			</Pannel>
		</AppAuthenticationCheck>
	);

	//
}
