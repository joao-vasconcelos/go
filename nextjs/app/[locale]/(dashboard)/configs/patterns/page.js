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

	const { data: allPatternsData } = useSWR('/api/patterns');

	//
	// E. Render components

	return (
		<AppAuthenticationCheck permissions={[{ action: 'admin', scope: 'configs' }]} redirect>
			<Pannel>
				<Section>
					<Text size="h2">All Pattern Ids</Text>
					{allPatternsData
					&& (
						<SimpleGrid cols={1}>
							{allPatternsData.map(pattern => (
								<div key={pattern._id}>
									{pattern.code} - {pattern._id} - {pattern.parent_route}
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
