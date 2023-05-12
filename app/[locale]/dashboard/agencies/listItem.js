import { useRouter, useParams } from 'next/navigation';
import BaseListItem from '../../../../components/BaseListItem/BaseListItem';
import Text from '../../../../components/Text/Text';

export default function ListItem({ _id, agency_name }) {
  //

  const router = useRouter();
  const { agency_id } = useParams();

  const handleClick = () => {
    router.push(`/dashboard/agencies/${_id}`);
  };

  return (
    <BaseListItem onClick={handleClick} isSelected={agency_id === _id} withChevron>
      <Text size='title' style={!agency_name && 'untitled'}>
        {agency_name || 'Agência Sem Nome'}
      </Text>
    </BaseListItem>
  );
}
