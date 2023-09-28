<template>
  <div class="variants-multichart-container">
    <div class="details">
      <ht-swatches
        title="DAM Status"
        :color="damColor"
        shape="round"
      ></ht-swatches>
      <ht-swatches title="Polyphen" :color="polyphenColor"></ht-swatches>
      <ht-swatches title="SIFT" :color="siftColor"></ht-swatches>
      <ht-chart-legend-color
        :margins="legendChart.margins"
        :width="legendChart.width"
        :height="legendChart.height"
        :color="heatmapColor"
        title="log(#patients)"
      ></ht-chart-legend-color>
    </div>
    <div class="variants">
      <VariantsHeatmap
        :color="heatmapColor"
        :sift-color="siftColor"
        :polyphen-color="polyphenColor"
      ></VariantsHeatmap>
    </div>
  </div>
</template>

<script>
import VariantsHeatmap from '@/components/variants/VariantsHeatmap.vue';

import { scaleOrdinal, schemeSpectral, schemeRdBu } from 'd3';

import { inject } from 'vue';

export default {
  name: 'VariantsMultichart',
  components: { VariantsHeatmap },
  setup() {
    const legendChart = {
      width: 150,
      height: 300,
      margins: {
        left: 10,
        right: 120,
        top: 30,
        bottom: 10,
      },
    };

    const heatmapColor = inject('heatmapColor');

    // hardcoded labels allow to collect and order all attributes
    const polyphen = ['probably_damaging', 'possibly_damaging', 'benign'];

    const polyphenColor = scaleOrdinal()
      .domain(polyphen)
      .range(schemeSpectral[3])
      .unknown('transparent');

    const sift = [
      'deleterious',
      'deleterious_low_confidence',
      'tolerated_low_confidence',
      'tolerated',
    ];
    const siftColor = scaleOrdinal()
      .domain(sift)
      .range(schemeRdBu[4])
      .unknown('transparent');

    const damColor = scaleOrdinal()
      .domain(['is DAM'])
      .range(['dodgerblue'])
      .unknown('transparent');

    return {
      legendChart,
      heatmapColor,
      siftColor,
      polyphenColor,
      damColor,
    };
  },
};
</script>

<style lang="postcss" scoped>
.variants-multichart-container {
  display: grid;
  grid-template-areas: 'details heatmap';
  grid-template-columns: repeat(2, auto);
  grid-column-gap: var(--size-6);
}

.details {
  grid-area: details;
}

.variants {
  grid-area: heatmap;
}
</style>
