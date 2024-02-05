'use client';

/* * */

import { useTranslations } from 'next-intl';
import { Button, Modal, SimpleGrid, TextInput } from '@mantine/core';
import { useIssuesExplorerContext } from '@/contexts/IssuesExplorerContext';
import TagsExplorerTag from '@/components/TagsExplorerTag/TagsExplorerTag';
import useSWR from 'swr';
import styles from './IssuesExplorerIdPageItemMilestones.module.css';
import { useMemo, useState } from 'react';
import NoDataLabel from '@/components/NoDataLabel/NoDataLabel';
import { IconCircle, IconCircleCheckFilled } from '@tabler/icons-react';
import doSearch from '@/services/doSearch';

/* * */

export default function IssuesExplorerIdPageItemMilestones() {
  //

  //
  // A. Setup variables

  const t = useTranslations('IssuesExplorerIdPageItemMilestones');
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

  const handleAddTag = (tagId) => {
    // Create a set of tag ids for this issue
    const uniqueSetOfTags = new Set(issuesExplorerContext.form.values.tags);
    if (uniqueSetOfTags.has(tagId)) uniqueSetOfTags.delete(tagId);
    else uniqueSetOfTags.add(tagId);
    issuesExplorerContext.form.setFieldValue('tags', [...uniqueSetOfTags]);
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
                <div key={tagData._id} className={`${styles.itemWrapper} ${tagData.is_selected && styles.isSelected}`} onClick={() => handleAddTag(tagData._id)}>
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
        <Button variant="subtle" size="compact-xs" color="gray" onClick={handleEnterEditMode}>
          {t('edit.label')}
        </Button>
      </div>
    </>
  );
}
