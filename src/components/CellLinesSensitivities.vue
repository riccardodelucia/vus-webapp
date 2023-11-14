<template>
  <CellLinesChart
    v-slot="slotProps"
    :sizes="sizes"
    x-axis-label="Cell Lines"
    :x-domain="xDomain"
    :y-domain="yDomain"
    y-axis-label="log(IC50)"
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
        v-for="(datum, idx) in sensitivities"
        :key="idx"
        :cx="slotProps.xScale(datum.cellLineName)"
        :cy="slotProps.yScale(datum.ic50)"
        r="5"
        :fill="datum.mutation ? 'red' : 'blue'"
        @mouseover="onMouseOver($event, datum)"
        @mouseleave="onMouseLeave"
      />
    </g>
  </CellLinesChart>
</template>

<script>
import CellLinesChart from '@/components/CellLinesChart.vue';
import { ref, watchEffect } from 'vue';

import { extent } from 'd3';

import { useTooltip } from '@computational-biology-sw-web-dev-unit/ht-vue';

export default {
  name: 'CellLinesSensitivities',
  components: { CellLinesChart },
  props: {
    sizes: { type: Object, required: true },
    sensitivities: { type: Array, required: true },
  },
  setup(props) {
    const xDomain = ref(null);
    const yDomain = ref(null);

    watchEffect(async () => {
      xDomain.value = props.sensitivities.map(
        ({ cellLineName }) => cellLineName
      );
      yDomain.value = extent(props.sensitivities.map(({ ic50 }) => ic50));
    });

    const { showTooltip, hideTooltip } = useTooltip();

    const onMouseOver = function (event, { mutation }) {
      if (mutation) showTooltip(event, mutation);
    };

    const onMouseLeave = function () {
      hideTooltip();
    };

    return {
      onMouseOver,
      onMouseLeave,
      xDomain,
      yDomain,
    };
  },
};
</script>
