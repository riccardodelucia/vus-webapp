<template>
  <svg
    class="ht-chart"
    preserveAspectRatio="xMinYMin meet"
    :viewBox="[0, 0, sizes.width, sizes.height].join(' ')"
    :width="sizes.width"
    :height="sizes.height"
  >
    <g :transform="`translate(${sizes.margins.left}, ${sizes.margins.top})`">
      <g ref="yAxis"></g>

      <text
        :x="0"
        :y="0"
        style="font-weight: bold"
        text-anchor="middle"
        :transform="`translate(20,${sizes.innerHeight / 2}) rotate(-90)`"
      >
        {{ yAxisLabel }}
      </text>

      <slot :x-scale="xScale" :y-scale="yScale"></slot>
      <g :transform="`translate(0, ${sizes.innerHeight})`">
        <g ref="xAxis"></g>
        <text
          :x="sizes.innerWidth / 2"
          :y="-4"
          style="font-weight: bold"
          text-anchor="middle"
        >
          {{ xAxisLabel }}
        </text>
      </g>
    </g>
  </svg>
</template>

<script setup>
import { ref, watchEffect } from 'vue';

import { select, axisBottom, axisLeft, scalePoint, scaleLinear } from 'd3';

const props = defineProps({
  xAxisLabel: { type: String, default: 'x axis' },
  xDomain: { type: Array, required: true },
  yAxisLabel: { type: String, default: 'y axis' },
  yDomain: { type: Array, required: true },
  sizes: { type: Object, required: true },
});

const xAxis = ref(null);

const yAxis = ref(null);

const xScale = scalePoint()
  .domain(props.xDomain)
  .range([0, props.sizes.innerWidth])
  .padding(0.5)
  .round(true);

watchEffect(
  () => {
    select(xAxis.value)
      .call(axisBottom(xScale))
      .selectAll('.tick text')
      .attr('transform', 'translate(-12, 8) rotate(-60) ')
      .style('text-anchor', 'end')
      .style('font-size', '12px');
  },
  {
    flush: 'post',
  }
);

const yScale = scaleLinear()
  .domain(props.yDomain)
  .range([props.sizes.innerHeight, 0])
  .nice();

watchEffect(
  () => {
    select(yAxis.value)
      .call(axisLeft(yScale))
      .selectAll('.tick text')
      .style('font-size', '12px');
  },
  {
    flush: 'post',
  }
);

/* export default {
  name: 'CellLinesChart',
  props: {
    xAxisLabel: { type: String, default: 'x axis' },
    xDomain: { type: Array, required: true },
    yAxisLabel: { type: String, default: 'y axis' },
    yDomain: { type: Array, required: true },
    sizes: { type: Object, required: true },
  },
  setup(props) {
    const xAxis = ref(null);

    const yAxis = ref(null);

    const xScale = scalePoint()
      .domain(props.xDomain)
      .range([0, props.sizes.innerWidth])
      .padding(0.5)
      .round(true);

    watchEffect(
      () => {
        select(xAxis.value)
          .call(axisBottom(xScale))
          .selectAll('.tick text')
          .attr('transform', 'translate(-12, 8) rotate(-60) ')
          .style('text-anchor', 'end')
          .style('font-size', '12px');
      },
      {
        flush: 'post',
      }
    );

    const yScale = scaleLinear()
      .domain(props.yDomain)
      .range([props.sizes.innerHeight, 0])
      .nice();

    watchEffect(
      () => {
        select(yAxis.value)
          .call(axisLeft(yScale))
          .selectAll('.tick text')
          .style('font-size', '12px');
      },
      {
        flush: 'post',
      }
    );

    return {
      xAxis,
      yAxis,
      xScale,
      yScale,
    };
  },
}; */
</script>

<style lang="postcss" scoped></style>
