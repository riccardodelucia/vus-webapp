<template>
  <div class="charts-container flex">
    <div class="details">
      <HTSwatches
        title="DAM Status"
        :color="damColor"
        shape="round"
      ></HTSwatches>
      <HTSwatches title="Polyphen" :color="polyphenColor"></HTSwatches>
      <HTSwatches title="SIFT" :color="siftColor"></HTSwatches>
      <HTLegendColor
        :margins="legendChart.margins"
        :width="legendChart.width"
        :height="legendChart.height"
        :color="heatmapColor"
        title="log(#patients)"
      ></HTLegendColor>
    </div>
    <div class="heatmap-container">
      <VariantsHeatmap
        :color="heatmapColor"
        :sift-color="siftColor"
        :polyphen-color="polyphenColor"
      ></VariantsHeatmap>
    </div>
  </div>
</template>

<script>
import VariantsHeatmap from '@/components/heatmap/VariantsHeatmap.vue';

import HTLegendColor from '@/components/heatmap/HTLegendColor.vue';
import HTSwatches from '@/components/HTSwatches.vue';

import { scaleOrdinal, schemeSpectral, schemeRdBu } from 'd3';

import { inject } from 'vue';

export default {
  name: 'VariantsMultichart',
  components: { VariantsHeatmap, HTLegendColor, HTSwatches },
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

<style lang="scss" scoped>
.legends {
  border: 1px solid var(--color-blue-darker);
  padding: var(--space-sm);
}
</style>
