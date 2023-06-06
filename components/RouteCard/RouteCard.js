'use client';

import styles from './RouteCard.module.css';
import { Draggable } from '@hello-pangea/dnd';
import { IconChevronRight, IconGripVertical } from '@tabler/icons-react';
import Text from '../Text/Text';
import { useTranslations } from 'next-intl';

export default function RouteCard({ index, onOpen, _id, code, name }) {
  //

  const t = useTranslations('routes');

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
            <div className={styles.subtitle}>{code || '...'}</div>
            <Text size='title' style={!name && 'untitled'}>
              {name ? name : t('untitled')}
            </Text>
          </div>
          <div className={styles.toolbar} onClick={() => onOpen(_id)}>
            <IconChevronRight size='20px' />
          </div>
        </div>
      )}
    </Draggable>
  );

  //
}
