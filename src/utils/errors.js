import { sendErrorNotification } from '@/notifications';

import { AxiosError } from 'axios';

export const processErrorMessage = (error) => {
  let message = 'Unknown Error';
  if (error instanceof AxiosError) {
    message = error.message;
  }
  sendErrorNotification({
    title: 'Cannot retrieve data',
    message,
  });
};
