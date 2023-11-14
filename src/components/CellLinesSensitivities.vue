<template>
  <div v-if="state === 'loading'" class="center-grid">Loading...</div>
  <div v-else-if="state === 'error'" class="center-grid">
    Error: unable to retrieve data
  </div>
  <CommonChart
    v-else-if="state === 'ready'"
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
  </CommonChart>
</template>

<script>
import CommonChart from '@/components/cell_lines/CommonChart.vue';
import { ref, watchEffect } from 'vue';
import service from '@/services';

import { sendErrorNotification } from '@/notifications.js';

import { extent } from 'd3';

import { useTooltip } from '@computational-biology-sw-web-dev-unit/ht-vue';

export default {
  name: 'CellLinesSensitivities',
  components: { CommonChart },
  props: {
    sizes: { type: Object, required: true },
    drug: { type: Object, required: true },
    geneId: { type: String, required: true },
    tissueName: { type: String, required: true },
  },
  emits: ['rank-ratio'],
  setup(props, { emit }) {
    const sensitivities = ref(null);

    const state = ref('');

    const xDomain = ref(null);
    const yDomain = ref(null);

    const cssWidth = `${props.sizes.width}px`;
    const cssHeight = `${props.sizes.height}px`;

    watchEffect(async () => {
      state.value = 'loading';
      try {
        const { data } = await service.getDrugsSensitivities({
          ...props.drug,
          drugId: props.geneId,
          tissueName: props.tissueName,
        });
        sensitivities.value = data.sensitivities;
        xDomain.value = data.sensitivities.map(
          ({ cellLineName }) => cellLineName
        );
        yDomain.value = extent(data.sensitivities.map(({ ic50 }) => ic50));

        emit('rank-ratio', data.rankRatio);

        state.value = 'ready';
      } catch (err) {
        state.value = 'error';
        sendErrorNotification(err);
      }
    });

    const { showTooltip, hideTooltip } = useTooltip();

    const onMouseOver = function (event, { mutation }) {
      if (mutation) showTooltip(event, mutation);
    };

    const onMouseLeave = function () {
      hideTooltip();
    };

    return {
      sensitivities,
      cssWidth,
      cssHeight,
      state,
      onMouseOver,
      onMouseLeave,
      xDomain,
      yDomain,
    };
  },
};
</script>

<style lang="scss" scoped>
.center-grid {
  display: grid;
  place-items: center;
  width: v-bind('cssWidth');
  height: v-bind('cssHeight');
}
</style>
