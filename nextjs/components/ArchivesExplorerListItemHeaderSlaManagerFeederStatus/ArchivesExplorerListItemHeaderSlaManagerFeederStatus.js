'use client';

/* * */

// import { useTranslations } from 'next-intl';
import { useArchivesExplorerItemContext } from '@/contexts/ArchivesExplorerItemContext';
import { IconClockCog, IconExclamationCircle, IconRosetteDiscountCheck } from '@tabler/icons-react';

/* * */

export default function ArchivesExplorerListItemHeaderSlaManagerFeederStatus() {
	//

	//
	// A. Setup variables

	// const t = useTranslations('ArchivesExplorerListItemHeaderSlaManagerFeederStatus');
	const archivesExplorerItemContext = useArchivesExplorerItemContext();

	//
	// B. Render components

	switch (archivesExplorerItemContext.item_data.slamanager_feeder_status) {
	case 'pending':
		return <IconClockCog size={20} />;
	case 'processed':
		return <IconRosetteDiscountCheck size={20} />;
	case 'error':
		return <IconExclamationCircle size={20} />;
	}

	//
}