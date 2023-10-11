import { createRouter, createWebHistory } from 'vue-router';
import { AxiosError } from 'axios';

import ViewHome from '@/views/ViewHome.vue';
import ViewSearch from '@/views/ViewSearch.vue';

import ViewVariants from '@/views/ViewVariants.vue';
import ViewCellLinesByVariant from '@/views/ViewCellLinesByVariant.vue';
import ViewCellLinesAggregated from '@/views/ViewCellLinesAggregated.vue';

import service from '@/services';

import { sendErrorNotification } from '@/notifications';

const processErrorMessage = (error) => {
  let message = 'Unknown Error';
  if (error instanceof AxiosError) {
    message = error.message;
  }
  return message;
};

const routes = [
  {
    path: '/',
    name: 'home',
    component: ViewHome,
  },
  {
    path: '/search',
    name: 'search',
    component: ViewSearch,
    props: true,
    async beforeEnter(to) {
      try {
        const { data } = await service.getMostImportantVariants();
        to.params.data = data;
        return true;
      } catch (error) {
        const message = processErrorMessage(error);
        sendErrorNotification({
          title: 'Cannot retrieve data',
          message,
        });
        return false;
      }
    },
  },
  {
    path: '/variants/:geneId',
    name: 'variants',
    component: ViewVariants,
    props: true,
    async beforeEnter(to) {
      const geneId = to.params.geneId;

      try {
        const variantsData = await service.getVariantsData(geneId);
        const aggregatedVariantsData = await service.getVariantsAggregatedData(
          geneId
        );
        const annotationsData = await service.getVariantsAnnotations(geneId);

        to.params.data = variantsData.data;
        to.params.aggregatedData = aggregatedVariantsData.data;
        to.params.annotations = annotationsData.data;

        return true;
      } catch (error) {
        const message = processErrorMessage(error);
        sendErrorNotification({
          title: 'Cannot retrieve data',
          message,
        });
        return false;
      }
    },
  },
  {
    path: '/cell-lines/by-variant',
    name: 'cell-lines-by-variant',
    component: ViewCellLinesByVariant,
    props: true,
    async beforeEnter(to) {
      try {
        const { data } = await service.getCellLinesDataByVariant(to.query);

        if (!data) {
          throw new Error(`Unable to retrieve data`);
        }
        to.params.cellLinesData = data.cellLinesData;
        to.params.geneId = to.query.geneId;
        to.params.rankRatio = data.rankRatio;
        to.params.tissueName = to.query.tissueName;
        to.params.variantId = to.query.variantId;
        to.params.dam = to.query.dam;

        return true;
      } catch (error) {
        const message = processErrorMessage(error);
        sendErrorNotification({
          title: 'Cannot retrieve data',
          message,
        });
        return false;
      }
    },
  },
  {
    path: '/cell-lines/aggregated',
    name: 'cell-lines-aggregated',
    component: ViewCellLinesAggregated,
    props: true,
    async beforeEnter(to) {
      try {
        const { data } = await service.getCellLinesDataAggregated(to.query);

        if (!data) {
          throw new Error(`Unable to retrieve data`);
        }

        to.params.cellLinesData = data.cellLinesData;
        to.params.geneId = to.query.geneId;
        to.params.rankRatio = data.rankRatio;
        to.params.tissueName = to.query.tissueName;
        to.params.drugs = [];

        const { data: drugs } = await service.getDrugsTestedOnGene(to.query);
        if (drugs.length > 0) to.params.drugs = drugs;

        return true;
      } catch (error) {
        const message = processErrorMessage(error);
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
