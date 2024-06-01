import { ActionIcon, TextInput } from '@mantine/core';
import { IconSearch, IconX } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';

import styles from './SearchField.module.css';

export default function SearchField({ onChange, placeholder, query }) {
	//

	const t = useTranslations('SearchField');

	const handleChange = ({ target }) => {
		onChange(target.value);
	};

	const handleClear = () => {
		onChange('');
	};

	return (
		<div className={styles.container}>
			<TextInput
				icon={<IconSearch size={16} />}
				onChange={handleChange}
				placeholder={placeholder || t('placeholder')}
				value={query}
				rightSection={
					query
					&& (
						<ActionIcon onClick={handleClear} variant="subtle">
							<IconX size={16} />
						</ActionIcon>
					)

				}
			/>
		</div>
	);
}
