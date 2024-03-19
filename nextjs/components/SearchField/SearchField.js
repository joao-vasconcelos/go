import styles from './SearchField.module.css';
import { ActionIcon, TextInput } from '@mantine/core';
import { IconSearch, IconX } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';

export default function SearchField({ query, onChange, placeholder }) {
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
        value={query}
        placeholder={placeholder || t('placeholder')}
        icon={<IconSearch size={16} />}
        onChange={handleChange}
        rightSection={
          query && (
            <ActionIcon variant="subtle" onClick={handleClear}>
              <IconX size={16} />
            </ActionIcon>
          )
        }
      />
    </div>
  );
}
