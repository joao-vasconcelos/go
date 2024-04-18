import styles from './MessageWriter.module.css';
import { useEffect, useState } from 'react';
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
  const { data: sessionData } = useSession();
  const { mutate } = useSWRConfig();
  const [isSending, setIsSending] = useState(false);

  //
  // C. Setup form

  const form = useForm({
    clearInputErrorOnChange: true,
    validate: yupResolver(MessageValidation),
    initialValues: MessageDefault,
  });

  //
  // D. Handle actions

  const handleSend = async () => {
    if (!form.isValid()) return;
    try {
      setIsSending(true);
      form.setFieldValue('thread_id', thread_id);
      form.setFieldValue('sent_by', sessionData.user._id);
      await API({ service: 'messages', operation: 'create', method: 'POST', body: form });
      mutate(`/api/threads/${thread_id}`);
      form.reset();
      setIsSending(false);
    } catch (error) {
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
      <Textarea placeholder={t('messages.content.placeholder')} {...form.getInputProps('content')} w="100%" minRows={1} maxRows={5} autosize />
      <div className={`${styles.send} ${!form.isValid() && styles.disabled}`} onClick={handleSend}>
        {isSending ? <Loader visible /> : <IconArrowBigUpFilled size={14} />}
      </div>
    </form>
  );
}
