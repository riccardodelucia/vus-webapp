<template>
  <div class="ht-layout-stack">
    <div>
      <p class="legend-title">Details</p>
      <ul class="ht-reset">
        <li><b>Gene:</b> {{ details.geneId.toUpperCase() }}</li>
        <li><b>Cancer Type:</b> {{ details.tissueName }}</li>
        <li><b>Rank Ratio:</b> {{ Number(details.rankRatio.toFixed(2)) }}</li>
        <slot name="ul"></slot>
      </ul>
      <slot></slot>
    </div>
    <MutationStatusLegend></MutationStatusLegend>
  </div>
</template>

<script>
import MutationStatusLegend from '@/components/cell_lines/MutationStatusLegend.vue';

export default {
  name: 'CellLinesDetailsLayout',
  components: { MutationStatusLegend },
  props: {
    details: {
      type: Object,
      required: true,
    },
  },
};
</script>
