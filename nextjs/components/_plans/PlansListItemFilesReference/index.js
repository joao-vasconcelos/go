'use client';

/* * */

import { PlansListItemFilesWrapper } from '@/components/_plans/PlansListItemFilesWrapper';
import MediaExplorerMedia from '@/components/MediaExplorerMedia/MediaExplorerMedia';
import MediaExplorerMediaUpload from '@/components/MediaExplorerMediaUpload/MediaExplorerMediaUpload';
import NoDataLabel from '@/components/NoDataLabel/NoDataLabel';
import { usePlansItemContext } from '@/contexts/PlansItemContext';
import { PlanOptions } from '@/schemas/Plan/options';
import { useTranslations } from 'next-intl';

/* * */

export function PlansListItemFilesReference() {
	//

	//
	// A. Setup variables

	const t = useTranslations('PlansListItemFilesReference');
	const plansItemContext = usePlansItemContext();

	//
	// B. Handle actions

	const handleUploadComplete = (result) => {
		if (result._id) {
			plansItemContext.form.setFieldValue('reference_file', result._id);
		}
	};

	const handleMediaDelete = () => {
		plansItemContext.form.setFieldValue('reference_file', null);
	};

	//
	// C. Render components

	if (plansItemContext.form.values.reference_file) {
		return (
			<PlansListItemFilesWrapper title={t('title')}>
				<MediaExplorerMedia key={plansItemContext.form.values.reference_file} mediaId={plansItemContext.form.values.reference_file} onDelete={handleMediaDelete} readOnly={plansItemContext.item.is_read_only || !plansItemContext.item.is_edit_mode} />
			</PlansListItemFilesWrapper>
		);
	}

	if (!plansItemContext.form.values.reference_file && (plansItemContext.item.is_read_only || !plansItemContext.item.is_edit_mode)) {
		return (
			<PlansListItemFilesWrapper title={t('title')}>
				<NoDataLabel />
			</PlansListItemFilesWrapper>
		);
	}

	return (
		<PlansListItemFilesWrapper title={t('title')}>
			<MediaExplorerMediaUpload onUploadComplete={handleUploadComplete} storageScope={PlanOptions.storage_scope} />
		</PlansListItemFilesWrapper>
	);

	//
}
