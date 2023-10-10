<template>
  <ht-swatches title="Mutation Status" :color="mutationColor"></ht-swatches>
</template>

<script>
import { scaleOrdinal } from 'd3';

export default {
  name: 'MutationStatusLegend',
  setup() {
    const mutationColor = scaleOrdinal()
      .domain(['Mutated', 'Not mutated'])
      .range(['red', 'black']);

    return { mutationColor };
  },
};
</script>

<style lang="scss" scoped></style>
