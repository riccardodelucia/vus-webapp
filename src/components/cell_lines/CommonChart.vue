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
      <text :x="4" :y="4" style="font-weight: bold">{{ yAxisLabel }}</text>
      <slot :x-scale="xScale" :y-scale="yScale"></slot>
      <g :transform="`translate(0, ${sizes.innerHeight})`">
        <g ref="xAxis"></g>
        <text :x="sizes.innerWidth / 2" :y="-4" style="font-weight: bold">
          {{ xAxisLabel }}
        </text>
      </g>
    </g>
  </svg>
</template>

<script>
import { ref } from 'vue';

import { select, axisBottom, axisLeft, scalePoint, scaleLinear } from 'd3';

import { makeReactiveAxis } from '@computational-biology-sw-web-dev-unit/ht-vue';
export default {
  name: 'CommonChart',
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

    makeReactiveAxis(() => {
      select(xAxis.value)
        .call(axisBottom(xScale))
        .selectAll('.tick text')
        .attr('transform', 'translate(-12, 8) rotate(-60) ')
        .style('text-anchor', 'end')
        .style('font-size', '15px');
    });

    const yScale = scaleLinear()
      .domain(props.yDomain)
      .range([props.sizes.innerHeight, 0])
      .nice();

    makeReactiveAxis(() => {
      select(yAxis.value)
        .call(axisLeft(yScale))
        .selectAll('.tick text')
        .style('font-size', '15px');
    });

    return {
      xAxis,
      yAxis,
      xScale,
      yScale,
    };
  },
};
</script>

<style lang="postcss" scoped></style>
