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

	const { data: allLinesData } = useSWR('/api/lines');

	//
	// E. Render components

	return (
		<AppAuthenticationCheck permissions={[{ action: 'admin', scope: 'configs' }]} redirect>
			<Pannel>
				<Section>
					<Text size="h2">All Line Ids</Text>
					{allLinesData
					&& (
						<SimpleGrid cols={1}>
							{allLinesData.map(line => (
								<div key={line._id}>
									{line.code} - {line._id}
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
