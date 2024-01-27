/* * */

import { Section } from '@/components/Layouts/Layouts';
import RealtimeExplorerResultTripDetailToolsOrdering from '@/components/RealtimeExplorerResultTripDetailToolsOrdering/RealtimeExplorerResultTripDetailToolsOrdering';
import RealtimeExplorerResultTripDetailToolsAnimation from '@/components/RealtimeExplorerResultTripDetailToolsAnimation/RealtimeExplorerResultTripDetailToolsAnimation';

/* * */

export default function RealtimeExplorerResultTripDetailTools() {
  return (
    <Section>
      <RealtimeExplorerResultTripDetailToolsOrdering />
      <RealtimeExplorerResultTripDetailToolsAnimation />
    </Section>
  );
}
