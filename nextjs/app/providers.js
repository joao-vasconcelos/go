'use client';

/* * */

import { theme } from '@/styles/theme';
import { MantineProvider } from '@mantine/core';
import { DatesProvider } from '@mantine/dates';
import { ModalsProvider } from '@mantine/modals';
import { Notifications } from '@mantine/notifications';
import 'dayjs/locale/pt';
import { SessionProvider } from 'next-auth/react';
import { MapProvider } from 'react-map-gl/maplibre';
import { SWRConfig } from 'swr';

/* * */

export default function Providers({ children, session }) {
	//

	//
	// A. Setup SWR

	const swrOptions = {
		fetcher: async (...args) => {
			const res = await fetch(...args);
			if (!res.ok) {
				const errorDetails = await res.json();
				const error = new Error(errorDetails.message || 'An error occurred while fetching data.');
				error.description = errorDetails.description || 'No additional information was provided by the API.';
				error.status = res.status;
				throw error;
			}
			return res.json();
		},
		refreshInterval: 30000,
		revalidateOnMount: true,
	};

	//
	// B. Render components

	return (
		<SessionProvider refetchInterval={5} session={session}>
			<SWRConfig value={swrOptions}>
				<MapProvider>
					<MantineProvider defaultColorScheme="auto" theme={theme}>
						<DatesProvider settings={{ consistentWeeks: true, locale: 'pt' }}>
							<Notifications />
							<ModalsProvider>{children}</ModalsProvider>
						</DatesProvider>
					</MantineProvider>
				</MapProvider>
			</SWRConfig>
		</SessionProvider>
	);

	//
}
