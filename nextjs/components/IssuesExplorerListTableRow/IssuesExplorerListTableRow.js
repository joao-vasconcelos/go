'use client';

/* * */

import { Table } from '@mantine/core';
import { useRouter } from '@/translations/navigation';
import styles from './IssuesExplorerListTableRow.module.css';
import IssuesExplorerAttributeStatus from '@/components/IssuesExplorerAttributeStatus/IssuesExplorerAttributeStatus';
import IssuesExplorerAttributePriority from '@/components/IssuesExplorerAttributePriority/IssuesExplorerAttributePriority';
import TagsExplorerTag from '@/components/TagsExplorerTag/TagsExplorerTag';
import UsersExplorerUser from '@/components/UsersExplorerUser/UsersExplorerUser';

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
      <Table.Td>
        <div className={styles.columnWrapper}>
          <IssuesExplorerAttributeStatus status={item.status} />
        </div>
      </Table.Td>
      <Table.Td>
        <div className={styles.columnWrapper}>
          <IssuesExplorerAttributePriority status={item.priority} />
        </div>
      </Table.Td>
      <Table.Td>
        <div className={styles.columnWrapper}>
          <div className={styles.titleWrapper}>
            <p className={styles.issueTitle}>{item.title}</p>
            <p className={styles.issueCode}>#{item.code}</p>
          </div>
        </div>
      </Table.Td>
      <Table.Td>
        <div className={styles.columnWrapper}>
          {item.tags.map((tagId) => (
            <TagsExplorerTag key={tagId} tagId={tagId} />
          ))}
        </div>
      </Table.Td>
      <Table.Td>
        <div className={styles.columnWrapper}>
          <UsersExplorerUser userId={item.created_by} />
        </div>
      </Table.Td>
      <Table.Td>
        <div className={styles.columnWrapper}>{item.created_at}</div>
      </Table.Td>
    </Table.Tr>
  );

  //
}
