import { useEffect } from 'react';
import { Group, Button } from '@mantine/core';
import { TbShieldCheck, TbArrowLeft } from 'react-icons/tb';

/* * */
/* SAVE BUTTONS */
/* Pair of buttons that trigger an action on an interval and on click. */
/* * */

export default function SaveButtons({ isLoading, isValid, isDirty, onSave, onClose, interval = 1000 }) {
  //

  //
  // A. AUTOSAVE INTERVAL
  // Setup the autosave interval, by default of 1 second.
  // On each interval trigger, call the onSave() function.
  // On component unmount, clear the interval.

  useEffect(() => {
    // Trigger the onSave action on a set interval
    const autoSaveInterval = setInterval(() => {
      // If form has changed, is valid, is not currently loading
      // and has a valid action to perform.
      if (isDirty && isValid && !isLoading && onSave) {
        onSave();
      }
    }, interval);
    // Clear the interval on unmount (from React API)
    return () => clearInterval(autoSaveInterval);
  }, [isDirty, isLoading, isValid, onSave, interval]);

  //
  // B. LOADING
  // If form is loading, the close button is disabled
  // and the save button is loading.

  if (isLoading) {
    return (
      <Group>
        <Button disabled={true} leftIcon={<TbArrowLeft />}>
          Close
        </Button>
        <Button loading={true} leftIcon={<TbShieldCheck />} variant='light' color='green'>
          Saving changes...
        </Button>
      </Group>
    );
  }

  //
  // C. IS DIRTY AND iS VALID
  // If the form has changes and is valid, the close button is disabled
  // and the save button is clickable, waiting the autosave interval trigger.

  if (isDirty && isValid) {
    return (
      <Group>
        <Button disabled={true} leftIcon={<TbArrowLeft />}>
          Close
        </Button>
        <Button onClick={onSave} leftIcon={<TbShieldCheck />} variant='light' color='green'>
          Save Changes
        </Button>
      </Group>
    );
  }

  //
  // D. IS DIRTY AND iS INVALID
  // If the form has changes but is in an invalid state,
  // both the close and save buttons are disabled.

  if (isDirty && !isValid) {
    return (
      <Group>
        <Button disabled={true} leftIcon={<TbArrowLeft />}>
          Close
        </Button>
        <Button disabled={true} leftIcon={<TbShieldCheck />} variant='light' color='green'>
          Save Changes
        </Button>
      </Group>
    );
  }

  //
  // E. IDLE
  // If the form has no unsaved changes, is valid and is not loading,
  // then the close button is enabled and the save button shows a reassuring icon and message.
  return (
    <Group>
      <Button onClick={onClose} leftIcon={<TbArrowLeft />}>
        Close
      </Button>
      <Button onClick={onSave} leftIcon={<TbShieldCheck />} variant='light' color='green'>
        Changes are saved
      </Button>
    </Group>
  );
}
