import { createRouter, createWebHistory } from 'vue-router';
import { AxiosError } from 'axios';

import ViewVariants from '@/views/ViewVariants.vue';
import ViewEssentiality from '@/views/ViewEssentiality.vue';

//

import service from '@/services';

import { sendErrorNotification } from '@/notifications';

const routes = [
  {
    path: '/:geneId?',
    name: 'variants',
    component: ViewVariants,
    props: true,
  },
  {
    path: '/essentiality',
    name: 'essentiality',
    component: ViewEssentiality,
    props: true,
    async beforeEnter(to) {
      try {
        const { data: essentialityData } =
          await service.getCellLineEssentialityProfiles(to.query);
        if (!essentialityData) {
          throw new Error(`Unable to retrieve data`);
        }
        to.params.data = essentialityData.data;
        to.params.rankRatio = essentialityData.rankRatio;
        to.params.tissueName = to.query.tissueName;
        to.params.variantId = to.query.variantId;
        to.params.geneId = to.query.geneId;
        return true;
      } catch (error) {
        let message = 'Unknown Error';
        if (error instanceof AxiosError) {
          message = error.message;
        }
        sendErrorNotification({
          title: 'Cannot retrieve data',
          message,
        });
        return false;
      }
    },
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
