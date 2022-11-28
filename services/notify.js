import { showNotification, updateNotification } from '@mantine/notifications';
import { TbCheck } from 'react-icons/tb';

/* * * * * */
/* UI NOTIFICATIONS (TOASTS) */
/* * */

export default async function notify(identifier, type, title, message) {
  //

  const defaultOptions = {
    id: identifier,
    title: title,
    autoClose: 5000,
    title: title,
    message: message,
  };

  switch (type) {
    case 'loading':
      defaultOptions.loading = true;
      defaultOptions.autoClose = false;
      defaultOptions.disallowClose = true;
      showNotification(defaultOptions);
      break;

    case 'success':
      defaultOptions.autoClose = 3000;
      defaultOptions.icon = <TbCheck />;
      updateNotification(defaultOptions);
      break;

    case 'error':
      defaultOptions.autoClose = 7000;
      updateNotification(defaultOptions);
      break;

    default:
      break;
  }
}
