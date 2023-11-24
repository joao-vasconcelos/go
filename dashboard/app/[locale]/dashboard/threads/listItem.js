import { useParams } from 'next/navigation';
import { useRouter } from '@/translations/navigation';
import { useTranslations } from 'next-intl';
import BaseListItem from '@/components/BaseListItem/BaseListItem';
import Text from '@/components/Text/Text';

export default function ListItem({ _id, subject }) {
  //

  const router = useRouter();
  const { thread_id } = useParams();
  const t = useTranslations('threads');

  const handleClick = () => {
    router.push(`/dashboard/threads/${_id}`);
  };

  return (
    <BaseListItem onClick={handleClick} isSelected={thread_id === _id} withChevron>
      <Text size="title" style={!subject && 'untitled'}>
        {subject || t('untitled')}
      </Text>
    </BaseListItem>
  );
}
