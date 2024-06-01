import { notifications } from '@mantine/notifications';
import { IconCheck } from '@tabler/icons-react';

/* * * * * */
/* UI NOTIFICATIONS (TOASTS) */
/* * */

export default async function notify(identifier, type, title, message) {
	//

	const defaultOptions = {
		autoClose: 5000,
		id: identifier,
		message: message,
		title: title,
	};

	switch (type) {
		case 'loading':
			defaultOptions.loading = true;
			defaultOptions.autoClose = false;
			defaultOptions.withCloseButton = false;
			notifications.show(defaultOptions);
			break;

		case 'success':
			defaultOptions.loading = false;
			defaultOptions.autoClose = 3000;
			defaultOptions.icon = <IconCheck />;
			defaultOptions.color = 'green';
			notifications.update(defaultOptions);
			break;

		case 'error':
			defaultOptions.loading = false;
			defaultOptions.autoClose = 7000;
			defaultOptions.color = 'red';
			notifications.update(defaultOptions);
			break;

		default:
			break;
	}
}
