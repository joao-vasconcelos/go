import styles from './AppVersion.module.css';
import { TbCloudFilled } from 'react-icons/tb';
import pjson from '../../package.json';

export default function AppVersion() {
  return (
    <div className={styles.container}>
      <TbCloudFilled size={'14px'} />
      <span>{pjson.version}</span>
    </div>
  );
}
