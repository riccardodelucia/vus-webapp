<template>
  <AppLayout>
    <div class="ht-card ht-container app-content ht-layout-stack">
      <h2>Essentiality Profile</h2>
      <router-link
        class="ht-button back-link"
        data-type="secondary"
        :to="{ name: 'variants', params: { geneId } }"
      >
        <span class="back-link">
          <vue-feather type="arrow-left"></vue-feather>
          Variants
        </span>
      </router-link>
      <ht-tab :tab-list="tabList">
        <template #essentiality>
          <div class="chart">
            <div class="details">
              <ul>
                <li><b>Gene:</b> {{ geneId }}</li>
                <li><b>Cancer Type:</b> {{ tissueName }}</li>
                <li><b>Rank Ratio:</b> {{ Number(rankRatio.toFixed(2)) }}</li>
                <li v-if="variantId"><b>Variant:</b> {{ variantId }}</li>
                <li v-else><b>All variants</b></li>
              </ul>
              <ht-swatches
                title="Mutation Status"
                :color="mutationColor"
              ></ht-swatches>
            </div>
            <svg
              class="ht-chart"
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
                    :fill="datum.mutation ? 'red' : 'black'"
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
          </div>
        </template>
      </ht-tab>
    </div>
  </AppLayout>
</template>

<script>
import AppLayout from '@/layouts/AppLayout.vue';

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
  components: { AppLayout },
  props: {
    data: { type: Array, required: true },
    geneId: { type: String, required: true },
    tissueName: {
      type: String,
      required: true,
    },
    variantId: {
      type: String,
      required: true,
    },
    rankRatio: {
      type: Number,
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

    const tabList = [{ panel: 'essentiality', label: 'Essentiality' }];

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
      tabList,
    };
  },
};
</script>

<style lang="scss" scoped>
.chart {
  padding-block: var(--size-4);
  padding-inline: var(--size-4);
  display: grid;
  grid-template-areas: 'details chart';
  grid-template-columns: 1fr auto;
  gap: var(--size-4);
  align-items: start;
}

svg {
  grid-area: chart;
}

.details {
  grid-area: details;
}

.title {
  font-size: var(--font-size-4);
  font-weight: var(--font-weight-5);
  //color: inherit;
}
</style>
