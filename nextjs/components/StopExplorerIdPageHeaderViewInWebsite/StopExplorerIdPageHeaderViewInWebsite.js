'use client';

/* * */

import { useStopsExplorerContext } from '@/contexts/StopsExplorerContext';
import { ActionIcon, Tooltip } from '@mantine/core';
import { IconWorldUpload } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';

/* * */

export default function StopExplorerIdPageHeaderViewInWebsite() {
	//

	//
	// A. Setup variables

	const t = useTranslations('StopExplorerIdPageHeaderViewInWebsite');
	const stopsExplorerContext = useStopsExplorerContext();

	//
	// B. Render components

	return (
		<Tooltip label={t('label')} position="bottom" withArrow>
			<ActionIcon color="blue" loading={stopsExplorerContext.page.is_loading} onClick={stopsExplorerContext.openInWebsite} size="lg" variant="subtle">
				<IconWorldUpload size={20} />
			</ActionIcon>
		</Tooltip>
	);

	//
}
