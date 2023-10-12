<template>
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
</template>

<script>
export default {
  name: 'MutationStatusLegend',
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
