'use client';

import styles from './HCalendarToggle.module.css';
import { useDisclosure } from '@mantine/hooks';
import { Modal, SimpleGrid, Textarea, Select } from '@mantine/core';
import dayjs from 'dayjs';

export default function HCalendarToggle({ date, dateObj, activeDates = [], onToggle }) {
  //

  //
  // A. Setup variables

  const [isModalPresented, { open: openModal, close: closeModal }] = useDisclosure(false);

  const dayString = dayjs(date).format('D');
  const fullDateString = dayjs(date).locale('pt').format('dddd, DD MMM YYYY');

  const isActive = activeDates.includes(date);

  const handleClick = () => {
    onToggle(dateObj);
  };

  const handleContextMenu = (event) => {
    event.preventDefault();
    openModal();
  };

  //
  // B. Render components

  return (
    <>
      <Modal opened={isModalPresented} onClose={closeModal} title={fullDateString} size='500px' centered>
        <SimpleGrid cols={1}>
          <Select
            label='Período'
            placeholder='Período'
            searchable
            readOnly
            nothingFound='Sem opções'
            value={dateObj.period}
            data={[
              { value: 1, label: '1 - Período Escolar' },
              { value: 2, label: '2 - Período de Férias Escolares' },
              { value: 3, label: '3 - Período de Verão' },
            ]}
          />
          <Textarea label='Notas sobre esta Data' minRows={5} value={dateObj.notes} readOnly />
        </SimpleGrid>
      </Modal>
      <div className={`${styles.container} ${styles[`period${dateObj.period}`]} ${dateObj.notes && styles.hasNote} ${isActive && styles.isActive}`} onClick={handleClick} onContextMenu={handleContextMenu}>
        {dayString}
      </div>
    </>
  );
}
