import { useParams } from 'next/navigation';
import { useRouter } from '@/translations/navigation';
import BaseListItem from '@/components/BaseListItem/BaseListItem';
import LineDisplay from '@/components/LineDisplay/LineDisplay';

export default function ListItem({ _id, short_name, name, color, text_color }) {
  //

  const router = useRouter();
  const { line_id } = useParams();

  const handleClick = () => {
    if (line_id === _id) return;
    router.push(`/dashboard/lines/${_id}`);
  };

  return (
    <BaseListItem onClick={handleClick} isSelected={line_id === _id} withChevron>
      <LineDisplay short_name={short_name} name={name} color={color} text_color={text_color} />
    </BaseListItem>
  );
}
