'use client';

/* * */

import UsersExplorerUserAvatar from '@/components/UsersExplorerUserAvatar/UsersExplorerUserAvatar';
import UsersExplorerUserFull from '@/components/UsersExplorerUserFull/UsersExplorerUserFull';
import UsersExplorerUserPopover from '@/components/UsersExplorerUserPopover/UsersExplorerUserPopover';
import UsersExplorerUserSimple from '@/components/UsersExplorerUserSimple/UsersExplorerUserSimple';
import { Box, HoverCard } from '@mantine/core';
import useSWR from 'swr';

/* * */

export default function UsersExplorerUser({ type = 'avatar', userId, withHoverCard = true }) {
	//

	//
	// A. Fetch data

	const { data: userData } = useSWR(userId && `/api/users/${userId}`);

	//
	// B. Render components

	return userData
		? (
			<HoverCard closeDelay={200} openDelay={200} shadow="md" width={400} withArrow>
				<HoverCard.Target>
					<Box style={{ cursor: withHoverCard ? 'help' : 'inherit' }}>
						{type === 'simple' && <UsersExplorerUserSimple userData={userData} />}
						{type === 'avatar' && <UsersExplorerUserAvatar userData={userData} />}
						{type === 'full' && <UsersExplorerUserFull userData={userData} />}
					</Box>
				</HoverCard.Target>
				{withHoverCard
				&& (
					<HoverCard.Dropdown>
						<UsersExplorerUserPopover userData={userData} />
					</HoverCard.Dropdown>
				)}
			</HoverCard>
		)
		: <p>loading</p>
	;

	//
}
