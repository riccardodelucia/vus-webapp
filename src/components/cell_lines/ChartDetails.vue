<template>
  <div class="ht-layout-stack">
    <div>
      <p class="legend-title">Details</p>
      <ul class="ht-reset">
        <li><b>Gene:</b> {{ details.geneId.toUpperCase() }}</li>
        <li><b>Cancer Type:</b> {{ details.tissueName }}</li>
        <li><b>Rank Ratio:</b> {{ Number(details.rankRatio.toFixed(2)) }}</li>
        <template v-if="type === 'essentiality'">
          <li v-if="details.variantId">
            <b>Variant:</b> {{ details.variantId }} (is DAM: {{ details.dam }})
          </li>
          <li v-else><b>All variants</b></li></template
        >
        <template v-else>
          <li><b>All variants</b></li>
          <li>
            <b>Drug: </b> {{ drug.drugName }}, GDSC {{ drug.gdscVersion }} (is
            SAM: {{ Boolean(drug.sam) }})
          </li>
        </template>
      </ul>
    </div>
    <MutationStatusLegend></MutationStatusLegend>
  </div>
</template>

<script>
import MutationStatusLegend from '@/components/cell_lines/MutationStatusLegend.vue';

export default {
  name: 'ChartDetails',
  components: { MutationStatusLegend },
  props: {
    details: {
      type: Object,
      required: true,
    },
    drug: {
      type: Object,
      default: () => ({}),
    },
    type: { type: String, default: 'essentiality' },
  },
  setup() {
    return {};
  },
};
</script>
