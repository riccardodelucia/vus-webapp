<template>
  <AppLayout>
    <div class="ht-card ht-container ht-layout-stack app-content">
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
      <img :src="placeholder" alt="placeholder image" />
    </div>
  </AppLayout>
</template>

<script>
import AppLayout from '@/layouts/AppLayout.vue';

import { useRouter } from 'vue-router';

import { ref } from 'vue';

import placeholder from '@/assets/img/placeholder.png';

export default {
  components: { AppLayout },
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

<style lang="postcss" scoped></style>
