<template>
  <div class="ht-layout-stack">
    <div>
      <p class="legend-title">Details</p>
      <ul class="ht-reset">
        <li><b>Gene:</b> {{ details.geneId.toUpperCase() }}</li>
        <li><b>Cancer Type:</b> {{ details.tissueName }}</li>
        <li><b>Rank Ratio:</b> {{ Number(details.rankRatio.toFixed(2)) }}</li>
        <slot name="ul"></slot>
      </ul>
      <slot></slot>
    </div>
    <div>
      <p class="legend-title">Mutation Status</p>
      <ul class="ht-reset">
        <li>
          <span class="mutation-symbol" style="background-color: red"></span>
          <span>Mutated</span>
        </li>
        <li>
          <span class="mutation-symbol" style="background-color: blue"></span>
          <span>Not Mutated</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CellLinesDetailsLayout',
  props: {
    details: {
      type: Object,
      required: true,
    },
  },
};
</script>

<style lang="postcss" scoped>
.mutation-symbol {
  margin-right: var(--size-2);
  border-radius: var(--radius-round);
  display: inline-block;
  width: 0.5rem;
  aspect-ratio: 1;
}
</style>
