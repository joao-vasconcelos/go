'use client';

/* * */

import AppAuthenticationCheck from '@/components/AppAuthenticationCheck/AppAuthenticationCheck';
import { Section } from '@/components/Layouts/Layouts';
import Pannel from '@/components/Pannel/Pannel';
import Text from '@/components/Text/Text';
import { SimpleGrid } from '@mantine/core';
import useSWR from 'swr';

/* * */

export default function Page() {
	//

	//
	// A. Setup variables

	const { data: allRoutesData } = useSWR('/api/routes');

	//
	// E. Render components

	return (
		<AppAuthenticationCheck permissions={[{ action: 'admin', scope: 'configs' }]} redirect>
			<Pannel>
				<Section>
					<Text size="h2">All Route Ids</Text>
					{allRoutesData
					&& (
						<SimpleGrid cols={1}>
							{allRoutesData.map(route => (
								<div key={route._id}>
									{route.code} - {route._id} - {route.parent_line}
								</div>
							))}
						</SimpleGrid>
					)}
				</Section>
			</Pannel>
		</AppAuthenticationCheck>
	);

	//
}
