'use client';

/* * */

import { Anchor, Avatar, Group, Stack, Text } from '@mantine/core';
import { useTranslations } from 'next-intl';

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
					<Text fw={700} size="sm" style={{ lineHeight: 1 }}>
						{userData.name}
					</Text>
					<Anchor c="dimmed" href={`mailto:${userData.email}`} size="xs" style={{ lineHeight: 1 }}>
						{userData.email}
					</Anchor>
				</Stack>
			</Group>
			<Text mt="md" size="sm">
				Customizable React components and hooks library with focus on usability, accessibility and developer experience
			</Text>
			<Group gap="xl" mt="md">
				<Text size="sm">
					Última atividade <b>{userData.last_active}</b>
				</Text>
			</Group>
		</>
	);

	//
}
