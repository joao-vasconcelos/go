import styles from './SearchField.module.css';
import { TextInput } from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';

export default function SearchField({ placeholder, onChange }) {
  //

  const t = useTranslations('SearchField');

  const handleChange = ({ target }) => {
    onChange(target.value);
  };

  return (
    <div className={styles.container}>
      <TextInput placeholder={placeholder || t('placeholder')} icon={<IconSearch size={18} />} onChange={handleChange} />
    </div>
  );
}
