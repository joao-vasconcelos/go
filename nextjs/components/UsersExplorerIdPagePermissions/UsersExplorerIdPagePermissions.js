'use client';

/* * */

import { AppLayoutSection } from '@/components/AppLayoutSection/AppLayoutSection';
import UsersExplorerIdPagePermissionsAgencies from '@/components/UsersExplorerIdPagePermissionsAgencies/UsersExplorerIdPagePermissionsAgencies';
import UsersExplorerIdPagePermissionsAlerts from '@/components/UsersExplorerIdPagePermissionsAlerts/UsersExplorerIdPagePermissionsAlerts';
import UsersExplorerIdPagePermissionsArchives from '@/components/UsersExplorerIdPagePermissionsArchives/UsersExplorerIdPagePermissionsArchives';
import UsersExplorerIdPagePermissionsAudits from '@/components/UsersExplorerIdPagePermissionsAudits/UsersExplorerIdPagePermissionsAudits';
import UsersExplorerIdPagePermissionsCalendars from '@/components/UsersExplorerIdPagePermissionsCalendars/UsersExplorerIdPagePermissionsCalendars';
import UsersExplorerIdPagePermissionsConfigs from '@/components/UsersExplorerIdPagePermissionsConfigs/UsersExplorerIdPagePermissionsConfigs';
import UsersExplorerIdPagePermissionsExports from '@/components/UsersExplorerIdPagePermissionsExports/UsersExplorerIdPagePermissionsExports';
import UsersExplorerIdPagePermissionsFares from '@/components/UsersExplorerIdPagePermissionsFares/UsersExplorerIdPagePermissionsFares';
import UsersExplorerIdPagePermissionsFeedback from '@/components/UsersExplorerIdPagePermissionsFeedback/UsersExplorerIdPagePermissionsFeedback';
import UsersExplorerIdPagePermissionsIssues from '@/components/UsersExplorerIdPagePermissionsIssues/UsersExplorerIdPagePermissionsIssues';
import UsersExplorerIdPagePermissionsLines from '@/components/UsersExplorerIdPagePermissionsLines/UsersExplorerIdPagePermissionsLines';
import UsersExplorerIdPagePermissionsMedia from '@/components/UsersExplorerIdPagePermissionsMedia/UsersExplorerIdPagePermissionsMedia';
import UsersExplorerIdPagePermissionsMunicipalities from '@/components/UsersExplorerIdPagePermissionsMunicipalities/UsersExplorerIdPagePermissionsMunicipalities';
import UsersExplorerIdPagePermissionsReports from '@/components/UsersExplorerIdPagePermissionsReports/UsersExplorerIdPagePermissionsReports';
import UsersExplorerIdPagePermissionsStops from '@/components/UsersExplorerIdPagePermissionsStops/UsersExplorerIdPagePermissionsStops';
import UsersExplorerIdPagePermissionsTags from '@/components/UsersExplorerIdPagePermissionsTags/UsersExplorerIdPagePermissionsTags';
import UsersExplorerIdPagePermissionsTypologies from '@/components/UsersExplorerIdPagePermissionsTypologies/UsersExplorerIdPagePermissionsTypologies';
import UsersExplorerIdPagePermissionsUsers from '@/components/UsersExplorerIdPagePermissionsUsers/UsersExplorerIdPagePermissionsUsers';
import UsersExplorerIdPagePermissionsZones from '@/components/UsersExplorerIdPagePermissionsZones/UsersExplorerIdPagePermissionsZones';
import { Accordion } from '@mantine/core';
import { useTranslations } from 'next-intl';

import styles from './UsersExplorerIdPagePermissions.module.css';

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
					<AppLayoutSection description={t('alerts.description')} title={t('alerts.title')} />
				</Accordion.Control>
				<Accordion.Panel classNames={{ content: styles.accordionContent, panel: styles.accordionPanel }}>
					<UsersExplorerIdPagePermissionsAlerts />
				</Accordion.Panel>
			</Accordion.Item>

			<Accordion.Item value="reports">
				<Accordion.Control classNames={{ control: styles.accordionControl, label: styles.accordionLabel }}>
					<AppLayoutSection description={t('reports.description')} title={t('reports.title')} />
				</Accordion.Control>
				<Accordion.Panel classNames={{ content: styles.accordionContent, panel: styles.accordionPanel }}>
					<UsersExplorerIdPagePermissionsReports />
				</Accordion.Panel>
			</Accordion.Item>

			<Accordion.Item value="audits">
				<Accordion.Control classNames={{ control: styles.accordionControl, label: styles.accordionLabel }}>
					<AppLayoutSection description={t('audits.description')} title={t('audits.title')} />
				</Accordion.Control>
				<Accordion.Panel classNames={{ content: styles.accordionContent, panel: styles.accordionPanel }}>
					<UsersExplorerIdPagePermissionsAudits />
				</Accordion.Panel>
			</Accordion.Item>

			<Accordion.Item value="feedback">
				<Accordion.Control classNames={{ control: styles.accordionControl, label: styles.accordionLabel }}>
					<AppLayoutSection description={t('feedback.description')} title={t('feedback.title')} />
				</Accordion.Control>
				<Accordion.Panel classNames={{ content: styles.accordionContent, panel: styles.accordionPanel }}>
					<UsersExplorerIdPagePermissionsFeedback />
				</Accordion.Panel>
			</Accordion.Item>

			<Accordion.Item value="issues">
				<Accordion.Control classNames={{ control: styles.accordionControl, label: styles.accordionLabel }}>
					<AppLayoutSection description={t('issues.description')} title={t('issues.title')} />
				</Accordion.Control>
				<Accordion.Panel classNames={{ content: styles.accordionContent, panel: styles.accordionPanel }}>
					<UsersExplorerIdPagePermissionsIssues />
				</Accordion.Panel>
			</Accordion.Item>

			<Accordion.Item value="stops">
				<Accordion.Control classNames={{ control: styles.accordionControl, label: styles.accordionLabel }}>
					<AppLayoutSection description={t('stops.description')} title={t('stops.title')} />
				</Accordion.Control>
				<Accordion.Panel classNames={{ content: styles.accordionContent, panel: styles.accordionPanel }}>
					<UsersExplorerIdPagePermissionsStops />
				</Accordion.Panel>
			</Accordion.Item>

			<Accordion.Item value="calendars">
				<Accordion.Control classNames={{ control: styles.accordionControl, label: styles.accordionLabel }}>
					<AppLayoutSection description={t('calendars.description')} title={t('calendars.title')} />
				</Accordion.Control>
				<Accordion.Panel classNames={{ content: styles.accordionContent, panel: styles.accordionPanel }}>
					<UsersExplorerIdPagePermissionsCalendars />
				</Accordion.Panel>
			</Accordion.Item>

			<Accordion.Item value="lines">
				<Accordion.Control classNames={{ control: styles.accordionControl, label: styles.accordionLabel }}>
					<AppLayoutSection description={t('lines.description')} title={t('lines.title')} />
				</Accordion.Control>
				<Accordion.Panel classNames={{ content: styles.accordionContent, panel: styles.accordionPanel }}>
					<UsersExplorerIdPagePermissionsLines />
				</Accordion.Panel>
			</Accordion.Item>

			<Accordion.Item value="exports">
				<Accordion.Control classNames={{ control: styles.accordionControl, label: styles.accordionLabel }}>
					<AppLayoutSection description={t('exports.description')} title={t('exports.title')} />
				</Accordion.Control>
				<Accordion.Panel classNames={{ content: styles.accordionContent, panel: styles.accordionPanel }}>
					<UsersExplorerIdPagePermissionsExports />
				</Accordion.Panel>
			</Accordion.Item>

			<Accordion.Item value="archives">
				<Accordion.Control classNames={{ control: styles.accordionControl, label: styles.accordionLabel }}>
					<AppLayoutSection description={t('archives.description')} title={t('archives.title')} />
				</Accordion.Control>
				<Accordion.Panel classNames={{ content: styles.accordionContent, panel: styles.accordionPanel }}>
					<UsersExplorerIdPagePermissionsArchives />
				</Accordion.Panel>
			</Accordion.Item>

			<Accordion.Item value="municipalities">
				<Accordion.Control classNames={{ control: styles.accordionControl, label: styles.accordionLabel }}>
					<AppLayoutSection description={t('municipalities.description')} title={t('municipalities.title')} />
				</Accordion.Control>
				<Accordion.Panel classNames={{ content: styles.accordionContent, panel: styles.accordionPanel }}>
					<UsersExplorerIdPagePermissionsMunicipalities />
				</Accordion.Panel>
			</Accordion.Item>

			<Accordion.Item value="zones">
				<Accordion.Control classNames={{ control: styles.accordionControl, label: styles.accordionLabel }}>
					<AppLayoutSection description={t('zones.description')} title={t('zones.title')} />
				</Accordion.Control>
				<Accordion.Panel classNames={{ content: styles.accordionContent, panel: styles.accordionPanel }}>
					<UsersExplorerIdPagePermissionsZones />
				</Accordion.Panel>
			</Accordion.Item>

			<Accordion.Item value="fares">
				<Accordion.Control classNames={{ control: styles.accordionControl, label: styles.accordionLabel }}>
					<AppLayoutSection description={t('fares.description')} title={t('fares.title')} />
				</Accordion.Control>
				<Accordion.Panel classNames={{ content: styles.accordionContent, panel: styles.accordionPanel }}>
					<UsersExplorerIdPagePermissionsFares />
				</Accordion.Panel>
			</Accordion.Item>

			<Accordion.Item value="typologies">
				<Accordion.Control classNames={{ control: styles.accordionControl, label: styles.accordionLabel }}>
					<AppLayoutSection description={t('typologies.description')} title={t('typologies.title')} />
				</Accordion.Control>
				<Accordion.Panel classNames={{ content: styles.accordionContent, panel: styles.accordionPanel }}>
					<UsersExplorerIdPagePermissionsTypologies />
				</Accordion.Panel>
			</Accordion.Item>

			<Accordion.Item value="agencies">
				<Accordion.Control classNames={{ control: styles.accordionControl, label: styles.accordionLabel }}>
					<AppLayoutSection description={t('agencies.description')} title={t('agencies.title')} />
				</Accordion.Control>
				<Accordion.Panel classNames={{ content: styles.accordionContent, panel: styles.accordionPanel }}>
					<UsersExplorerIdPagePermissionsAgencies />
				</Accordion.Panel>
			</Accordion.Item>

			<Accordion.Item value="tags">
				<Accordion.Control classNames={{ control: styles.accordionControl, label: styles.accordionLabel }}>
					<AppLayoutSection description={t('tags.description')} title={t('tags.title')} />
				</Accordion.Control>
				<Accordion.Panel classNames={{ content: styles.accordionContent, panel: styles.accordionPanel }}>
					<UsersExplorerIdPagePermissionsTags />
				</Accordion.Panel>
			</Accordion.Item>

			<Accordion.Item value="media">
				<Accordion.Control classNames={{ control: styles.accordionControl, label: styles.accordionLabel }}>
					<AppLayoutSection description={t('media.description')} title={t('media.title')} />
				</Accordion.Control>
				<Accordion.Panel classNames={{ content: styles.accordionContent, panel: styles.accordionPanel }}>
					<UsersExplorerIdPagePermissionsMedia />
				</Accordion.Panel>
			</Accordion.Item>

			<Accordion.Item value="users">
				<Accordion.Control classNames={{ control: styles.accordionControl, label: styles.accordionLabel }}>
					<AppLayoutSection description={t('users.description')} title={t('users.title')} />
				</Accordion.Control>
				<Accordion.Panel classNames={{ content: styles.accordionContent, panel: styles.accordionPanel }}>
					<UsersExplorerIdPagePermissionsUsers />
				</Accordion.Panel>
			</Accordion.Item>

			<Accordion.Item value="configs">
				<Accordion.Control classNames={{ control: styles.accordionControl, label: styles.accordionLabel }}>
					<AppLayoutSection description={t('configs.description')} title={t('configs.title')} />
				</Accordion.Control>
				<Accordion.Panel classNames={{ content: styles.accordionContent, panel: styles.accordionPanel }}>
					<UsersExplorerIdPagePermissionsConfigs />
				</Accordion.Panel>
			</Accordion.Item>
		</Accordion>
	);

	//
}
