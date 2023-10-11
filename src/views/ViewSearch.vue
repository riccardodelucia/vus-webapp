<template>
  <AppLayout>
    <div class="ht-card ht-container ht-layout-stack app-content search-page">
      <h2>Search Variants by Gene</h2>
      <p>
        You can either select a variant from the chart or type+enter the gene in
        the search bar
      </p>
      <ht-search-bar
        v-model="gene"
        label="Search gene"
        @submit="onSubmit"
      ></ht-search-bar>
      <CircularBarPlot :data="data"></CircularBarPlot>
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
.search-page > * {
  display: block;
}
</style>
