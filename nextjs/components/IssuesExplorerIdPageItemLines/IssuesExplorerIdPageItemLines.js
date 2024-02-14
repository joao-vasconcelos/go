'use client';

/* * */

import useSWR from 'swr';
import { useMemo, useState } from 'react';
import { ActionIcon, Button, MultiSelect, Select } from '@mantine/core';
import { useTranslations } from 'next-intl';
import { useIssuesExplorerContext } from '@/contexts/IssuesExplorerContext';
import styles from './IssuesExplorerIdPageItemLines.module.css';
import { LinesExplorerLine } from '../LinesExplorerLine/LinesExplorerLine';
import { IconTrash } from '@tabler/icons-react';

/* * */

export default function IssuesExplorerIdPageItemLines() {
  //

  //
  // A. Setup variables

  const t = useTranslations('IssuesExplorerIdPageItemLines');
  const issuesExplorerContext = useIssuesExplorerContext();

  const [selectedLineId, setSelectedLineId] = useState(null);

  //
  // B. Fetch data

  const { data: allLinesData } = useSWR('/api/lines');

  //
  // C. Transform data

  const allLinesDataFormatted = useMemo(() => {
    // Exit if no data is available
    if (!allLinesData) return [];
    // For each line check if it related with the current issue or not
    return allLinesData.map((line) => ({ value: line._id, label: `[${line.short_name}] ${line.name}` }));
    //
  }, [allLinesData]);

  //
  // D. Handle actions

  const handleAddRelatedLine = () => {
    issuesExplorerContext.toggleRelatedLine(selectedLineId);
    setSelectedLineId(null);
  };

  const handleRemoveRelatedLine = (lineId) => {
    issuesExplorerContext.toggleRelatedLine(lineId);
  };

  //
  // E. Render components

  return (
    <div className={styles.container}>
      <div className={styles.list}>
        {issuesExplorerContext.form.values.related_lines.length > 0 &&
          issuesExplorerContext.form.values.related_lines.map((lineId) => (
            <div key={lineId} className={styles.itemWrapper}>
              <LinesExplorerLine lineId={lineId} />
              <ActionIcon onClick={() => handleRemoveRelatedLine(lineId)} variant="light" color="red">
                <IconTrash size={20} />
              </ActionIcon>
            </div>
          ))}
      </div>
      <Select label={t('related_lines.label')} placeholder={t('related_lines.placeholder')} nothingFoundMessage={t('related_lines.nothingFound')} data={allLinesDataFormatted} value={selectedLineId} onChange={setSelectedLineId} limit={100} w="100%" />
      <Button onClick={handleAddRelatedLine}>Add Related Line</Button>
    </div>
  );
}
