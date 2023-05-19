import styles from './MessageWriter.module.css';
import { useState } from 'react';
import useSWR, { useSWRConfig } from 'swr';
import { Tooltip, Select, SimpleGrid, TextInput, ActionIcon, Textarea } from '@mantine/core';
import { IconPaperclip, IconArrowBigUpFilled } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';
import { useForm, yupResolver } from '@mantine/form';
import API from '../../services/API';
import { Validation as MessageValidation } from '../../schemas/Message/validation';
import { Default as MessageDefault } from '../../schemas/Message/default';
import { useSession } from 'next-auth/react';
import notify from '../../services/notify';
import Loader from '../Loader/Loader';

export default function MessageWriter({ thread_id }) {
  //

  //
  // A. Setup variables

  const t = useTranslations('threads');
  const { data: session } = useSession();
  const { mutate } = useSWRConfig();
  const [isSending, setIsSending] = useState(false);

  //
  // C. Setup form

  const form = useForm({
    validateInputOnBlur: true,
    validateInputOnChange: true,
    clearInputErrorOnChange: true,
    validate: yupResolver(MessageValidation),
    initialValues: MessageDefault,
  });

  //
  // D. Handle actions

  const handleSend = async () => {
    try {
      setIsSending(true);
      const newMessage = { thread_id: thread_id, content: form.values.content, sent_by: session.user._id, files: [] };
      const response = await API({ service: 'messages', operation: 'create', method: 'POST', body: newMessage });
      mutate(`/api/threads/${thread_id}`);
      setIsSending(false);
    } catch (err) {
      notify('new', 'error', err.message || t('operations.create.error'));
      setIsSending(false);
      console.log(err);
    }
  };

  return (
    <form className={styles.container} onSubmit={form.onSubmit(async () => await handleSend())}>
      <div className={styles.attach}>
        <IconPaperclip size={18} />
      </div>
      <Textarea placeholder={t('messages.content.placeholder')} {...form.getInputProps('content')} w='100%' minRows={1} maxRows={5} autosize />
      <div className={styles.send} onClick={handleSend}>
        {isSending ? <Loader visible /> : <IconArrowBigUpFilled size={14} />}
      </div>
    </form>
  );
}
