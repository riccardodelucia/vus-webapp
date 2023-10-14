<template>
  <div class="grid">
    <ChartDetails class="details"></ChartDetails>
    <CircularBarPlot class="chart"></CircularBarPlot>
  </div>
</template>

<script>
import ChartDetails from '@/components/search/ChartDetails.vue';

import CircularBarPlot from '@/components/search/CircularBarPlot.vue';

import { useRouter } from 'vue-router';

import { ref } from 'vue';

import placeholder from '@/assets/img/placeholder.png';

export default {
  components: { ChartDetails, CircularBarPlot },
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
