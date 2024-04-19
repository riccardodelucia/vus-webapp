<template>
  <CellLinesChart
    v-slot="slotProps"
    :sizes="sizes"
    x-axis-label="Cell Lines"
    :x-domain="xDomain"
    :y-domain="yDomain"
    y-axis-label="Drug ln(IC50)"
  >
    <g>
      <rect
        :x="0"
        :y="slotProps.yScale(concMax)"
        :width="sizes.innerWidth"
        :height="slotProps.yScale(concMin) - slotProps.yScale(concMax)"
        opacity="0.05"
      />
      <circle
        v-for="(datum, idx) in sensitivities"
        :key="idx"
        :cx="slotProps.xScale(datum.cellLineName)"
        :cy="slotProps.yScale(datum.ic50)"
        r="5"
        :fill="datum.mutation ? 'red' : 'blue'"
        @mouseover="onMouseOver($event, datum)"
        @mouseleave="onMouseLeave(datum)"
      />
    </g>
  </CellLinesChart>
</template>

<script>
import CellLinesChart from '@/components/CellLinesChart.vue';
import { ref, watchEffect } from 'vue';

import { extent } from 'd3';

import { useTooltip } from '@nf-daha-iu3/ht-vue';

export default {
  name: 'CellLinesSensitivities',
  components: { CellLinesChart },
  props: {
    sizes: { type: Object, required: true },
    sensitivities: { type: Array, required: true },
    drugConcMin: { type: Number, required: true },
    drugConcMax: { type: Number, required: true },
  },
  setup(props) {
    const xDomain = ref(null);
    const yDomain = ref(null);
    const concMin = ref(null);
    const concMax = ref(null);

    watchEffect(async () => {
      xDomain.value = props.sensitivities.map(
        ({ cellLineName }) => cellLineName
      );

      concMin.value = Math.log(props.drugConcMin);
      concMax.value = Math.log(props.drugConcMax);
      yDomain.value = extent([
        concMin.value,
        concMax.value,
        ...props.sensitivities.map(({ ic50 }) => ic50),
      ]);
    });

    const { showTooltip, hideTooltip } = useTooltip();

    const onMouseOver = function (event, { mutation }) {
      if (mutation) showTooltip(event, mutation);
    };

    const onMouseLeave = function ({ mutation }) {
      if (mutation) hideTooltip();
    };

    return {
      onMouseOver,
      onMouseLeave,
      xDomain,
      yDomain,
      concMin,
      concMax,
    };
  },
};
</script>
