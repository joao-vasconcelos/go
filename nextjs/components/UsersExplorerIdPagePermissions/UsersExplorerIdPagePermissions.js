'use client';

/* * */

import { useTranslations } from 'next-intl';
import { Accordion } from '@mantine/core';
import { AppLayoutSection } from '@/components/AppLayoutSection/AppLayoutSection';
import styles from './UsersExplorerIdPagePermissions.module.css';
import UsersExplorerIdPagePermissionsAlerts from '@/components/UsersExplorerIdPagePermissionsAlerts/UsersExplorerIdPagePermissionsAlerts';
import UsersExplorerIdPagePermissionsReports from '@/components/UsersExplorerIdPagePermissionsReports/UsersExplorerIdPagePermissionsReports';
import UsersExplorerIdPagePermissionsAudits from '@/components/UsersExplorerIdPagePermissionsAudits/UsersExplorerIdPagePermissionsAudits';
import UsersExplorerIdPagePermissionsFeedback from '@/components/UsersExplorerIdPagePermissionsFeedback/UsersExplorerIdPagePermissionsFeedback';
import UsersExplorerIdPagePermissionsIssues from '@/components/UsersExplorerIdPagePermissionsIssues/UsersExplorerIdPagePermissionsIssues';
import UsersExplorerIdPagePermissionsStops from '@/components/UsersExplorerIdPagePermissionsStops/UsersExplorerIdPagePermissionsStops';
import UsersExplorerIdPagePermissionsCalendars from '@/components/UsersExplorerIdPagePermissionsCalendars/UsersExplorerIdPagePermissionsCalendars';
import UsersExplorerIdPagePermissionsLines from '@/components/UsersExplorerIdPagePermissionsLines/UsersExplorerIdPagePermissionsLines';
import UsersExplorerIdPagePermissionsExports from '@/components/UsersExplorerIdPagePermissionsExports/UsersExplorerIdPagePermissionsExports';
import UsersExplorerIdPagePermissionsArchives from '@/components/UsersExplorerIdPagePermissionsArchives/UsersExplorerIdPagePermissionsArchives';
import UsersExplorerIdPagePermissionsMunicipalities from '@/components/UsersExplorerIdPagePermissionsMunicipalities/UsersExplorerIdPagePermissionsMunicipalities';
import UsersExplorerIdPagePermissionsZones from '@/components/UsersExplorerIdPagePermissionsZones/UsersExplorerIdPagePermissionsZones';
import UsersExplorerIdPagePermissionsFares from '@/components/UsersExplorerIdPagePermissionsFares/UsersExplorerIdPagePermissionsFares';
import UsersExplorerIdPagePermissionsTypologies from '@/components/UsersExplorerIdPagePermissionsTypologies/UsersExplorerIdPagePermissionsTypologies';
import UsersExplorerIdPagePermissionsAgencies from '@/components/UsersExplorerIdPagePermissionsAgencies/UsersExplorerIdPagePermissionsAgencies';
import UsersExplorerIdPagePermissionsTags from '@/components/UsersExplorerIdPagePermissionsTags/UsersExplorerIdPagePermissionsTags';
import UsersExplorerIdPagePermissionsMedia from '@/components/UsersExplorerIdPagePermissionsMedia/UsersExplorerIdPagePermissionsMedia';
import UsersExplorerIdPagePermissionsUsers from '@/components/UsersExplorerIdPagePermissionsUsers/UsersExplorerIdPagePermissionsUsers';
import UsersExplorerIdPagePermissionsConfigs from '@/components/UsersExplorerIdPagePermissionsConfigs/UsersExplorerIdPagePermissionsConfigs';

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
      <Accordion.Item value="alerts">
        <Accordion.Control classNames={{ control: styles.accordionControl, label: styles.accordionLabel }}>
          <AppLayoutSection title={t('alerts.title')} description={t('alerts.description')} />
        </Accordion.Control>
        <Accordion.Panel classNames={{ panel: styles.accordionPanel, content: styles.accordionContent }}>
          <UsersExplorerIdPagePermissionsAlerts />
        </Accordion.Panel>
      </Accordion.Item>

      <Accordion.Item value="reports">
        <Accordion.Control classNames={{ control: styles.accordionControl, label: styles.accordionLabel }}>
          <AppLayoutSection title={t('reports.title')} description={t('reports.description')} />
        </Accordion.Control>
        <Accordion.Panel classNames={{ panel: styles.accordionPanel, content: styles.accordionContent }}>
          <UsersExplorerIdPagePermissionsReports />
        </Accordion.Panel>
      </Accordion.Item>

      <Accordion.Item value="audits">
        <Accordion.Control classNames={{ control: styles.accordionControl, label: styles.accordionLabel }}>
          <AppLayoutSection title={t('audits.title')} description={t('audits.description')} />
        </Accordion.Control>
        <Accordion.Panel classNames={{ panel: styles.accordionPanel, content: styles.accordionContent }}>
          <UsersExplorerIdPagePermissionsAudits />
        </Accordion.Panel>
      </Accordion.Item>

      <Accordion.Item value="feedback">
        <Accordion.Control classNames={{ control: styles.accordionControl, label: styles.accordionLabel }}>
          <AppLayoutSection title={t('feedback.title')} description={t('feedback.description')} />
        </Accordion.Control>
        <Accordion.Panel classNames={{ panel: styles.accordionPanel, content: styles.accordionContent }}>
          <UsersExplorerIdPagePermissionsFeedback />
        </Accordion.Panel>
      </Accordion.Item>

      <Accordion.Item value="issues">
        <Accordion.Control classNames={{ control: styles.accordionControl, label: styles.accordionLabel }}>
          <AppLayoutSection title={t('issues.title')} description={t('issues.description')} />
        </Accordion.Control>
        <Accordion.Panel classNames={{ panel: styles.accordionPanel, content: styles.accordionContent }}>
          <UsersExplorerIdPagePermissionsIssues />
        </Accordion.Panel>
      </Accordion.Item>

      <Accordion.Item value="stops">
        <Accordion.Control classNames={{ control: styles.accordionControl, label: styles.accordionLabel }}>
          <AppLayoutSection title={t('stops.title')} description={t('stops.description')} />
        </Accordion.Control>
        <Accordion.Panel classNames={{ panel: styles.accordionPanel, content: styles.accordionContent }}>
          <UsersExplorerIdPagePermissionsStops />
        </Accordion.Panel>
      </Accordion.Item>

      <Accordion.Item value="calendars">
        <Accordion.Control classNames={{ control: styles.accordionControl, label: styles.accordionLabel }}>
          <AppLayoutSection title={t('calendars.title')} description={t('calendars.description')} />
        </Accordion.Control>
        <Accordion.Panel classNames={{ panel: styles.accordionPanel, content: styles.accordionContent }}>
          <UsersExplorerIdPagePermissionsCalendars />
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

      <Accordion.Item value="archives">
        <Accordion.Control classNames={{ control: styles.accordionControl, label: styles.accordionLabel }}>
          <AppLayoutSection title={t('archives.title')} description={t('archives.description')} />
        </Accordion.Control>
        <Accordion.Panel classNames={{ panel: styles.accordionPanel, content: styles.accordionContent }}>
          <UsersExplorerIdPagePermissionsArchives />
        </Accordion.Panel>
      </Accordion.Item>

      <Accordion.Item value="municipalities">
        <Accordion.Control classNames={{ control: styles.accordionControl, label: styles.accordionLabel }}>
          <AppLayoutSection title={t('municipalities.title')} description={t('municipalities.description')} />
        </Accordion.Control>
        <Accordion.Panel classNames={{ panel: styles.accordionPanel, content: styles.accordionContent }}>
          <UsersExplorerIdPagePermissionsMunicipalities />
        </Accordion.Panel>
      </Accordion.Item>

      <Accordion.Item value="zones">
        <Accordion.Control classNames={{ control: styles.accordionControl, label: styles.accordionLabel }}>
          <AppLayoutSection title={t('zones.title')} description={t('zones.description')} />
        </Accordion.Control>
        <Accordion.Panel classNames={{ panel: styles.accordionPanel, content: styles.accordionContent }}>
          <UsersExplorerIdPagePermissionsZones />
        </Accordion.Panel>
      </Accordion.Item>

      <Accordion.Item value="fares">
        <Accordion.Control classNames={{ control: styles.accordionControl, label: styles.accordionLabel }}>
          <AppLayoutSection title={t('fares.title')} description={t('fares.description')} />
        </Accordion.Control>
        <Accordion.Panel classNames={{ panel: styles.accordionPanel, content: styles.accordionContent }}>
          <UsersExplorerIdPagePermissionsFares />
        </Accordion.Panel>
      </Accordion.Item>

      <Accordion.Item value="typologies">
        <Accordion.Control classNames={{ control: styles.accordionControl, label: styles.accordionLabel }}>
          <AppLayoutSection title={t('typologies.title')} description={t('typologies.description')} />
        </Accordion.Control>
        <Accordion.Panel classNames={{ panel: styles.accordionPanel, content: styles.accordionContent }}>
          <UsersExplorerIdPagePermissionsTypologies />
        </Accordion.Panel>
      </Accordion.Item>

      <Accordion.Item value="agencies">
        <Accordion.Control classNames={{ control: styles.accordionControl, label: styles.accordionLabel }}>
          <AppLayoutSection title={t('agencies.title')} description={t('agencies.description')} />
        </Accordion.Control>
        <Accordion.Panel classNames={{ panel: styles.accordionPanel, content: styles.accordionContent }}>
          <UsersExplorerIdPagePermissionsAgencies />
        </Accordion.Panel>
      </Accordion.Item>

      <Accordion.Item value="tags">
        <Accordion.Control classNames={{ control: styles.accordionControl, label: styles.accordionLabel }}>
          <AppLayoutSection title={t('tags.title')} description={t('tags.description')} />
        </Accordion.Control>
        <Accordion.Panel classNames={{ panel: styles.accordionPanel, content: styles.accordionContent }}>
          <UsersExplorerIdPagePermissionsTags />
        </Accordion.Panel>
      </Accordion.Item>

      <Accordion.Item value="media">
        <Accordion.Control classNames={{ control: styles.accordionControl, label: styles.accordionLabel }}>
          <AppLayoutSection title={t('media.title')} description={t('media.description')} />
        </Accordion.Control>
        <Accordion.Panel classNames={{ panel: styles.accordionPanel, content: styles.accordionContent }}>
          <UsersExplorerIdPagePermissionsMedia />
        </Accordion.Panel>
      </Accordion.Item>

      <Accordion.Item value="users">
        <Accordion.Control classNames={{ control: styles.accordionControl, label: styles.accordionLabel }}>
          <AppLayoutSection title={t('users.title')} description={t('users.description')} />
        </Accordion.Control>
        <Accordion.Panel classNames={{ panel: styles.accordionPanel, content: styles.accordionContent }}>
          <UsersExplorerIdPagePermissionsUsers />
        </Accordion.Panel>
      </Accordion.Item>

      <Accordion.Item value="configs">
        <Accordion.Control classNames={{ control: styles.accordionControl, label: styles.accordionLabel }}>
          <AppLayoutSection title={t('configs.title')} description={t('configs.description')} />
        </Accordion.Control>
        <Accordion.Panel classNames={{ panel: styles.accordionPanel, content: styles.accordionContent }}>
          <UsersExplorerIdPagePermissionsConfigs />
        </Accordion.Panel>
      </Accordion.Item>
    </Accordion>
  );

  //
}
