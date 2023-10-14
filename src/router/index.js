import { createRouter, createWebHistory } from 'vue-router';

import ViewHome from '@/views/ViewHome.vue';
import ViewApp from '@/views/ViewApp.vue';
import ViewSearch from '@/views/ViewSearch.vue';

import ViewVariants from '@/views/ViewVariants.vue';
import ViewCellLinesByVariant from '@/views/ViewCellLinesByVariant.vue';
import ViewCellLinesAggregated from '@/views/ViewCellLinesAggregated.vue';

const routes = [
  {
    path: '/',
    name: 'home',
    component: ViewHome,
  },
  {
    path: '/app',
    component: ViewApp,
    props: true,
    children: [
      { path: '', name: 'search', component: ViewSearch },
      {
        path: ':geneId',
        name: 'variants',
        props: true,
        component: ViewVariants,
      },
      {
        path: 'cell-lines-by-variant/:geneId/:variantId/:tissueName/:dam',
        name: 'cell-lines-by-variant',
        component: ViewCellLinesByVariant,
        props: true,
      },
      {
        path: 'cell-lines-aggregated/:geneId/:tissueName',
        name: 'cell-lines-aggregated',
        component: ViewCellLinesAggregated,
        props: true,
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
