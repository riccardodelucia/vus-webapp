<template>
  <h2>Gene: {{ geneId.toUpperCase() }}</h2>
  <router-link
    :to="{ name: 'variants', params: { geneId } }"
    class="ht-button back-link"
    >&#8592; Back</router-link
  >
  <div class="grid">
    <EssentialityDetails
      v-if="details"
      class="details"
      :details="details"
    ></EssentialityDetails>
    <EssentialityProfiles
      v-if="cellLinesData"
      class="chart"
      :cell-lines-data="cellLinesData"
      :sizes="sizes"
      :tissue-name="tissueName"
      :variant-id="variantId"
      :dam="dam"
    >
    </EssentialityProfiles>
  </div>
</template>

<script>
import EssentialityDetails from '@/components/cell_lines/EssentialityDetails.vue';
import EssentialityProfiles from '@/components/cell_lines/EssentialityProfiles.vue';

import { getInnerChartSizes } from '@computational-biology-sw-web-dev-unit/ht-vue';

import { onBeforeMount, ref } from 'vue';

import service from '@/services';

import { processErrorMessage } from '@/utils/errors.js';

import { extent } from 'd3';

export default {
  name: 'ShowCellLinesByVariant',
  components: {
    EssentialityDetails,
    EssentialityProfiles,
  },
  props: {
    geneId: { type: String, required: true },
    tissueName: { type: String, required: true },
    variantId: { type: String, required: true },
    dam: { type: String, required: true },
  },
  setup(props) {
    const width = 1000;
    const height = 700;

    const margins = {
      top: 30,
      bottom: 100,
      left: 60,
      right: 20,
    };

    const { innerWidth, innerHeight } = getInnerChartSizes(
      width,
      height,
      margins
    );

    const sizes = { width, height, margins, innerWidth, innerHeight };

    const cellLinesData = ref(null);
    const rankRatio = ref(0);
    const xDomain = ref(null);
    const yDomain = ref(null);
    const details = ref(null);

    onBeforeMount(async () => {
      try {
        const { data } = await service.getCellLinesDataByVariant({
          tissueName: props.tissueName,
          variantId: props.variantId,
          geneId: props.geneId,
        });

        if (!data) {
          throw new Error(`Unable to retrieve data`);
        }

        cellLinesData.value = data.cellLinesData;
        rankRatio.value = data.rankRatio;

        xDomain.value = cellLinesData.value.map(
          ({ cellLineName }) => cellLineName
        );

        yDomain.value = extent(
          cellLinesData.value.map(({ essentiality }) => essentiality)
        );

        details.value = {
          geneId: props.geneId,
          rankRatio: rankRatio.value,
          tissueName: props.tissueName,
          variantId: props.variantId,
          dam: props.dam,
        };
      } catch (error) {
        processErrorMessage(error);
      }
    });

    return {
      sizes,
      details,
      cellLinesData,
    };
  },
};
</script>

<style lang="postcss" scoped></style>
