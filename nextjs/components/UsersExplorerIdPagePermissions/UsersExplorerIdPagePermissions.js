'use client';

/* * */

import { useTranslations } from 'next-intl';
import { Accordion } from '@mantine/core';
import { AppLayoutSection } from '@/components/AppLayoutSection/AppLayoutSection';
import styles from './UsersExplorerIdPagePermissions.module.css';
import UsersExplorerIdPagePermissionsTags from '@/components/UsersExplorerIdPagePermissionsTags/UsersExplorerIdPagePermissionsTags';
import UsersExplorerIdPagePermissionsLines from '@/components/UsersExplorerIdPagePermissionsLines/UsersExplorerIdPagePermissionsLines';
import UsersExplorerIdPagePermissionsExports from '@/components/UsersExplorerIdPagePermissionsExports/UsersExplorerIdPagePermissionsExports';

/* * */

export default function UsersExplorerIdPagePermissions() {
  //

  //
  // A. Setup variables

  const t = useTranslations('UsersExplorerIdPagePermissions');

  //
  // B. Render components

  return (
    <Accordion>
      <Accordion.Item value="tags">
        <Accordion.Control classNames={{ control: styles.accordionControl, label: styles.accordionLabel }}>
          <AppLayoutSection title={t('tags.title')} description={t('tags.description')} />
        </Accordion.Control>
        <Accordion.Panel classNames={{ panel: styles.accordionPanel, content: styles.accordionContent }}>
          <UsersExplorerIdPagePermissionsTags />
        </Accordion.Panel>
      </Accordion.Item>

      <Accordion.Item value="lines">
        <Accordion.Control classNames={{ control: styles.accordionControl, label: styles.accordionLabel }}>
          <AppLayoutSection title={t('lines.title')} description={t('lines.description')} />
        </Accordion.Control>
        <Accordion.Panel classNames={{ panel: styles.accordionPanel, content: styles.accordionContent }}>
          <UsersExplorerIdPagePermissionsLines />
        </Accordion.Panel>
      </Accordion.Item>

      <Accordion.Item value="exports">
        <Accordion.Control classNames={{ control: styles.accordionControl, label: styles.accordionLabel }}>
          <AppLayoutSection title={t('exports.title')} description={t('exports.description')} />
        </Accordion.Control>
        <Accordion.Panel classNames={{ panel: styles.accordionPanel, content: styles.accordionContent }}>
          <UsersExplorerIdPagePermissionsExports />
        </Accordion.Panel>
      </Accordion.Item>
    </Accordion>
  );

  //
}
