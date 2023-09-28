<template>
  <AppLayout>
    <div class="ht-card ht-container ht-layout-stack app-content">
      <h2>Gene: {{ geneId.toUpperCase() }}</h2>
      <router-link
        class="ht-button"
        :to="{ name: 'search' }"
        data-type="secondary"
      >
        <span class="back-link"
          ><vue-feather type="arrow-left"></vue-feather>Search</span
        >
      </router-link>
      <VariantsChart></VariantsChart>
    </div>
  </AppLayout>
</template>

<script>
import AppLayout from '@/layouts/AppLayout.vue';
import VariantsChart from '@/components/variants/VariantsChart.vue';

import { provide } from 'vue';

import { scaleSequentialLog, extent, interpolateOranges, color } from 'd3';

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
  // dealing with one dimensional arrays and positioning with D3 scale functions
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
    const dam = column.map((item) => item.dam).includes(1);
    return { tissueName: tissue, nPatients: sum, dam };
  });
}

export default {
  name: 'ViewVariants',
  components: { AppLayout, VariantsChart },
  props: {
    geneId: { type: String, required: true },
    variants: { type: Array, required: true },
    variantsData: { type: Array, required: true },
    tissues: { type: Array, required: true },
    annotations: { type: Array, required: true },
  },
  setup(props) {
    const heatmap = fillHeatmap({
      data: props.variantsData,
      variants: props.variants,
      tissues: props.tissues,
    });

    const interpolator = (t) => {
      if (t === -Infinity) {
        return color('#eee');
      } else {
        return interpolateOranges(t);
      }
    };

    const aggregatedDam = fillAggregatedDam({
      data: props.variantsData,
      tissues: props.tissues,
    });

    const annotationsHeatmap = fillAnnotationsHeatmap({
      variants: props.variants,
      annotations: props.annotations,
    });

    const heatmapColor = scaleSequentialLog(interpolator).domain(
      extent(heatmap.map(({ nPatients }) => nPatients + 1))
    );

    provide('geneId', props.geneId);
    provide('variants', props.variants);
    provide('tissues', props.tissues);
    provide('heatmap', heatmap);
    provide('aggregatedDam', aggregatedDam);
    provide('annotationsHeatmap', annotationsHeatmap);
    provide('heatmapColor', heatmapColor);

    return {};
  },
};
</script>
