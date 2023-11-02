import { sendErrorNotification } from '@/notifications';

export const processErrorMessage = (error) => {
  const message = error.message ? error.message : 'Unknown Error';

  sendErrorNotification({
    title: 'Cannot retrieve data',
    message,
  });
};
