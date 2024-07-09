'use client';

/* * */

import AppAuthenticationCheck from '@/components/AppAuthenticationCheck/AppAuthenticationCheck';
import ListHeader from '@/components/ListHeader/ListHeader';
import SearchField from '@/components/SearchField/SearchField';
import { useStopsExplorerContext } from '@/contexts/StopsExplorerContext';
import { useStopsExplorerNewStopWizardContext } from '@/contexts/StopsExplorerNewStopWizardContext';
import { ActionIcon, Menu } from '@mantine/core';
import { IconDots, IconFileDownload, IconPlus, IconRefresh } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';
import useSWR from 'swr';

/* * */

export default function StopsExplorerListHeader() {
	//

	//
	// A. Setup variables

	const t = useTranslations('StopsExplorerListHeader');
	const stopsExplorerContext = useStopsExplorerContext();
	const stopsExplorerNewStopWizardContext = useStopsExplorerNewStopWizardContext();

	//
	// B. Fetch data

	const { isLoading: allStopsLoading } = useSWR('/api/stops');

	//
	// C. Render components

	return (
		<ListHeader>
			<SearchField onChange={stopsExplorerContext.updateSearchQuery} query={stopsExplorerContext.list.search_query} />
			<Menu position="bottom-end" shadow="md">
				<Menu.Target>
					<ActionIcon color="gray" loading={allStopsLoading} size="lg" variant="light">
						<IconDots size={20} />
					</ActionIcon>
				</Menu.Target>
				<Menu.Dropdown>
					<AppAuthenticationCheck permissions={[{ action: 'create', scope: 'stops' }]}>
						<Menu.Item leftSection={<IconPlus size={20} />} onClick={stopsExplorerNewStopWizardContext.openWizard}>
							{t('operations.create.title')}
						</Menu.Item>
					</AppAuthenticationCheck>
					<Menu.Divider />
					<AppAuthenticationCheck permissions={[{ action: 'export', scope: 'stops' }]}>
						<Menu.Item leftSection={<IconFileDownload size={20} />} onClick={stopsExplorerContext.exportAsFile}>
							{t('operations.export.title')}
						</Menu.Item>
					</AppAuthenticationCheck>
					<AppAuthenticationCheck permissions={[{ action: 'export', scope: 'stops' }]}>
						<Menu.Item leftSection={<IconFileDownload size={20} />} onClick={stopsExplorerContext.exportDeletedAsFile}>
							{t('operations.export_deleted.title')}
						</Menu.Item>
					</AppAuthenticationCheck>
					<Menu.Divider />
					<AppAuthenticationCheck permissions={[{ action: 'export', scope: 'stops' }]}>
						<Menu.Item leftSection={<IconFileDownload size={20} />} onClick={stopsExplorerContext.exportLinesByStop}>
							{t('operations.export_lines_by_stop.title')}
						</Menu.Item>
					</AppAuthenticationCheck>
					<Menu.Divider />
					<AppAuthenticationCheck permissions={[{ action: 'admin', scope: 'configs' }]}>
						<Menu.Item leftSection={<IconRefresh size={20} />} onClick={stopsExplorerContext.syncWithDatasets}>
							{t('operations.sync_datasets.title')}
						</Menu.Item>
					</AppAuthenticationCheck>
					<AppAuthenticationCheck permissions={[{ action: 'admin', scope: 'configs' }]}>
						<Menu.Item leftSection={<IconRefresh size={20} />} onClick={stopsExplorerContext.syncWithIntermodal}>
							{t('operations.sync_intermodal.title')}
						</Menu.Item>
					</AppAuthenticationCheck>
				</Menu.Dropdown>
			</Menu>
		</ListHeader>
	);

	//
}
