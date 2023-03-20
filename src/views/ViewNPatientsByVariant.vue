<template>
  <AppLayout>
    <div class="container card">
      <form class="controls margin-bottom" @submit.prevent="onSubmit">
        <ht-search-bar v-model="gene" placeholder="Search gene"></ht-search-bar>
        <button class="btn btn--primary">Search</button>
      </form>
      <HeatmapMultichart v-if="GStore.geneData"></HeatmapMultichart>
    </div>
  </AppLayout>
</template>

<script>
import AppLayout from "../layouts/AppLayout.vue";

import { ref } from "vue";

import HeatmapMultichart from "../components/heatmap/HeatmapMultichart.vue";

import service from "../services/index.js";
import { inject } from "vue";

export default {
  name: "ViewNPatientsByVariant",
  components: { AppLayout, HeatmapMultichart },
  setup() {
    const gene = ref("");
    const GStore = inject("GStore");

    async function onSubmit() {
      if (gene.value) {
        const newData = await service.getMutationByGene(
          gene.value.toUpperCase()
        );
        if (newData) GStore.geneData = newData;
      }
    }

    return {
      onSubmit,
      gene,
      GStore,
    };
  },
};
</script>

<style lang="scss" scoped>
.container {
  width: fit-content;
  margin: var(--space-md);
}

.controls {
  display: flex;
  gap: var(--space-md);
}
</style>
