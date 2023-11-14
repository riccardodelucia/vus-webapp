<template>
  <div class="ht-layout-stack">
    <div>
      <ul class="ht-reset">
        <li><b>Cancer Type:</b> {{ details.tissueName }}</li>
        <li><b>Rank Ratio:</b> {{ rankRatio }}</li>
        <li v-if="details.variantId">
          <b>Variant:</b> {{ details.variantId }} (is DAM: {{ details.dam }})
        </li>
        <li v-else><b>All DAMs</b></li>
      </ul>
      <slot></slot>
    </div>
    <div>
      <p class="legend-title">
        {{ details.variantId ? 'Variant' : 'Variants' }}
      </p>
      <ul class="ht-reset">
        <li>
          <span class="mutation-symbol mutation-symbol-present"></span>
          <span>Present</span>
        </li>
        <li>
          <span class="mutation-symbol mutation-symbol-absent"></span>
          <span>Absent</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue';

export default {
  name: 'CellLinesEssentialityDetails',
  props: {
    details: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const rankRatio = computed(() => {
      const value = Number(props.details.rankRatio.toFixed(2));
      if (value === 0) return 'Undefined';
      return value;
    });
    return { rankRatio };
  },
};
</script>
