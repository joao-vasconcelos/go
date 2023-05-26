'use client';

import styles from './PatternCard.module.css';
import Text from '../Text/Text';
import { Draggable } from '@hello-pangea/dnd';
import { IconChevronRight, IconGripVertical } from '@tabler/icons-react';

export default function PatternCard({ index, pattern_id, headsign, onOpen }) {
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
          <div className={styles.wrapper} onClick={() => onOpen(pattern_id)}>
            <div className={styles.subtitle}>{index === 0 ? 'Inbound' : 'Outbound'}</div>
            <Text size='title' style={!headsign && 'untitled'}>
              {headsign ? headsign : 'Pattern sem headsign'}
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
