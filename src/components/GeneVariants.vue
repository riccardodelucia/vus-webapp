<template>
  <template v-if="data">
    <h2>Gene: {{ geneId.toUpperCase() }}</h2>
    <div class="grid variants-grid">
      <GeneVariantsDetails
        v-if="data"
        class="details"
        :legend-sizes="legendSizes"
        :polyphen-color="polyphenColor"
        :heatmap-color="legendHeatmapColor"
        :sift-color="siftColor"
      >
      </GeneVariantsDetails>
      <div v-if="data" class="chart">
        <GeneVariantsHeatmap
          :data="data"
          :aggregated-data="aggregatedData"
          :annotations="annotations"
          :gene-id="geneId"
          :variant-id="variantId"
          :color="heatmapColor"
          :sift-color="siftColor"
          :polyphen-color="polyphenColor"
        ></GeneVariantsHeatmap>
      </div></div
  ></template>
  <p v-else>Error: please try again</p>
</template>

<script>
import GeneVariantsHeatmap from '@/components/GeneVariantsHeatmap.vue';
import GeneVariantsDetails from '@/components/GeneVariantsDetails.vue';

import { ref, watchEffect } from 'vue';

import { processErrorMessage } from '@/utils/errors.js';

import {
  scaleOrdinal,
  scaleSequentialLog,
  schemeSpectral,
  schemeRdBu,
  interpolateOranges,
  color,
  extent,
} from 'd3';

import service from '@/services';

export default {
  name: 'GeneVariants',
  components: { GeneVariantsDetails, GeneVariantsHeatmap },
  props: {
    geneId: { type: String, required: true },
    variantId: { type: String, default: '' },
  },
  setup(props) {
    const data = ref(null);
    const aggregatedData = ref(null);
    const annotations = ref(null);
    const heatmapColor = ref(null);
    const legendHeatmapColor = ref(null);

    const legendSizes = {
      width: 150,
      height: 300,
      margins: {
        left: 10,
        right: 120,
        top: 30,
        bottom: 10,
      },
    };

    const logScale = scaleSequentialLog(interpolateOranges).domain([1, 1000]);

    watchEffect(async () => {
      try {
        const { data: variantsData } = await service.getVariantsData(
          props.geneId
        );

        if (variantsData.length === 0) {
          throw new Error(`No data for gene ${props.geneId}`);
        }

        const { data: aggregatedVariantsData } =
          await service.getVariantsAggregatedData(props.geneId);
        const { data: annotationsData } = await service.getVariantsAnnotations(
          props.geneId
        );

        data.value = variantsData;
        aggregatedData.value = aggregatedVariantsData;
        annotations.value = annotationsData;

        const makeColorScale = () => {
          return {
            colorScale: (n) => {
              if (n === 0) return '#eee';
              return logScale(n);
            },
            legendColorScale: logScale,
          };
        };

        const { colorScale, legendColorScale } = makeColorScale();

        heatmapColor.value = colorScale;
        legendHeatmapColor.value = legendColorScale;
      } catch (error) {
        processErrorMessage(error);
      }
    });

    // sift and polyphen labels are hardcoded to avoid cases where the current variant doesn't have info for all of the possible sift and polyphen values
    const polyphen = ['probably_damaging', 'possibly_damaging', 'benign'];
    const polyphenColor = scaleOrdinal()
      .domain(polyphen)
      .range(schemeSpectral[3])
      .unknown('#eee');

    const sift = [
      'deleterious',
      'deleterious_low_confidence',
      'tolerated_low_confidence',
      'tolerated',
    ];
    const siftColor = scaleOrdinal()
      .domain(sift)
      .range(schemeRdBu[4])
      .unknown('#eee');

    const damColor = scaleOrdinal()
      .domain(['is DAM'])
      .range(['dodgerblue'])
      .unknown('transparent');

    return {
      legendSizes,
      polyphenColor,
      siftColor,
      damColor,
      heatmapColor,
      data,
      aggregatedData,
      annotations,
      legendHeatmapColor,
    };
  },
};
</script>

<style lang="postcss" scoped>
.round-symbol {
  border-radius: var(--radius-round);
}
</style>
