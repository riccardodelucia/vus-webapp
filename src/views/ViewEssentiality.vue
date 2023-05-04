<template>
  <AppLayout>
    <div class="container card essentiality-chart">
      <svg
        preserveAspectRatio="xMinYMin meet"
        :viewBox="[0, 0, width, height].join(' ')"
        :width="width"
        :height="height"
      >
        <g :transform="`translate(${margins.left}, ${margins.top})`">
          <g ref="axisLogFC"></g>
          <text :x="4" :y="4" style="font-weight: bold">
            logFC(essentiality)
          </text>
          <g>
            <line
              :x1="0"
              :y1="yScale(-0.5)"
              :x2="innerWidth"
              :y2="yScale(-0.5)"
              stroke="black"
              stroke-width="2"
              stroke-dasharray="4 4"
              stroke-opacity="0.5"
            />

            <circle
              v-for="(datum, idx) in data"
              :key="idx"
              :cx="xScale(datum.cellLineName)"
              :cy="yScale(datum.essentialityValue)"
              r="5"
              :fill="datum.presence ? 'red' : 'black'"
            />
          </g>
          <g :transform="`translate(0, ${innerHeight})`">
            <g ref="axisCellLines"></g>
            <text :x="innerWidth / 2" :y="-4" style="font-weight: bold">
              Cell Lines
            </text>
          </g>
        </g>
      </svg>
      <div class="details">
        <h4>Details</h4>
        <ul>
          <li><b>Cancer Type:</b> {{ query.tissueName }}</li>
          <li><b>Variant:</b> {{ query.variantId }}</li>
        </ul>
        <HTSwatches title="Mutation Status" :color="mutationColor"></HTSwatches>
        <button
          class="btn btn--secondary btn--sm btn--full-width margin-top"
          @click="onClick"
        >
          <vue-feather type="arrow-left"></vue-feather>
          Back to Gene Heatmap
        </button>
      </div>
    </div>
  </AppLayout>
</template>

<script>
import AppLayout from '@/layouts/AppLayout.vue';
import HTSwatches from '@/components/HTSwatches.vue';

import { useRouter } from 'vue-router';

import { ref } from 'vue';

import {
  select,
  axisBottom,
  axisLeft,
  scalePoint,
  scaleLinear,
  scaleOrdinal,
  extent,
} from 'd3';

import {
  getInnerChartSizes,
  makeReactiveAxis,
} from '@computational-biology-sw-web-dev-unit/ht-vue';
export default {
  components: { AppLayout, HTSwatches },
  props: {
    data: { type: Array, required: true },
    query: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const axisCellLines = ref(null);

    const axisLogFC = ref(null);

    const router = useRouter();

    const width = 1000;
    const height = 700;

    const margins = {
      top: 10,
      bottom: 100,
      left: 60,
      right: 0,
    };

    const { innerWidth, innerHeight } = getInnerChartSizes(
      width,
      height,
      margins
    );

    function onClick() {
      router.go(-1);
    }

    const xDomain = props.data.map(({ cellLineName }) => cellLineName);

    const xScale = scalePoint()
      .domain(xDomain)
      .range([0, innerWidth])
      .padding(0.5)
      .round(true);

    makeReactiveAxis(() => {
      select(axisCellLines.value)
        .call(axisBottom(xScale))
        .selectAll('.tick text')
        .attr('transform', 'translate(-12, 8) rotate(-60) ')
        .style('text-anchor', 'end');
    });

    const yDomain = extent(
      props.data.map(({ essentialityValue }) => essentialityValue)
    );

    const yScale = scaleLinear().domain(yDomain).range([innerHeight, 0]).nice();

    makeReactiveAxis(() => {
      select(axisLogFC.value).call(axisLeft(yScale));
    });

    const mutationColor = scaleOrdinal()
      .domain(['Mutated', 'Not mutated'])
      .range(['red', 'black']);

    return {
      onClick,
      width,
      height,
      margins,
      innerWidth,
      innerHeight,
      axisCellLines,
      axisLogFC,
      xScale,
      yScale,
      mutationColor,
    };
  },
};
</script>

<style lang="scss" scoped>
.essentiality-chart {
  display: flex;
  gap: var(--space-md);
}
.details {
  border: 1px solid var(--color-blue-darker);
  padding: var(--space-sm);
}
</style>
