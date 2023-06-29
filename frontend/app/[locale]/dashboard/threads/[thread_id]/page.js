'use client';

import useSWR from 'swr';
import { useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { useRouter } from 'next-intl/client';
import { useForm, yupResolver } from '@mantine/form';
import API from '@/services/API';
import { Validation as ThreadValidation } from '@/schemas/Thread/validation';
import { Default as ThreadDefault } from '@/schemas/Thread/default';
import { Tooltip, Select, SimpleGrid, TextInput, ActionIcon, Textarea } from '@mantine/core';
import { IconTrash, IconX } from '@tabler/icons-react';
import Pannel from '@/components/Pannel/Pannel';
import Text from '@/components/Text/Text';
import { Section } from '@/components/Layouts/Layouts';
import AutoSave from '@/components/AutoSave/AutoSave';
import notify from '@/services/notify';
import { openConfirmModal } from '@mantine/modals';
import { useTranslations } from 'next-intl';
import { useSession } from 'next-auth/react';
import AuthGate, { isAllowed } from '@/components/AuthGate/AuthGate';
import MessageWriter from '@/components/MessageWriter/MessageWriter';
import ThreadViewer from '@/components/ThreadViewer/ThreadViewer';

export default function Page() {
  //

  //
  // A. Setup variables

  const router = useRouter();
  const t = useTranslations('threads');
  const [isSaving, setIsSaving] = useState(false);
  const [hasErrorSaving, setHasErrorSaving] = useState();
  const { data: session } = useSession();
  const isReadOnly = !isAllowed(session, 'agencies_edit');

  const { thread_id } = useParams();

  //
  // B. Fetch data

  const { mutate: allThreadsMutate } = useSWR('/api/threads');
  const { data: threadData, error: threadError, isLoading: threadLoading } = useSWR(thread_id && `/api/threads/${thread_id}`, { refreshInterval: 500 });

  //
  // C. Setup form

  //
  // E. Render components

  return (
    <Pannel
      loading={threadLoading}
      header={
        <>
          <Tooltip label={t('operations.close.title')} color='gray' position='bottom' withArrow>
            <ActionIcon color='gray' variant='subtle' size='lg' onClick={() => router.push('/dashboard/threads')}>
              <IconX size='20px' />
            </ActionIcon>
          </Tooltip>
          <Text size='h1' style={threadData && !threadData.subject && 'untitled'} full>
            {(threadData && threadData.subject) || t('untitled')}
          </Text>
        </>
      }
      footer={<MessageWriter thread_id={threadData && threadData._id} />}
    >
      <ThreadViewer messages={threadData && threadData.messages} />
    </Pannel>
  );
}
