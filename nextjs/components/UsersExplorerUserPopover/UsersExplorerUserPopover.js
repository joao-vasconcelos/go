'use client';

/* * */

import { useTranslations } from 'next-intl';
import { Anchor, Avatar, Group, Stack, Text } from '@mantine/core';

/* * */

export default function UsersExplorerUserPopover({ userData }) {
	//

	//
	// A. Setup variables

	const t = useTranslations('UsersExplorerUserPopover');

	//
	// B. Render components

	return (
		<>
			<Group>
				<Avatar radius="xl" size="md">
					{userData.name.substring(0, 2)}
				</Avatar>
				<Stack gap={5}>
					<Text size="sm" fw={700} style={{ lineHeight: 1 }}>
						{userData.name}
					</Text>
					<Anchor href={`mailto:${userData.email}`} c="dimmed" size="xs" style={{ lineHeight: 1 }}>
						{userData.email}
					</Anchor>
				</Stack>
			</Group>
			<Text size="sm" mt="md">
        Customizable React components and hooks library with focus on usability, accessibility and developer experience
			</Text>
			<Group mt="md" gap="xl">
				<Text size="sm">
          Última atividade <b>{userData.last_active}</b>
				</Text>
			</Group>
		</>
	);

	//
}