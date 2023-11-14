import { createRouter, createWebHistory } from 'vue-router';

import ViewHome from '@/views/ViewHome.vue';
import ViewApp from '@/views/ViewApp.vue';
import TopVariants from '@/components/TopVariants.vue';

import GeneVariants from '@/components/GeneVariants.vue';
import CellLinesByVariant from '@/components/CellLinesByVariant.vue';
import ShowCellLinesAggregated from '@/components/cell_lines/ShowCellLinesAggregated.vue';

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
        component: ShowCellLinesAggregated,
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
