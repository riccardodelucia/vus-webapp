<template>
  <h3>Top frequently observed DAMs by potential clinical impact</h3>
  <div class="grid">
    <TopVariantsDetails class="details"></TopVariantsDetails>
    <TopVariantsCircularBarPlot class="chart"></TopVariantsCircularBarPlot>
  </div>
</template>

<script>
import TopVariantsDetails from '@/components/TopVariantsDetails.vue';

import TopVariantsCircularBarPlot from '@/components/TopVariantsCircularBarPlot.vue';

import { useRouter } from 'vue-router';

import { ref } from 'vue';

import placeholder from '@/assets/img/placeholder.png';

export default {
  name: 'TopVariants',
  components: { TopVariantsDetails, TopVariantsCircularBarPlot },
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
:deep(.orange) {
  fill: orange;
  background-color: orange;
}

:deep(.purple) {
  fill: rebeccapurple;
  background-color: rebeccapurple;
}

h3 {
  font-size: var(--font-size-1);
}
</style>
