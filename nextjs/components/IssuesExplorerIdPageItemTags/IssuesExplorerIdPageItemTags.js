'use client';

/* * */

import { useTranslations } from 'next-intl';
import { Button, Modal, SimpleGrid, TextInput } from '@mantine/core';
import { useIssuesExplorerContext } from '@/contexts/IssuesExplorerContext';
import TagsExplorerTag from '@/components/TagsExplorerTag/TagsExplorerTag';
import useSWR from 'swr';
import styles from './IssuesExplorerIdPageItemTags.module.css';
import { useMemo, useState } from 'react';
import NoDataLabel from '@/components/NoDataLabel/NoDataLabel';
import { IconCircle, IconCircleCheckFilled } from '@tabler/icons-react';
import doSearch from '@/services/doSearch';

/* * */

export default function IssuesExplorerIdPageItemTags() {
  //

  //
  // A. Setup variables

  const t = useTranslations('IssuesExplorerIdPageItemTags');
  const issuesExplorerContext = useIssuesExplorerContext();
  const [isEditMode, setIsEditMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  //
  // B. Render components

  const { data: allTagsData } = useSWR('/api/tags');

  //
  // B. Transform data

  const allTagsDataFormatted = useMemo(() => {
    // Exit if no data is available
    if (!allTagsData) return [];
    // Filter tags based on search query
    const filteredTags = doSearch(searchQuery, allTagsData, { keys: ['label'] });
    // For each tag check if it associated with the current issue or not
    return filteredTags.map((tag) => ({ ...tag, is_selected: issuesExplorerContext.form.values.tags.includes(tag._id) }));
    //
  }, [allTagsData, issuesExplorerContext.form.values.tags, searchQuery]);

  //
  // B. Handle actions

  const handleEnterEditMode = () => {
    setIsEditMode(true);
  };

  const handleExitEditMode = () => {
    setIsEditMode(false);
  };

  //
  // B. Render components

  return (
    <>
      <Modal opened={isEditMode} onClose={handleExitEditMode} title={t('modal.title')} size={600}>
        <SimpleGrid cols={1}>
          <TextInput placeholder={t('modal.search.placeholder')} size="lg" value={searchQuery} onChange={({ currentTarget }) => setSearchQuery(currentTarget.value)} />
          {allTagsDataFormatted.length > 0 ? (
            <SimpleGrid cols={3}>
              {allTagsDataFormatted.map((tagData) => (
                <div key={tagData._id} className={`${styles.itemWrapper} ${tagData.is_selected && styles.isSelected}`} onClick={() => issuesExplorerContext.addTag(tagData._id)}>
                  {tagData.is_selected ? <IconCircleCheckFilled size={18} /> : <IconCircle size={18} />}
                  <TagsExplorerTag tagId={tagData._id} withHoverCard={false} />
                </div>
              ))}
            </SimpleGrid>
          ) : (
            <NoDataLabel fill />
          )}
        </SimpleGrid>
      </Modal>
      <div className={styles.container}>
        {issuesExplorerContext.form.values.tags.map((tagId) => (
          <TagsExplorerTag key={tagId} tagId={tagId} />
        ))}
        {!issuesExplorerContext.page.is_read_only && (
          <Button variant="subtle" size="compact-xs" color="gray" onClick={handleEnterEditMode}>
            {t('edit.label')}
          </Button>
        )}
      </div>
    </>
  );
}
