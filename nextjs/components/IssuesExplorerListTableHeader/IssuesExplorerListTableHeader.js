'use client';

/* * */

import { Table } from '@mantine/core';
import { useTranslations } from 'next-intl';
import { useIssuesExplorerContext } from '@/contexts/IssuesExplorerContext';

/* * */

export default function IssuesExplorerListTableHeader() {
  //

  //
  // A. Setup variables

  const t = useTranslations('IssuesExplorerListTableHeader');

  //
  // C. Render data

  return (
    <Table.Thead>
      <Table.Tr>
        <Table.Th>{t('status.title')}</Table.Th>
        <Table.Th>{t('priority.title')}</Table.Th>
        <Table.Th>{t('title.title')}</Table.Th>
        <Table.Th>{t('created_by.title')}</Table.Th>
        <Table.Th>{t('created_at.title')}</Table.Th>
        {/* <Table.Th>{t('table.header.driver_id.title')}</Table.Th> */}
      </Table.Tr>
    </Table.Thead>
  );

  //
}
