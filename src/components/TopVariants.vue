<template>
  <h3>Top frequently observed DAMs by potential clinical impact</h3>
  <div class="grid">
    <TopVariantsDetails class="details"></TopVariantsDetails>
    <TopVariantsCircularBarPlot class="chart"></TopVariantsCircularBarPlot>
  </div>
</template>

<script setup>
import TopVariantsDetails from '@/components/TopVariantsDetails.vue';

import TopVariantsCircularBarPlot from '@/components/TopVariantsCircularBarPlot.vue';
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
