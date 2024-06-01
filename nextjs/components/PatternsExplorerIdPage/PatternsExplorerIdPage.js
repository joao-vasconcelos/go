'use client';

/* * */

import { AppLayoutSection } from '@/components/AppLayoutSection/AppLayoutSection';
import Pannel from '@/components/Pannel/Pannel';
import PatternsExplorerIdPageHeader from '@/components/PatternsExplorerIdPageHeader/PatternsExplorerIdPageHeader';
import PatternsExplorerIdPageImport from '@/components/PatternsExplorerIdPageImport/PatternsExplorerIdPageImport';
import PatternsExplorerIdPagePath from '@/components/PatternsExplorerIdPagePath/PatternsExplorerIdPagePath';
import PatternsExplorerIdPagePresets from '@/components/PatternsExplorerIdPagePresets/PatternsExplorerIdPagePresets';
import PatternsExplorerIdPageSchedules from '@/components/PatternsExplorerIdPageSchedules/PatternsExplorerIdPageSchedules';
import PatternsExplorerIdPageShape from '@/components/PatternsExplorerIdPageShape/PatternsExplorerIdPageShape';
import { usePatternsExplorerContext } from '@/contexts/PatternsExplorerContext';
import { Divider, SimpleGrid, TextInput } from '@mantine/core';
import { useTranslations } from 'next-intl';

import PatternsExplorerIdPageConfigs from '../PatternsExplorerIdPageConfigs/PatternsExplorerIdPageConfigs';
import styles from './PatternsExplorerIdPage.module.css';

/* * */

export default function PatternsExplorerIdPage() {
	//

	//
	// A. Setup variables

	const t = useTranslations('PatternsExplorerIdPage');
	const patternsExplorerContext = usePatternsExplorerContext();

	//
	// B. Render components

	return (
		<Pannel header={<PatternsExplorerIdPageHeader />} loading={patternsExplorerContext.page.is_loading}>
			<AppLayoutSection description={t('sections.intro.description')} title={t('sections.intro.title')}>
				<SimpleGrid cols={4}>
					<TextInput label={t('form.code.label')} placeholder={t('form.code.placeholder')} {...patternsExplorerContext.form.getInputProps('code')} readOnly={patternsExplorerContext.page._is_read_only} />
				</SimpleGrid>
				<SimpleGrid cols={2}>
					<TextInput description={t('form.origin.description')} label={t('form.origin.label')} placeholder={t('form.origin.placeholder')} {...patternsExplorerContext.form.getInputProps('origin')} readOnly={patternsExplorerContext.page._is_read_only} />
					<TextInput description={t('form.destination.description')} label={t('form.destination.label')} placeholder={t('form.destination.placeholder')} {...patternsExplorerContext.form.getInputProps('destination')} readOnly={patternsExplorerContext.page._is_read_only} />
				</SimpleGrid>
				<SimpleGrid cols={1}>
					<TextInput description={t('form.headsign.description')} label={t('form.headsign.label')} placeholder={t('form.headsign.placeholder')} {...patternsExplorerContext.form.getInputProps('headsign')} readOnly={patternsExplorerContext.page._is_read_only} />
				</SimpleGrid>
			</AppLayoutSection>

			<Divider />

			<PatternsExplorerIdPageShape />

			<Divider />

			<div className={styles.accordionWrapper}>
				<div className={styles.accordionItem}>
					<div className={`${styles.accordionControl} ${patternsExplorerContext.page.active_section === 'path' && styles.accordionControlActive}`} onClick={() => patternsExplorerContext.updateActiveSection('path')}>
						<AppLayoutSection description={t('sections.path.description')} title={t('sections.path.title')} />
					</div>
					{patternsExplorerContext.page.active_section === 'path' && <PatternsExplorerIdPagePath />}
				</div>

				<Divider />

				<div className={styles.accordionItem}>
					<div className={`${styles.accordionControl} ${patternsExplorerContext.page.active_section === 'schedules' && styles.accordionControlActive}`} onClick={() => patternsExplorerContext.updateActiveSection('schedules')}>
						<AppLayoutSection description={t('sections.schedules.description')} title={t('sections.schedules.title')} />
					</div>
					{patternsExplorerContext.page.active_section === 'schedules' && <PatternsExplorerIdPageSchedules />}
				</div>

				<Divider />

				<div className={styles.accordionItem}>
					<div className={`${styles.accordionControl} ${patternsExplorerContext.page.active_section === 'presets' && styles.accordionControlActive}`} onClick={() => patternsExplorerContext.updateActiveSection('presets')}>
						<AppLayoutSection description={t('sections.presets.description')} title={t('sections.presets.title')} />
					</div>
					{patternsExplorerContext.page.active_section === 'presets'
					&& (
						<AppLayoutSection>
							<PatternsExplorerIdPagePresets />
						</AppLayoutSection>
					)}
				</div>

				{!patternsExplorerContext.page.is_read_only
				&& (
					<>
						<Divider />
						<div className={styles.accordionItem}>
							<div className={`${styles.accordionControl} ${patternsExplorerContext.page.active_section === 'update_path' && styles.accordionControlActive}`} onClick={() => patternsExplorerContext.updateActiveSection('update_path')}>
								<AppLayoutSection description={t('sections.update_path.description')} title={t('sections.update_path.title')} />
							</div>
							{patternsExplorerContext.page.active_section === 'update_path'
							&& (
								<AppLayoutSection>
									<PatternsExplorerIdPageImport />
								</AppLayoutSection>
							)}
						</div>
					</>
				)}

				{patternsExplorerContext.page.is_admin
				&& (
					<>
						<Divider />
						<div className={styles.accordionItem}>
							<div className={`${styles.accordionControl} ${patternsExplorerContext.page.active_section === 'configs' && styles.accordionControlActive}`} onClick={() => patternsExplorerContext.updateActiveSection('configs')}>
								<AppLayoutSection description={t('sections.configs.description')} title={t('sections.configs.title')} />
							</div>
							{patternsExplorerContext.page.active_section === 'configs'
							&& (
								<AppLayoutSection>
									<PatternsExplorerIdPageConfigs />
								</AppLayoutSection>
							)}
						</div>
					</>
				)}
			</div>
		</Pannel>
	);

	//
}
