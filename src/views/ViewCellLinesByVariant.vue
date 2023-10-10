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
      <CellLinesChart
        v-slot="slotProps"
        :sizes="sizes"
        x-axis-label="Cell Lines"
        :x-domain="xDomain"
        :y-domain="yDomain"
        y-axis-label="logFC(essentiality)"
      >
        <g>
          <line
            :x1="0"
            :y1="slotProps.yScale(-0.5)"
            :x2="sizes.innerWidth"
            :y2="slotProps.yScale(-0.5)"
            stroke="black"
            stroke-width="2"
            stroke-dasharray="4 4"
            stroke-opacity="0.5"
          />
          <circle
            v-for="(datum, idx) in cellLinesData"
            :key="idx"
            :cx="slotProps.xScale(datum.cellLineName)"
            :cy="slotProps.yScale(datum.essentiality)"
            r="5"
            :fill="datum.mutation ? 'red' : 'black'"
          />
        </g>
      </CellLinesChart>
    </template>
  </CellLinesViewLayout>
</template>

<script>
import CellLinesViewLayout from '@/layouts/CellLinesViewLayout.vue';
import CellLinesChart from '@/components/CellLinesChart.vue';
import CellLinesDetails from '@/components/CellLinesDetails.vue';

import { extent } from 'd3';

import { getInnerChartSizes } from '@computational-biology-sw-web-dev-unit/ht-vue';

export default {
  name: 'ViewCellLinesByVariant',
  components: {
    CellLinesViewLayout,
    CellLinesDetails,
    CellLinesChart,
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
