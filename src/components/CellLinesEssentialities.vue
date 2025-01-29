<template>
  <CellLinesChart
    v-slot="slotProps"
    :sizes="sizes"
    x-axis-label="Cell Lines"
    :x-domain="xDomain"
    :y-domain="yDomain"
    y-axis-label="log(FC)"
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
        :fill="datum.mutation ? 'red' : 'blue'"
        @mouseover="onMouseOver($event, datum)"
        @mouseleave="onMouseLeave(datum)"
      />
    </g>
  </CellLinesChart>
</template>

<script setup>
import CellLinesChart from '@/components/CellLinesChart.vue';

import { useTooltip } from '@nf-data-iu3/ht-vue';

import { extent } from 'd3';

const props = defineProps({
  cellLinesData: { type: Array, required: true },
  sizes: { type: Object, required: true },
});

const { showTooltip, hideTooltip } = useTooltip();

const onMouseOver = function (event, { mutation }) {
  if (mutation) showTooltip(event, mutation);
};

const onMouseLeave = function ({ mutation }) {
  if (mutation) hideTooltip();
};

const xDomain = props.cellLinesData.map(({ cellLineName }) => cellLineName);

const yExtent = extent(
  props.cellLinesData.map(({ essentiality }) => essentiality)
);

const yMin = Math.min(-0.55, yExtent[0]);

const yDomain = [yMin, yExtent[1]];
</script>
