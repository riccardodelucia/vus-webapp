<template>
  <AppLayout>
    <div class="ht-card ht-container app-content">
      <h2>Search Variants by Gene</h2>
      <p>
        You can either select a variant from the chart or type+enter the gene in
        the search bar
      </p>
      <div class="page-content">
        <div class="details ht-layout-stack">
          <ht-search-bar
            v-model="gene"
            label="Search gene"
            @submit="onSubmit"
          ></ht-search-bar>
          <div class="legend">
            <p class="legend-title">Legend</p>
            <ul class="ht-reset">
              <li style="color: DeepPink">Driver variant</li>
              <li>Non-Driver variant</li>
              <li>
                <svg
                  preserveAspectRatio="xMinYMin meet"
                  viewBox="[0, 0, 10, 10]"
                  width="10"
                  height="10"
                >
                  <circle cx="5" cy="5" r="4px" fill="DeepPink"></circle>
                </svg>
                <span>Deleterious SIFT</span>
              </li>
              <li>
                <svg
                  preserveAspectRatio="xMinYMin meet"
                  viewBox="[0, 0, 10, 10]"
                  width="10"
                  height="10"
                >
                  <polygon points="5,0 0,8 10,8" fill="DeepPink"></polygon>
                </svg>
                <span>Deleterious Polyphen</span>
              </li>
            </ul>
          </div>
        </div>
        <CircularBarPlot :data="data"></CircularBarPlot>
      </div>
    </div>
  </AppLayout>
</template>

<script>
import AppLayout from '@/layouts/AppLayout.vue';

import CircularBarPlot from '@/components/CircularBarPlot.vue';

import { useRouter } from 'vue-router';

import { ref } from 'vue';

import placeholder from '@/assets/img/placeholder.png';

export default {
  components: { AppLayout, CircularBarPlot },
  props: {
    data: { type: Array, required: true },
  },
  setup() {
    const gene = ref('');
    const router = useRouter();
    function onSubmit() {
      router.push({
        name: 'variants',
        params: { geneId: gene.value },
      });
    }

    return {
      gene,
      onSubmit,
      placeholder,
    };
  },
};
</script>

<style lang="postcss" scoped>
.page-content {
  display: grid;
  grid-template-columns: max-content 1fr;
  gap: var(--size-2);
  margin-top: var(--size-4);
}

.details {
  grid-column: 1/2;
}
.chart {
  grid-column: 2/3;
}
</style>
