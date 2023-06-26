'use client';

import useSWR from 'swr';
import styles from './PatternCard.module.css';
import Text from '../Text/Text';
import { Draggable } from '@hello-pangea/dnd';
import { IconChevronRight, IconGripVertical } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';
import Loader from '../Loader/Loader';

export default function PatternCard({ index, onOpen, _id }) {
  //

  //
  // A. Setup variables

  const t = useTranslations('patterns');

  //
  // B. Fetch data

  const { data: patternData } = useSWR(_id && `/api/patterns/${_id}`);

  //
  // E. Render components

  return (
    <Draggable draggableId={index.toString()} index={index}>
      {(provided) => (
        <div className={styles.container} ref={provided.innerRef} {...provided.draggableProps}>
          <div className={styles.toolbar} {...provided.dragHandleProps}>
            <IconGripVertical size='25px' />
          </div>
          {patternData && (
            <div className={styles.wrapper} onClick={() => onOpen(_id)}>
              <div className={styles.subtitle}>{`${t('direction', { direction: patternData.direction })} / ${patternData.code || '...'}`}</div>
              <Text size='title' style={!patternData.headsign && 'untitled'}>
                {patternData.headsign ? patternData.headsign : t('untitled')}
              </Text>
            </div>
          )}
          {patternData ? (
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
