/* * */

import { Tooltip, ActionIcon, Button } from '@mantine/core';
import { IconDeviceFloppy, IconAlertTriangleFilled } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';
import AppButtonBack from '@/components/AppButtonBack/AppButtonBack';
import AppButtonClose from '@/components/AppButtonClose/AppButtonClose';
import { useIdle } from '@mantine/hooks';
import { useEffect } from 'react';

/* * */
/* AUTOSAVE COMPONENT */
/* Pair of buttons that trigger an action on an interval and on click. */
/* * */

export default function AutoSave({ isValid, isDirty, isLoading, isValidating, isErrorValidating, isSaving, isErrorSaving, onValidate, onSave, onClose, closeType = 'close', interval = 2000 }) {
	//

	const t = useTranslations('AutoSave');
	const isIdle = useIdle(interval, { initialState: false });

	//
	// A. AUTOSAVE INTERVAL
	// Setup the autosave interval, by default of 1 second.
	// On each interval trigger, call the onSave() function.
	// On component unmount, clear the interval.

	useEffect(() => {
		// If form is valid, has changed, is not currently saving,
		// did not have an error saving and has a valid action to perform.
		if (isIdle && isValid && isDirty && !isSaving && !isErrorSaving && onSave) {
			onSave();
		}
	}, [isIdle, isValid, isDirty, !isSaving, !isErrorSaving, onSave]);

	//
	// B. RETRY (IS SAVING AFTER ERROR)
	// If form had an error saving, and the user clicked try again
	// then show the save button with a loading spinner.

	if (isErrorSaving && isSaving) {
		return (
			<Button size="xs" leftSection={<IconAlertTriangleFilled size="20px" />} variant="light" color="red" loading>
				{t('retry.title')}
			</Button>
		);
	}

	//
	// C. IS ERROR SAVING
	// If form had an error saving, the button expands
	// to make the error clearer. Autosave is disabled.

	if (isErrorSaving) {
		return (
			<Tooltip label={`Ocorreu um erro ao salvar as alterações: ${isErrorSaving.message}`} color="red" position="bottom" width={300} multiline withArrow>
				<Button size="xs" leftSection={<IconAlertTriangleFilled size="20px" />} variant="light" color="red" onClick={onSave}>
          Salvar Alterações
				</Button>
			</Tooltip>
		);
	}

	//
	// D. IS LOADING OR IS SAVING
	// If form is empty and loading the data,
	// or if the form is saving display a loading spinner.
	// Read more about the distinction between isLoading and isValidating:
	// https://swr.vercel.app/docs/advanced/understanding#combining-with-isloading-and-isvalidating-for-better-ux

	if (isLoading || isSaving) {
		return <ActionIcon size="lg" loading={true} variant="subtle" color="gray" />;
	}

	//
	// E. IS ERROR VALIDATING
	// If form had an error loading or updating the data,
	// the button changes to the alert icon but does not expand.

	if (isErrorValidating) {
		return (
			<Tooltip label={`Ocorreu um erro ao atualizar: ${isErrorValidating.message}`} color="red" position="bottom" width={300} multiline withArrow>
				<ActionIcon size="lg" variant="light" color="red">
					<IconAlertTriangleFilled size="20px" />
				</ActionIcon>
			</Tooltip>
		);
	}

	//
	// F. IS DIRTY AND iS INVALID
	// If the form has changes but is in an invalid state,
	// both the close and save buttons are disabled.

	if (isDirty && !isValid) {
		return (
			<Tooltip label="Erro de Preenchimento" color="gray" position="bottom" withArrow>
				<ActionIcon size="lg" onClick={onValidate} variant="subtle" color="gray">
					<IconDeviceFloppy size="20px" />
				</ActionIcon>
			</Tooltip>
		);
	}

	//
	// G. IS DIRTY AND iS VALID
	// If the form has changes and is valid, the close button is disabled
	// and the save button is clickable, waiting the autosave interval trigger.

	if (isDirty && isValid) {
		return (
			<Tooltip label="Guardar Alterações" color="green" position="bottom" withArrow>
				<ActionIcon size="lg" color="green" variant="light" onClick={onSave}>
					<IconDeviceFloppy size="20px" />
				</ActionIcon>
			</Tooltip>
		);
	}

	//
	// H. IDLE
	// If the form has no unsaved changes, is valid and is not loading,
	// then the close button is enabled and the save button shows a reassuring icon and message.

	if (closeType === 'back') return <AppButtonBack onClick={onClose} />;
	if (closeType === 'close') return <AppButtonClose onClick={onClose} />;

	//
}