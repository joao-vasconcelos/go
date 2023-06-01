import styles from './MessageComponent.module.css';
import { IconFileDownload } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';
import { useSession } from 'next-auth/react';

export default function MessageComponent({ message }) {
  //

  const { data: session } = useSession();
  const t = useTranslations('threads');

  const messageIsFromCurrentUser = message.sent_by && message.sent_by._id === session?.user?._id;

  return (
    <div className={`${styles.container} ${messageIsFromCurrentUser && styles.fromCurrentUser}`}>
      <div className={styles.sentBy}>
        Sent by <div className={styles.user}>{message.sent_by && message.sent_by.name}</div>
      </div>
      <div className={styles.content}>{message.content}</div>
      <div className={styles.files}>
        {message.files &&
          message.files.map((file, index) => (
            <div key={index} className={styles.fileWrapper}>
              <IconFileDownload size={18} />
              <div className={styles.filename}>{file.filename}</div>
            </div>
          ))}
      </div>
    </div>
  );
}
