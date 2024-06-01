'use client';

/* * */

import { Group, Text } from '@mantine/core';
import { Dropzone, MIME_TYPES } from '@mantine/dropzone';
import { IconFileZip, IconUpload, IconX } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

/* * */

const MAX_FILE_SIZE = 100000000;

/* * */

export default function GTFSParser({ onParse }) {
	//

	//
	// A. Setup variables

	const t = useTranslations('GTFSParser');
	const [isUploading, setIsUploading] = useState(false);
	const [hasUploadError, setHasUploadError] = useState(false);

	//
	// B. Handle actions

	const handleUpload = async (files) => {
		try {
			setIsUploading(true);
			const formData = new FormData();
			formData.append('file', files[0]);
			const res = await fetch('/api/parse/gtfs', { body: formData, method: 'POST' });
			const data = await res.json();
			onParse(data);
			setIsUploading(false);
			setHasUploadError(false);
		}
		catch (error) {
			console.log(error);
			setIsUploading(false);
		}
	};

	//
	// C. Render components

	return (
		<Dropzone accept={[MIME_TYPES.zip]} loading={isUploading} maxSize={MAX_FILE_SIZE} onDrop={handleUpload}>
			<Dropzone.Accept>
				<Group position="center" spacing="xl" style={{ height: 100, pointerEvents: 'none' }}>
					<IconUpload size="3.2rem" stroke={1.5} />
					<div>
						<Text size="xl">{t('accept.title')}</Text>
						<Text size="sm">{t('accept.description')}</Text>
					</div>
				</Group>
			</Dropzone.Accept>
			<Dropzone.Reject>
				<Group position="center" spacing="xl" style={{ height: 100, pointerEvents: 'none' }}>
					<IconX size="3.2rem" stroke={1.5} />
					<div>
						<Text size="xl">{t('reject.title')}</Text>
						<Text size="sm">{t('reject.description')}</Text>
					</div>
				</Group>
			</Dropzone.Reject>
			<Dropzone.Idle>
				<Group position="center" spacing="xl" style={{ height: 100, pointerEvents: 'none' }}>
					<IconFileZip size={50} stroke={1.5} />
					<div>
						<Text size="xl">{t('idle.title')}</Text>
						<Text size="sm">{t('idle.description', { max_file_size_unit: 'MB', max_file_size_value: 5 })}</Text>
					</div>
				</Group>
			</Dropzone.Idle>
		</Dropzone>
	);

	//
}
