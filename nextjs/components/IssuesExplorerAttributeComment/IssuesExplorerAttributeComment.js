'use client';

/* * */

import { useTranslations } from 'next-intl';
import { IconPencil, IconBroadcast, IconBolt, IconHandStop, IconDiscountCheck, IconTag } from '@tabler/icons-react';
import styles from './IssuesExplorerAttributeComment.module.css';
import { Divider, Timeline } from '@mantine/core';
import UsersExplorerUser from '../UsersExplorerUser/UsersExplorerUser';
import TagsExplorerTag from '../TagsExplorerTag/TagsExplorerTag';

/* * */

export default function IssuesExplorerAttributeComment({ commentData }) {
  //

  //
  // A. Setup variables

  const t = useTranslations('IssuesExplorerAttributeComment');

  //
  // B. Render components

  return (
    <div className={styles.container}>
      <div className={styles.commentHeader}>
        <UsersExplorerUser userId={commentData.created_by} type="simple" />
        <p className={styles.createdAt}>{t('created_at', { value: new Date(commentData.created_at) })}</p>
      </div>
      <div className={styles.commentText}>{commentData.text}</div>
    </div>
  );

  //
}
