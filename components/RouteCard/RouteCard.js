'use client';

import styles from './RouteCard.module.css';
import { Draggable } from '@hello-pangea/dnd';
import { IconChevronRight, IconGripVertical } from '@tabler/icons-react';
import Text from '../Text/Text';

export default function RouteCard({ index, onOpen, line_code, route_id, route_name }) {
  //

  //
  // E. Render components

  return (
    <Draggable draggableId={index.toString()} index={index}>
      {(provided) => (
        <div className={styles.container} ref={provided.innerRef} {...provided.draggableProps}>
          <div className={styles.toolbar} {...provided.dragHandleProps}>
            <IconGripVertical size='25px' />
          </div>
          <div className={styles.wrapper} onClick={() => onOpen(route_id)}>
            <div className={styles.subtitle}>
              {line_code}_{index}
            </div>
            <Text size='title' style={!route_name && 'untitled'}>
              {route_name ? route_name : 'Rota Sem Nome'}
            </Text>
          </div>
          <div className={styles.toolbar}>
            <IconChevronRight size='20px' />
          </div>
        </div>
      )}
    </Draggable>
  );

  //
}
