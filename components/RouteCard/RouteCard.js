'use client';

import useSWR from 'swr';
import styles from './RouteCard.module.css';
import { Draggable } from '@hello-pangea/dnd';
import { IconChevronRight, IconGripVertical } from '@tabler/icons-react';
import Text from '../Text/Text';
import { useTranslations } from 'next-intl';
import Loader from '../Loader/Loader';

export default function RouteCard({ index, onOpen, _id }) {
  //

  //
  // A. Setup variables

  const t = useTranslations('routes');

  //
  // B. Fetch data

  const { data: routeData } = useSWR(_id && `/api/routes/${_id}`);

  //
  // E. Render components

  return (
    <Draggable draggableId={index.toString()} index={index}>
      {(provided) => (
        <div className={styles.container} ref={provided.innerRef} {...provided.draggableProps}>
          <div className={styles.toolbar} {...provided.dragHandleProps}>
            <IconGripVertical size='25px' />
          </div>
          {routeData && (
            <div className={styles.wrapper} onClick={() => onOpen(_id)}>
              <div className={styles.subtitle}>{routeData.code || '...'}</div>
              <Text size='title' style={!routeData.name && 'untitled'}>
                {routeData.name ? routeData.name : t('untitled')}
              </Text>
            </div>
          )}
          {routeData ? (
            <div className={styles.toolbar} onClick={() => onOpen(_id)}>
              <IconChevronRight size='20px' />
            </div>
          ) : (
            <Loader visible />
          )}
        </div>
      )}
    </Draggable>
  );

  //
}
