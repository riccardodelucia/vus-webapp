<template>
  <div class="ht-layout-stack">
    <div>
      <ul class="ht-reset">
        <li><b>Cancer Type:</b> {{ details.tissueName }}</li>
        <li><b>Rank Ratio:</b> {{ Number(details.rankRatio.toFixed(2)) }}</li>
        <li v-if="details.variantId">
          <b>Variant:</b> {{ details.variantId }} (is DAM: {{ details.dam }})
        </li>
        <li v-else><b>All variants</b></li>
      </ul>
      <slot></slot>
    </div>
    <div>
      <p class="legend-title">Variant</p>
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
export default {
  name: 'CellLinesByVariantDetails',
  props: {
    details: {
      type: Object,
      required: true,
    },
  },
  setup() {
    return {};
  },
};
</script>
