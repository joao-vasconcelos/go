/* * */

import { useTranslations } from 'next-intl';

import MediaExplorerMediaUpload from '../MediaExplorerMediaUpload/MediaExplorerMediaUpload';

/* * */

export default function MediaExplorerPage() {
	//

	//
	// A. Setup variables

	const t = useTranslations('MediaExplorerPage');

	//
	// B. Render components

	return <MediaExplorerMediaUpload />;

	//
}
