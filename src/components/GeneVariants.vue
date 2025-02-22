<template>
  <template v-if="data">
    <h2>Gene: {{ geneId.toUpperCase() }}</h2>
    <div class="grid variants-grid">
      <GeneVariantsDetails
        v-if="data"
        class="details"
        :legend-sizes="legendSizes"
        :polyphen-color="polyphenColor"
        :heatmap-color="logScaleColorHeatmap"
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

<script setup>
import GeneVariantsHeatmap from '@/components/GeneVariantsHeatmap.vue';
import GeneVariantsDetails from '@/components/GeneVariantsDetails.vue';

import { ref, watchEffect } from 'vue';

import { parseErrorMesssage } from '@nf-data-iu3/ht-vue';

import {
  scaleOrdinal,
  scaleSequentialLog,
  schemeSpectral,
  schemeRdBu,
  interpolateOranges,
} from 'd3';

import service from '@/services';

const props = defineProps({
  geneId: { type: String, required: true },
  variantId: { type: String, default: '' },
});

const data = ref(null);
const aggregatedData = ref(null);
const annotations = ref(null);

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

const maxNPatients = 1000;

const logScaleColorHeatmap = scaleSequentialLog(interpolateOranges).domain([
  1,
  maxNPatients,
]);
const heatmapColor = (n) => {
  if (n === 0) return '#eee';
  return logScaleColorHeatmap(n);
};

watchEffect(async () => {
  try {
    const { data: variantsData } = await service.getVariantsData(props.geneId);

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
  } catch (error) {
    parseErrorMesssage(error);
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
</script>

<style lang="postcss" scoped>
.round-symbol {
  border-radius: var(--radius-round);
}
</style>
