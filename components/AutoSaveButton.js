import { Button } from '@mantine/core';
import { TbShieldCheck } from 'react-icons/tb';
import { useEffect } from 'react';

export default function AutoSaveButton({ isLoading, isValid, isDirty, onSaveTrigger, interval = 1000, ...props }) {
  //

  useEffect(() => {
    const autoSaveInterval = setInterval(() => {
      // If save is allowed and an action is set
      if (isDirty && isValid && !isLoading && onSaveTrigger) onSaveTrigger();
    }, interval);
    // Clear the interval on unmount (React API)
    return () => clearInterval(autoSaveInterval);
  }, [isDirty, isLoading, isValid, onSaveTrigger, interval]);

  // If form is loading
  if (isLoading) {
    return (
      <Button leftIcon={<TbShieldCheck />} variant='light' color='green' loading {...props}>
        Saving changes...
      </Button>
    );
  }

  // If form has changes and is valid
  if (isDirty && isValid) {
    return (
      <Button leftIcon={<TbShieldCheck />} variant='light' color='green' {...props}>
        Save Changes
      </Button>
    );
  }

  // If form has changes and is invalid
  if (isDirty && !isValid) {
    return (
      <Button leftIcon={<TbShieldCheck />} variant='light' color='green' disabled {...props}>
        Save Changes
      </Button>
    );
  }

  // If form is idle
  return (
    <Button leftIcon={<TbShieldCheck />} variant='light' color='green' disabled={!isValid} {...props}>
      Changes are saved
    </Button>
  );
}
