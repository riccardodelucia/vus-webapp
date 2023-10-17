import { createRouter, createWebHistory } from 'vue-router';

import ViewHome from '@/views/ViewHome.vue';
import ViewApp from '@/views/ViewApp.vue';
import SearchVariants from '@/components/search/SearchVariants.vue';

import ShowVariants from '@/components/variants/ShowVariants.vue';
import ShowCellLinesByVariant from '@/components/cell_lines/ShowCellLinesByVariant.vue';
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
      { path: '', name: 'search', component: SearchVariants },
      {
        path: ':geneId',
        name: 'variants',
        props: true,
        component: ShowVariants,
      },
      {
        path: 'cell-lines-by-variant/:geneId/:variantId/:tissueName/:dam',
        name: 'cell-lines-by-variant',
        component: ShowCellLinesByVariant,
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
