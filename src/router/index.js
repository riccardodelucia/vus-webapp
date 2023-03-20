import { createRouter, createWebHistory } from "vue-router";

import ViewNPatientsByVariant from "@/views/ViewNPatientsByVariant.vue";
import ViewEssentiality from "@/views/ViewEssentiality.vue";

import service from "@/services";

const routes = [
  {
    path: "/",
    name: "patients-by-variant",
    component: ViewNPatientsByVariant,
  },
  {
    path: "/essentiality",
    name: "essentiality",
    component: ViewEssentiality,
    props: true,
    async beforeEnter(to, from) {
      const essentialityData = await service.getEssentialityProfiles(to.query);
      if (essentialityData) {
        to.params.data = essentialityData;
        to.params.query = to.query;
        return true;
      }
      return false;
    },
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
