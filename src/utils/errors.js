import { sendErrorNotification } from '@nf-data-iu3/ht-vue';

export const processErrorMessage = (error) => {
  const message = error.message ? error.message : 'Unknown Error';

  sendErrorNotification({
    title: 'Cannot retrieve data',
    message,
  });
};
