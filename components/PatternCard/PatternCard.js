'use client';

import styles from './PatternCard.module.css';
import Text from '../Text/Text';
import { Draggable } from '@hello-pangea/dnd';
import { IconChevronRight, IconGripVertical } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';

export default function PatternCard({ index, _id, code, direction, headsign, onOpen }) {
  //

  //
  // A. Setup variables

  const t = useTranslations('patterns');

  //
  // E. Render components

  return (
    <Draggable draggableId={index.toString()} index={index}>
      {(provided) => (
        <div className={styles.container} ref={provided.innerRef} {...provided.draggableProps}>
          <div className={styles.toolbar} {...provided.dragHandleProps}>
            <IconGripVertical size='25px' />
          </div>
          <div className={styles.wrapper} onClick={() => onOpen(_id)}>
            <div className={styles.subtitle}>{`${t('direction', { direction: direction })} / ${code || '...'}`}</div>
            <Text size='title' style={!headsign && 'untitled'}>
              {headsign ? headsign : t('untitled')}
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
