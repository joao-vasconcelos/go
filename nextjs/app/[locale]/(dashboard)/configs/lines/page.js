'use client';

/* * */

import useSWR from 'swr';
import { SimpleGrid } from '@mantine/core';
import Pannel from '@/components/Pannel/Pannel';
import Text from '@/components/Text/Text';
import { Section } from '@/components/Layouts/Layouts';
import AppAuthenticationCheck from '@/components/AppAuthenticationCheck/AppAuthenticationCheck';

/* * */

export default function Page() {
  //

  //
  // A. Setup variables

  const { data: allLinesData } = useSWR('/api/lines');

  //
  // E. Render components

  return (
    <AppAuthenticationCheck permissions={[{ scope: 'configs', action: 'admin' }]} redirect>
      <Pannel>
        <Section>
          <Text size="h2">All Line Ids</Text>
          {allLinesData && (
            <SimpleGrid cols={1}>
              {allLinesData.map((line) => (
                <div key={line._id}>
                  {line.code} - {line._id}
                </div>
              ))}
            </SimpleGrid>
          )}
        </Section>
      </Pannel>
    </AppAuthenticationCheck>
  );

  //
}
