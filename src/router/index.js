import { createRouter, createWebHistory } from 'vue-router';

import ViewHome from '@/views/ViewHome.vue';
import ViewApp from '@/views/ViewApp.vue';
import View404NotFound from '@/views/View404NotFound.vue';

import TopVariants from '@/components/TopVariants.vue';

import GeneVariants from '@/components/GeneVariants.vue';
import CellLinesByVariant from '@/components/CellLinesByVariant.vue';
import CellLinesAggregated from '@/components/CellLinesAggregated.vue';

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
      { path: '', name: 'top-variants', component: TopVariants },
      {
        path: ':geneId/:variantId?',
        name: 'gene-variants',
        props: true,
        component: GeneVariants,
      },
      {
        path: 'cell-lines-by-variant/:geneId/:variantId/:tissueName/:dam',
        name: 'cell-lines-by-variant',
        component: CellLinesByVariant,
        props: true,
      },
      {
        path: 'cell-lines-aggregated/:geneId/:tissueName',
        name: 'cell-lines-aggregated',
        component: CellLinesAggregated,
        props: true,
      },
    ],
  },
  {
    path: '/:catchAll(.*)',
    name: '404',
    component: View404NotFound,
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
