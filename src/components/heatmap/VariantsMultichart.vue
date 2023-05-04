<template>
  <div class="charts-container margin-top">
    <div v-if="ready" class="legends">
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
      v-if="ready"
      :gene-id="id"
      :heatmap="heatmap"
      :annotations-heatmap="annotationsHeatmap"
      :aggregated-dam="aggregatedDam"
      :variants="variants"
      :tissues="tissues"
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

import {
  scaleSequentialLog,
  scaleOrdinal,
  extent,
  interpolateOranges,
  color,
  schemeSpectral,
} from 'd3';

import { ref, watchEffect } from 'vue';

import { sendErrorNotification } from '@/notifications';

import service from '@/services';
import { AxiosError } from 'axios';

function fillHeatmap({ data, variants, tissues }) {
  // this method expands data over the entire heatmap.

  // preallocate the empty heatmap
  const emptyHeatmap = Array(tissues.length)
    .fill()
    .map(() => Array(variants.length).fill());

  const heatmap = emptyHeatmap.map((column, j) =>
    column.map((_, i) => {
      return {
        variantId: variants[i],
        tissueName: tissues[j],
        nPatients: 0,
        dam: 0,
      };
    })
  );

  // override heatmap cells that have actual content according to data
  data.forEach((item) => {
    const i = variants.indexOf(item.variantId);
    const j = tissues.indexOf(item.tissueName);
    heatmap[j][i] = item;
  });

  // return the flattened one dimensional heatmap array.
  // dealing with one dimensional arrays and positioning according to scale values
  // is much easier than working with bidimensional grid positioning according to indexes
  return heatmap.flat();
}

function fillAnnotationsHeatmap({ variants, annotations }) {
  const emptyHeatmap = Array(variants.length).fill();

  const annotationsHeatmap = emptyHeatmap.map((_, i) => {
    return { variantId: variants[i], sift: '', polyphen: '' };
  });

  annotations.forEach((item) => {
    const i = variants.indexOf(item.variantId);
    annotationsHeatmap[i] = item;
  });
  return annotationsHeatmap.flat();
}

function fillAggregatedDam({ data, tissues }) {
  return tissues.map((tissue) => {
    const column = data.filter((item) => item.tissueName === tissue);
    const sum = column.reduce((acc, item) => {
      if (item.dam) return acc + item.nPatients;
      return acc;
    }, 0);
    return { tissueName: tissue, nPatients: sum };
  });
}

export default {
  name: 'VariantsMultichart',
  components: { VariantsHeatmap, HTLegendColor, HTSwatches },
  props: {
    id: { type: String, required: true },
  },
  setup(props) {
    const ready = ref(false);

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

    const variants = ref(null);
    const tissues = ref(null);

    const heatmap = ref(null);
    const aggregatedDam = ref(null);
    const annotationsHeatmap = ref(null);

    const heatmapColor = ref(null);

    const interpolator = (t) => {
      if (t === -Infinity) {
        return color('#eee');
      } else {
        return interpolateOranges(t);
      }
    };

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

    watchEffect(async () => {
      ready.value = false;
      try {
        const { data: v } = await service.getVariants(props.id);

        variants.value = v;

        const { data: t } = await service.getTissues();
        tissues.value = t;

        const { data: d } = await service.getVariantsData(props.id);
        const { data: a } = await service.getAnnotations(props.id);
        heatmap.value = fillHeatmap({
          data: d,
          variants: v,
          tissues: t,
        });

        aggregatedDam.value = fillAggregatedDam({ data: d, tissues: t });

        annotationsHeatmap.value = fillAnnotationsHeatmap({
          variants: v,
          annotations: a,
        });

        heatmapColor.value = scaleSequentialLog(interpolator).domain(
          extent(heatmap.value.map(({ nPatients }) => nPatients + 1))
        );

        // Heatmap must be loaded only when all data is available
        ready.value = true;
      } catch (error) {
        let message = 'Unknown Error';
        if (error instanceof AxiosError) {
          message = error.message;
        }

        sendErrorNotification({
          title: 'Cannot retrieve data',
          message,
        });
      }
    });

    return {
      ready,
      legendChart,
      heatmapColor,
      heatmap,
      annotationsHeatmap,
      aggregatedDam,
      variants,
      tissues,
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
</style>
