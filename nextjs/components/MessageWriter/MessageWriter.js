import { ActionIcon, Select, SimpleGrid, TextInput, Textarea, Tooltip } from '@mantine/core';
import { useForm, yupResolver } from '@mantine/form';
import { IconArrowBigUpFilled, IconPaperclip } from '@tabler/icons-react';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import useSWR, { useSWRConfig } from 'swr';

import { Default as MessageDefault } from '../../schemas/Message/default';
import { Validation as MessageValidation } from '../../schemas/Message/validation';
import API from '../../services/API';
import notify from '../../services/notify';
import Loader from '../Loader/Loader';
import styles from './MessageWriter.module.css';

export default function MessageWriter({ thread_id }) {
	//

	//
	// A. Setup variables

	const t = useTranslations('threads');
	const { data: sessionData } = useSession();
	const { mutate } = useSWRConfig();
	const [isSending, setIsSending] = useState(false);

	//
	// C. Setup form

	const form = useForm({
		clearInputErrorOnChange: true,
		initialValues: MessageDefault,
		validate: yupResolver(MessageValidation),
	});

	//
	// D. Handle actions

	const handleSend = async () => {
		if (!form.isValid()) return;
		try {
			setIsSending(true);
			form.setFieldValue('thread_id', thread_id);
			form.setFieldValue('sent_by', sessionData.user._id);
			await API({ body: form, method: 'POST', operation: 'create', service: 'messages' });
			mutate(`/api/threads/${thread_id}`);
			form.reset();
			setIsSending(false);
		}
		catch (error) {
			notify('new', 'error', error.message || t('operations.create.error'));
			setIsSending(false);
			console.log(error);
		}
	};

	return (
		<form className={styles.container} onSubmit={form.onSubmit(async () => await handleSend())}>
			<div className={styles.attach}>
				<IconPaperclip size={18} />
			</div>
			<Textarea placeholder={t('messages.content.placeholder')} {...form.getInputProps('content')} maxRows={5} minRows={1} w="100%" autosize />
			<div className={`${styles.send} ${!form.isValid() && styles.disabled}`} onClick={handleSend}>
				{isSending ? <Loader visible /> : <IconArrowBigUpFilled size={14} />}
			</div>
		</form>
	);
}
