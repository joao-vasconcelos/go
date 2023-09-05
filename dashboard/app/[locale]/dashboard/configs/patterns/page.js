'use client';

import useSWR from 'swr';
import { SimpleGrid } from '@mantine/core';
import Pannel from '@/components/Pannel/Pannel';
import Text from '@/components/Text/Text';
import { Section } from '@/components/Layouts/Layouts';
import AuthGate from '@/components/AuthGate/AuthGate';

export default function Page() {
  //

  //
  // A. Setup variables

  const { data: allPatternsData } = useSWR('/api/patterns');

  //
  // E. Render components

  return (
    <AuthGate scope="configs" permission="admin" redirect>
      <Pannel>
        <Section>
          <Text size="h2">All Pattern Ids</Text>
          {allPatternsData && (
            <SimpleGrid cols={1}>
              {allPatternsData.map((route) => (
                <div key={route._id}>
                  {route.code} - {route._id}
                </div>
              ))}
            </SimpleGrid>
          )}
        </Section>
      </Pannel>
    </AuthGate>
  );
}
