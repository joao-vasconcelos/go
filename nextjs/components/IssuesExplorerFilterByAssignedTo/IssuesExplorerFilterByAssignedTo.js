'use client';

/* * */

import { useMemo } from 'react';
import { IssueOptions } from '@/schemas/Issue/options';
import { Box, Combobox, useCombobox } from '@mantine/core';
import { IconCircle, IconCircleCheckFilled } from '@tabler/icons-react';
import IssuesExplorerAttributeStatus from '@/components/IssuesExplorerAttributeStatus/IssuesExplorerAttributeStatus';
import NoDataLabel from '@/components/NoDataLabel/NoDataLabel';
import styles from './IssuesExplorerFilterByAssignedTo.module.css';
import GlobalFilterButton from '../GlobalFilterByButton/GlobalFilterByButton';

/* * */

export default function IssuesExplorerFilterByAssignedTo({ value, onChange }) {
  //

  //
  // A. Setup variables

  const combobox = useCombobox();

  //
  // B. Transform data

  const allStatusDataFormatted = useMemo(() => {
    // Exit if no data is available
    if (!IssueOptions.status) return [];
    // For each status check if it associated with the current issue or not
    return IssueOptions.status.map((item) => ({ value: item, is_selected: value === item }));
    //
  }, [value]);

  //
  // C. Render components

  const handleOptionSubmit = (chosenValue) => {
    onChange(chosenValue);
    combobox.closeDropdown();
  };

  //
  // D. Render components

  return (
    <Combobox store={combobox} onOptionSubmit={handleOptionSubmit} withinPortal={false} position="bottom-start" shadow="md" withArrow>
      <Combobox.Target>
        <Box onClick={combobox.toggleDropdown} className={styles.target}>
          <GlobalFilterButton label="Assigned To" />
        </Box>
      </Combobox.Target>
      <Combobox.Dropdown className={styles.dropdown}>
        {allStatusDataFormatted.length > 0 ? (
          allStatusDataFormatted.map((itemData) => (
            <Combobox.Option key={itemData.value} value={itemData.value} className={styles.option}>
              {itemData.is_selected ? <IconCircleCheckFilled size={18} /> : <IconCircle size={18} />}
              <IssuesExplorerAttributeStatus status={itemData.value} />
            </Combobox.Option>
          ))
        ) : (
          <NoDataLabel fill />
        )}
      </Combobox.Dropdown>
    </Combobox>
  );

  //
}
