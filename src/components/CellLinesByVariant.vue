<template>
  <h2>Gene: {{ geneId.toUpperCase() }}</h2>
  <template v-if="cellLinesData">
    <div class="grid">
      <CellLinesEssentialityDetails
        class="details"
        :details="details"
      ></CellLinesEssentialityDetails>
      <CellLinesEssentialities
        class="chart"
        :cell-lines-data="cellLinesData"
        :sizes="sizes"
        :tissue-name="tissueName"
        :variant-id="variantId"
        :dam="dam"
      >
      </CellLinesEssentialities>
    </div>
  </template>
</template>

<script>
import CellLinesEssentialityDetails from '@/components/CellLinesEssentialityDetails.vue';
import CellLinesEssentialities from '@/components/CellLinesEssentialities.vue';

import { onBeforeMount, ref } from 'vue';

import service from '@/services';

import { processErrorMessage } from '@/utils/errors.js';

import { extent } from 'd3';

import { getInnerChartSizes } from '../utils';

export default {
  name: 'CellLinesByVariant',
  components: {
    CellLinesEssentialityDetails,
    CellLinesEssentialities,
  },
  props: {
    geneId: { type: String, required: true },
    tissueName: { type: String, required: true },
    variantId: { type: String, required: true },
    dam: { type: String, required: true },
  },
  setup(props) {
    const width = 1100;
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
