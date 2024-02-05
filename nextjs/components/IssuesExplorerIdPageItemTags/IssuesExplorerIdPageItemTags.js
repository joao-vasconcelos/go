'use client';

/* * */

import { useTranslations } from 'next-intl';
import { Button, Popover, TextInput } from '@mantine/core';
import { useIssuesExplorerContext } from '@/contexts/IssuesExplorerContext';
import { Section } from '../Layouts/Layouts';
import TagsExplorerTag from '../TagsExplorerTag/TagsExplorerTag';
import useSWR from 'swr';

/* * */

export default function IssuesExplorerIdPageItemTags() {
  //

  //
  // A. Setup variables

  const t = useTranslations('IssuesExplorerIdPageItemTags');
  const issuesExplorerContext = useIssuesExplorerContext();

  //
  // B. Render components

  const { data: allTagsData, isLoading: allTagsLoading } = useSWR('/api/tags');

  //
  // B. Render components

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
    <Section>
      <div>
        {issuesExplorerContext.form.values.tags.map((tagId) => (
          <TagsExplorerTag key={tagId} tagId={tagId} />
        ))}
        <div>
          <Popover width={200} position="bottom" withArrow shadow="md">
            <Popover.Target>
              <Button>Add Tag</Button>
            </Popover.Target>
            <Popover.Dropdown>
              <TextInput label="Name" placeholder="Name" size="xs" />
              {allTagsData &&
                allTagsData.map((tagData) => (
                  <div key={tagData._id} onClick={() => handleAddTag(tagData._id)}>
                    <TagsExplorerTag tagId={tagData._id} withHoverCard={false} />
                  </div>
                ))}
            </Popover.Dropdown>
          </Popover>
        </div>
      </div>
    </Section>
  );
}
