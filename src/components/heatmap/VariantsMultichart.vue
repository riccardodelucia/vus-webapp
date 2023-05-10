<template>
  <div class="charts-container margin-top">
    <div class="legends">
      <div>
        <h5>DAM Status</h5>
        <div class="dam-legend"></div>
        <span class="text--sm">is DAM</span>
      </div>
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
    <VariantsHeatmap
      :color="heatmapColor"
      :sift-color="siftColor"
      :polyphen-color="polyphenColor"
    ></VariantsHeatmap>
  </div>
</template>

<script>
import VariantsHeatmap from '@/components/heatmap/VariantsHeatmap.vue';

import HTLegendColor from '@/components/heatmap/HTLegendColor.vue';
import HTSwatches from '@/components/HTSwatches.vue';

import { scaleOrdinal, schemeSpectral } from 'd3';

import { inject } from 'vue';

export default {
  name: 'VariantsMultichart',
  components: { VariantsHeatmap, HTLegendColor, HTSwatches },
  setup() {
    const legendChart = {
      width: 105,
      height: 300,
      margins: {
        left: 0,
        right: 80,
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
      .range(schemeSpectral[4])
      .unknown('transparent');

    return {
      legendChart,
      heatmapColor,
      siftColor,
      polyphenColor,
    };
  },
};
</script>

<style lang="scss" scoped>
.legends {
  border: 1px solid var(--color-blue-darker);
  padding: var(--space-sm);
}
.charts-container {
  display: flex;
  gap: var(--space-md);
}

.dam-legend {
  border-radius: 100%;
  width: 10px;
  height: 10px;
  background-color: dodgerblue;
  display: inline-block;
  margin-right: var(--space-sm);
}
</style>
