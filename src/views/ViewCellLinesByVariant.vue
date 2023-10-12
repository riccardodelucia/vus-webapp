<template>
  <CellLinesViewLayout
    :details="details"
    :gene-id="geneId"
    title="Cell Lines Information By Variant"
  >
    <template #details>
      <CellLinesDetails :details="details"></CellLinesDetails>
      <router-link
        class="ht-button back-link"
        data-type="secondary"
        :to="{ name: 'variants', params: { geneId: geneId } }"
      >
        <span class="back-link">
          <vue-feather type="arrow-left"></vue-feather>
          Variants
        </span>
      </router-link>
    </template>
    <template #chart>
      <CellLinesEssentialityProfiles
        :sizes="sizes"
        :cell-lines-data="cellLinesData"
      >
      </CellLinesEssentialityProfiles>
    </template>
  </CellLinesViewLayout>
</template>

<script>
import CellLinesViewLayout from '@/layouts/CellLinesViewLayout.vue';
import CellLinesDetails from '@/components/CellLinesDetails.vue';
import CellLinesEssentialityProfiles from '@/components/CellLinesEssentialityProfiles.vue';

import { extent } from 'd3';

import { getInnerChartSizes } from '@computational-biology-sw-web-dev-unit/ht-vue';

export default {
  name: 'ViewCellLinesByVariant',
  components: {
    CellLinesViewLayout,
    CellLinesDetails,
    CellLinesEssentialityProfiles,
  },
  props: {
    cellLinesData: { type: Array, required: true },
    geneId: { type: String, required: true },
    rankRatio: { type: Number, required: true },
    tissueName: { type: String, required: true },
    variantId: { type: String, required: true },
    dam: { type: Number, required: true },
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

    const xDomain = props.cellLinesData.map(({ cellLineName }) => cellLineName);

    const yDomain = extent(
      props.cellLinesData.map(({ essentiality }) => essentiality)
    );

    const details = {
      geneId: props.geneId,
      rankRatio: props.rankRatio,
      tissueName: props.tissueName,
      variantId: props.variantId,
      dam: props.dam,
    };

    return {
      sizes,
      xDomain,
      yDomain,
      details,
    };
  },
};
</script>

<style lang="postcss" scoped></style>
