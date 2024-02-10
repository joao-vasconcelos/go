'use client';

/* * */

import { Table } from '@mantine/core';
import { useRouter } from '@/translations/navigation';
import styles from './IssuesExplorerListTableRow.module.css';
import IssuesExplorerAttributeStatus from '@/components/IssuesExplorerAttributeStatus/IssuesExplorerAttributeStatus';
import IssuesExplorerAttributePriority from '@/components/IssuesExplorerAttributePriority/IssuesExplorerAttributePriority';
import TagsExplorerTag from '@/components/TagsExplorerTag/TagsExplorerTag';
import UsersExplorerUser from '@/components/UsersExplorerUser/UsersExplorerUser';
import GlobalDateFormatter from '../GlobalDateFormatter/GlobalDateFormatter';

/* * */

export default function IssuesExplorerListTableRow({ item }) {
  //

  //
  // A. Setup variables

  const router = useRouter();

  //
  // B. Handle actions

  const handleClick = () => {
    router.push(`/dashboard/issues/${item._id}`);
  };

  //
  // C. Render components

  return (
    <Table.Tr key={item._id} onClick={handleClick} className={styles.container}>
      <Table.Td miw={180}>
        <div className={`${styles.columnWrapper}`}>
          <IssuesExplorerAttributeStatus value={item.status} />
        </div>
      </Table.Td>
      <Table.Td miw={180}>
        <div className={`${styles.columnWrapper}`}>
          <IssuesExplorerAttributePriority value={item.priority} />
        </div>
      </Table.Td>
      <Table.Td w="100%">
        <div className={`${styles.columnWrapper}`}>
          <div className={styles.titleWrapper}>
            <p className={styles.issueCode}>#{item.code}</p>
            <p className={styles.issueTitle}>{item.title}</p>
            <div className={styles.tagsWrapper}>
              {item.tags.map((tagId) => (
                <TagsExplorerTag key={tagId} tagId={tagId} />
              ))}
            </div>
          </div>
        </div>
      </Table.Td>
      <Table.Td miw={250}>
        <div className={`${styles.columnWrapper}`}>
          <UsersExplorerUser userId={item.created_by} type="full" withHoverCard={false} />
        </div>
      </Table.Td>
      <Table.Td miw={180}>
        <div className={`${styles.columnWrapper}`}>
          <GlobalDateFormatter value={item.created_at} />
        </div>
      </Table.Td>
    </Table.Tr>
  );

  //
}
