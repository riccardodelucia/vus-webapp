<template>
  <AppLayout>
    <div class="container card">
      <form class="controls margin-bottom" @submit.prevent="onSubmit">
        <ht-search-bar v-model="gene" placeholder="Search gene"></ht-search-bar>
        <button class="btn btn--primary">Search</button>
      </form>
      <VariantsMultichart v-if="ready"></VariantsMultichart>
    </div>
  </AppLayout>
</template>

<script>
import AppLayout from '../layouts/AppLayout.vue';
import VariantsMultichart from '../components/heatmap/VariantsMultichart.vue';
import { sendErrorNotification } from '@/notifications';

import { AxiosError } from 'axios';

import { ref, provide, watchEffect } from 'vue';

import service from '@/services';

import { useRouter } from 'vue-router';

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
    const dam = column.map((item) => item.dam).includes(1);
    return { tissueName: tissue, nPatients: sum, dam };
  });
}

export default {
  name: 'ViewVariants',
  components: { AppLayout, VariantsMultichart },
  props: { geneId: { type: String, default: '' } },
  setup(props) {
    const gene = ref(props.geneId);
    const router = useRouter();

    const ready = ref(false);

    const variants = ref(null);
    const tissues = ref(null);

    const heatmap = ref(null);
    const aggregatedDam = ref(null);
    const annotationsHeatmap = ref(null);

    const heatmapColor = ref(null);

    provide('variants', variants);
    provide('tissues', tissues);
    provide('heatmap', heatmap);
    provide('aggregatedDam', aggregatedDam);
    provide('annotationsHeatmap', annotationsHeatmap);
    provide('heatmapColor', heatmapColor);

    const interpolator = (t) => {
      if (t === -Infinity) {
        return color('#eee');
      } else {
        return interpolateOranges(t);
      }
    };

    async function onSubmit() {
      gene.value &&
        router.push({
          name: 'variants',
          query: { geneId: gene.value },
        });
    }

    watchEffect(async () => {
      if (props.geneId) {
        ready.value = false;
        try {
          const { data: v } = await service.getVariants(props.geneId);

          variants.value = v;

          const { data: t } = await service.getTissues();
          tissues.value = t;

          const { data: d } = await service.getVariantsData(props.geneId);
          const { data: a } = await service.getAnnotations(props.geneId);
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
      }
    });

    return {
      onSubmit,
      gene,
      ready,
    };
  },
};
</script>

<style lang="scss" scoped>
.container {
  width: fit-content;
  margin: var(--space-md);
}

.controls {
  display: flex;
  gap: var(--space-md);
}
</style>
