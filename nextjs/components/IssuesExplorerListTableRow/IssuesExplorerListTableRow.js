'use client';

/* * */

import IssuesExplorerAttributePriority from '@/components/IssuesExplorerAttributePriority/IssuesExplorerAttributePriority';
import IssuesExplorerAttributeStatus from '@/components/IssuesExplorerAttributeStatus/IssuesExplorerAttributeStatus';
import TagsExplorerTag from '@/components/TagsExplorerTag/TagsExplorerTag';
import UsersExplorerUser from '@/components/UsersExplorerUser/UsersExplorerUser';
import { useRouter } from '@/translations/navigation';
import { Table } from '@mantine/core';

import GlobalDateFormatter from '../GlobalDateFormatter/GlobalDateFormatter';
import styles from './IssuesExplorerListTableRow.module.css';

/* * */

export default function IssuesExplorerListTableRow({ item }) {
	//

	//
	// A. Setup variables

	const router = useRouter();

	//
	// B. Handle actions

	const handleClick = () => {
		router.push(`/issues/${item._id}`);
	};

	//
	// C. Render components

	return (
		<Table.Tr key={item._id} className={styles.container} onClick={handleClick}>
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
							{item.tags.map(tagId => <TagsExplorerTag key={tagId} tagId={tagId} />)}
						</div>
					</div>
				</div>
			</Table.Td>
			<Table.Td miw={250}>
				<div className={`${styles.columnWrapper}`}>
					<UsersExplorerUser type="full" userId={item.created_by} withHoverCard={false} />
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
