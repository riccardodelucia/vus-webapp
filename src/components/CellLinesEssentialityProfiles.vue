<template>
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
        @mouseover="onMouseOver($event, datum)"
        @mouseleave="onMouseLeave"
      />
    </g>
  </CellLinesChart>
</template>

<script>
import CellLinesChart from '@/components/CellLinesChart.vue';

import { useTooltip } from '@computational-biology-sw-web-dev-unit/ht-vue';

import { extent } from 'd3';

export default {
  name: 'CellLinesEssentialityProfiles',
  components: { CellLinesChart },
  props: {
    cellLinesData: { type: Array, required: true },
    sizes: { type: Object, required: true },
  },
  setup(props) {
    const { showTooltip, hideTooltip } = useTooltip();

    const onMouseOver = function (event, { mutation }) {
      if (mutation) showTooltip(event, mutation);
    };

    const onMouseLeave = function () {
      hideTooltip();
    };

    const xDomain = props.cellLinesData.map(({ cellLineName }) => cellLineName);

    const yDomain = extent(
      props.cellLinesData.map(({ essentiality }) => essentiality)
    );

    return { onMouseOver, onMouseLeave, xDomain, yDomain };
  },
};
</script>
