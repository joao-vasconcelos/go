import { useRouter, useParams } from 'next/navigation';
import BaseListItem from '../../../../components/BaseListItem/BaseListItem';
import LineDisplay from '../../../../components/LineDisplay/LineDisplay';

export default function ListItem({ _id, line_short_name, line_long_name, line_color, line_text_color }) {
  //

  const router = useRouter();
  const { line_id } = useParams();

  const handleClick = () => {
    router.push(`/dashboard/lines/${_id}`);
  };

  return (
    <BaseListItem onClick={handleClick} isSelected={line_id === _id} withChevron>
      <LineDisplay short_name={line_short_name} long_name={line_long_name} color={line_color} text_color={line_text_color} />
    </BaseListItem>
  );
}
