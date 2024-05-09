'use client';

/* * */

import { useTranslations } from 'next-intl';
import Pannel from '@/components/Pannel/Pannel';
import { SimpleGrid, TextInput, Divider } from '@mantine/core';
import { usePatternsExplorerContext } from '@/contexts/PatternsExplorerContext';
import PatternsExplorerIdPageHeader from '@/components/PatternsExplorerIdPageHeader/PatternsExplorerIdPageHeader';
import { AppLayoutSection } from '@/components/AppLayoutSection/AppLayoutSection';
import PatternsExplorerIdPageShape from '@/components/PatternsExplorerIdPageShape/PatternsExplorerIdPageShape';
import PatternsExplorerIdPagePath from '@/components/PatternsExplorerIdPagePath/PatternsExplorerIdPagePath';
import PatternsExplorerIdPageSchedules from '@/components/PatternsExplorerIdPageSchedules/PatternsExplorerIdPageSchedules';
import PatternsExplorerIdPagePresets from '@/components/PatternsExplorerIdPagePresets/PatternsExplorerIdPagePresets';
import PatternsExplorerIdPageImport from '@/components/PatternsExplorerIdPageImport/PatternsExplorerIdPageImport';
import styles from './PatternsExplorerIdPage.module.css';
import PatternsExplorerIdPageConfigs from '../PatternsExplorerIdPageConfigs/PatternsExplorerIdPageConfigs';

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
		<Pannel loading={patternsExplorerContext.page.is_loading} header={<PatternsExplorerIdPageHeader />}>
			<AppLayoutSection title={t('sections.intro.title')} description={t('sections.intro.description')}>
				<SimpleGrid cols={4}>
					<TextInput label={t('form.code.label')} placeholder={t('form.code.placeholder')} {...patternsExplorerContext.form.getInputProps('code')} readOnly={patternsExplorerContext.page._is_read_only} />
				</SimpleGrid>
				<SimpleGrid cols={2}>
					<TextInput label={t('form.origin.label')} placeholder={t('form.origin.placeholder')} description={t('form.origin.description')} {...patternsExplorerContext.form.getInputProps('origin')} readOnly={patternsExplorerContext.page._is_read_only} />
					<TextInput label={t('form.destination.label')} placeholder={t('form.destination.placeholder')} description={t('form.destination.description')} {...patternsExplorerContext.form.getInputProps('destination')} readOnly={patternsExplorerContext.page._is_read_only} />
				</SimpleGrid>
				<SimpleGrid cols={1}>
					<TextInput label={t('form.headsign.label')} placeholder={t('form.headsign.placeholder')} description={t('form.headsign.description')} {...patternsExplorerContext.form.getInputProps('headsign')} readOnly={patternsExplorerContext.page._is_read_only} />
				</SimpleGrid>
			</AppLayoutSection>

			<Divider />

			<PatternsExplorerIdPageShape />

			<Divider />

			<div className={styles.accordionWrapper}>
				<div className={styles.accordionItem}>
					<div className={`${styles.accordionControl} ${patternsExplorerContext.page.active_section === 'path' && styles.accordionControlActive}`} onClick={() => patternsExplorerContext.updateActiveSection('path')}>
						<AppLayoutSection title={t('sections.path.title')} description={t('sections.path.description')} />
					</div>
					{patternsExplorerContext.page.active_section === 'path' && <PatternsExplorerIdPagePath />}
				</div>

				<Divider />

				<div className={styles.accordionItem}>
					<div className={`${styles.accordionControl} ${patternsExplorerContext.page.active_section === 'schedules' && styles.accordionControlActive}`} onClick={() => patternsExplorerContext.updateActiveSection('schedules')}>
						<AppLayoutSection title={t('sections.schedules.title')} description={t('sections.schedules.description')} />
					</div>
					{patternsExplorerContext.page.active_section === 'schedules' && <PatternsExplorerIdPageSchedules />}
				</div>

				<Divider />

				<div className={styles.accordionItem}>
					<div className={`${styles.accordionControl} ${patternsExplorerContext.page.active_section === 'presets' && styles.accordionControlActive}`} onClick={() => patternsExplorerContext.updateActiveSection('presets')}>
						<AppLayoutSection title={t('sections.presets.title')} description={t('sections.presets.description')} />
					</div>
					{patternsExplorerContext.page.active_section === 'presets' &&
            <AppLayoutSection>
            	<PatternsExplorerIdPagePresets />
            </AppLayoutSection>
					}
				</div>

				{!patternsExplorerContext.page.is_read_only &&
          <>
          	<Divider />
          	<div className={styles.accordionItem}>
          		<div className={`${styles.accordionControl} ${patternsExplorerContext.page.active_section === 'update_path' && styles.accordionControlActive}`} onClick={() => patternsExplorerContext.updateActiveSection('update_path')}>
          			<AppLayoutSection title={t('sections.update_path.title')} description={t('sections.update_path.description')} />
          		</div>
          		{patternsExplorerContext.page.active_section === 'update_path' &&
                <AppLayoutSection>
                	<PatternsExplorerIdPageImport />
                </AppLayoutSection>
          		}
          	</div>
          </>
				}

				{patternsExplorerContext.page.is_admin &&
          <>
          	<Divider />
          	<div className={styles.accordionItem}>
          		<div className={`${styles.accordionControl} ${patternsExplorerContext.page.active_section === 'configs' && styles.accordionControlActive}`} onClick={() => patternsExplorerContext.updateActiveSection('configs')}>
          			<AppLayoutSection title={t('sections.configs.title')} description={t('sections.configs.description')} />
          		</div>
          		{patternsExplorerContext.page.active_section === 'configs' &&
                <AppLayoutSection>
                	<PatternsExplorerIdPageConfigs />
                </AppLayoutSection>
          		}
          	</div>
          </>
				}
			</div>
		</Pannel>
	);

	//
}