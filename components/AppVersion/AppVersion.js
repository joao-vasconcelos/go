import pjson from '../../package.json';
import styles from './AppVersion.module.css';
import { IconCloudFilled } from '@tabler/icons-react';

export default function AppVersion() {
  return (
    <div className={styles.container}>
      <IconCloudFilled size={'14px'} />
      <span>{pjson.version}</span>
    </div>
  );
}
