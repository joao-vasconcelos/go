import { useRouter, useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import BaseListItem from '../../../../components/BaseListItem/BaseListItem';
import Text from '../../../../components/Text/Text';
import Badge from '../../../../components/Badge/Badge';

export default function ListItem({ _id, code, name }) {
  //

  const router = useRouter();
  const { calendar_id } = useParams();
  const t = useTranslations('calendars');

  const handleClick = () => {
    if (calendar_id === _id) return;
    router.push(`/dashboard/calendars/${_id}`);
  };

  return (
    <BaseListItem onClick={handleClick} isSelected={calendar_id === _id} withChevron>
      <Text size='title' style={!name && 'untitled'}>
        {name || t('untitled')}
      </Text>
      <Badge>{code}</Badge>
    </BaseListItem>
  );
}
