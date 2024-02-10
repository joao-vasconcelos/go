'use client';

/* * */

import { useMemo } from 'react';
import { Box, Combobox, useCombobox } from '@mantine/core';
import { IconCircle, IconCircleCheckFilled } from '@tabler/icons-react';
import NoDataLabel from '@/components/NoDataLabel/NoDataLabel';
import styles from './IssuesExplorerFilterByAuthor.module.css';
import UsersExplorerUser from '../UsersExplorerUser/UsersExplorerUser';
import GlobalFilterButton from '../GlobalFilterByButton/GlobalFilterByButton';

/* * */

export default function IssuesExplorerFilterByAuthor({ options, value, onChange }) {
  //

  //
  // A. Setup variables

  const combobox = useCombobox();

  //
  // B. Transform data

  const allOptionsFormatted = useMemo(() => {
    // Exit if no data is available
    if (!options) return [];
    // For each status check if it associated with the current issue or not
    return options.map((item) => ({ value: item, is_selected: value === item }));
    //
  }, [options, value]);

  //
  // C. Render components

  const handleOptionSubmit = (chosenValue) => {
    onChange(chosenValue);
    // combobox.closeDropdown();
  };

  //
  // D. Render components

  return (
    <Combobox store={combobox} onOptionSubmit={handleOptionSubmit} withinPortal={false} position="bottom-start" shadow="md" withArrow>
      <Combobox.Target>
        <Box onClick={combobox.toggleDropdown} className={styles.target}>
          <GlobalFilterButton label="Author" active />
        </Box>
      </Combobox.Target>
      <Combobox.Dropdown className={styles.dropdown}>
        {allOptionsFormatted.length > 0 ? (
          allOptionsFormatted.map((itemData) => (
            <Combobox.Option key={itemData.value} value={itemData.value} className={styles.option}>
              {itemData.is_selected ? <IconCircleCheckFilled size={18} /> : <IconCircle size={18} />}
              <UsersExplorerUser userId={itemData.value} type="full" withHoverCard={false} />
            </Combobox.Option>
          ))
        ) : (
          <NoDataLabel fill />
        )}
      </Combobox.Dropdown>
    </Combobox>
  );
}
