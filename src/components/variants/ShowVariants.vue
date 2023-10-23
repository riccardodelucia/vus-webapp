<template>
  <h2>Gene: {{ geneId.toUpperCase() }}</h2>

  <div class="grid variants-grid">
    <ChartDetails
      v-if="data"
      class="details"
      :legend-sizes="legendSizes"
      :polyphen-color="polyphenColor"
      :heatmap-color="heatmapColor"
      :sift-color="siftColor"
    >
    </ChartDetails>
    <div v-if="data" class="chart">
      <VariantsHeatmap
        :data="data"
        :aggregated-data="aggregatedData"
        :annotations="annotations"
        :gene-id="geneId"
        :color="heatmapColor"
        :sift-color="siftColor"
        :polyphen-color="polyphenColor"
      ></VariantsHeatmap>
    </div>
  </div>
</template>

<script>
import VariantsHeatmap from '@/components/variants/VariantsHeatmap.vue';
import ChartDetails from '@/components/variants/ChartDetails.vue';

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
  name: 'ShowVariants',
  components: { ChartDetails, VariantsHeatmap },
  props: {
    geneId: { type: String, required: true },
  },
  setup(props) {
    const data = ref(null);
    const aggregatedData = ref(null);
    const annotations = ref(null);
    const heatmapColor = ref(null);

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

    watchEffect(async () => {
      try {
        const variantsData = await service.getVariantsData(props.geneId);
        const aggregatedVariantsData = await service.getVariantsAggregatedData(
          props.geneId
        );
        const annotationsData = await service.getVariantsAnnotations(
          props.geneId
        );

        data.value = variantsData.data;
        aggregatedData.value = aggregatedVariantsData.data;
        annotations.value = annotationsData.data;

        const interpolator = (t) => {
          if (t === -Infinity) {
            return color('#eee');
          } else {
            return interpolateOranges(t);
          }
        };

        heatmapColor.value = scaleSequentialLog(interpolator).domain(
          extent(data.value.map(({ nPatients }) => nPatients + 1))
        );
      } catch (error) {
        processErrorMessage(error);
      }
    });

    // sift and polyphen labels are hardcoded to avoid cases where the current variant doesn't have info for all of the possible sift and polyphen values
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
      legendSizes,
      polyphenColor,
      siftColor,
      damColor,
      heatmapColor,
      data,
      aggregatedData,
      annotations,
    };
  },
};
</script>

<style lang="postcss" scoped>
.round-symbol {
  border-radius: var(--radius-round);
}
</style>
