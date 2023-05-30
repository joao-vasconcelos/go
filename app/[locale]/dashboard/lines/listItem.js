import { useRouter, useParams } from 'next/navigation';
import BaseListItem from '../../../../components/BaseListItem/BaseListItem';
import LineDisplay from '../../../../components/LineDisplay/LineDisplay';

export default function ListItem({ _id, short_name, long_name, color, text_color }) {
  //

  const router = useRouter();
  const { line_id } = useParams();

  const handleClick = () => {
    router.push(`/dashboard/lines/${_id}`);
  };

  return (
    <BaseListItem onClick={handleClick} isSelected={line_id === _id} withChevron>
      <LineDisplay short_name={short_name} long_name={long_name} color={color} text_color={text_color} />
    </BaseListItem>
  );
}
