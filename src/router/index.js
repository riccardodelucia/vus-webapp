import { createRouter, createWebHistory } from "vue-router";

import ViewMainPage from "@/views/ViewMainPage.vue";

const routes = [
  {
    path: "/",
    component: ViewMainPage,
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
