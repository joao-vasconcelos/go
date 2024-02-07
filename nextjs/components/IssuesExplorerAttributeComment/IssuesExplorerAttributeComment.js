'use client';

/* * */

import { useTranslations } from 'next-intl';
import { IconPencil, IconBroadcast, IconBolt, IconHandStop, IconDiscountCheck, IconTag, IconTrash } from '@tabler/icons-react';
import styles from './IssuesExplorerAttributeComment.module.css';
import { ActionIcon, Divider, Timeline } from '@mantine/core';
import UsersExplorerUser from '../UsersExplorerUser/UsersExplorerUser';
import TagsExplorerTag from '../TagsExplorerTag/TagsExplorerTag';
import GlobalAuthorTimestamp from '../GlobalAuthorTimestamp/GlobalAuthorTimestamp';

/* * */

export default function IssuesExplorerAttributeComment({ commentData, onDelete }) {
  //

  //
  // A. Setup variables

  const t = useTranslations('IssuesExplorerAttributeComment');

  //
  // B. Render components

  return (
    <div className={styles.container}>
      <div className={styles.commentHeader}>
        <div className={styles.leftSide}>
          <GlobalAuthorTimestamp userId={commentData.created_by} timestamp={commentData.created_at} actionVerb={t('action_verb')} />
        </div>
        <div className={styles.rightSide}>
          <ActionIcon size="sm" variant="subtle" color="gray" onClick={onDelete}>
            <IconTrash size={15} />
          </ActionIcon>
        </div>
      </div>
      <div className={styles.commentText}>{commentData.text}</div>
    </div>
  );

  //
}
