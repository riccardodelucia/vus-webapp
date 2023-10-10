<template>
  <AppLayout>
    <div class="ht-card ht-container app-content ht-layout-stack">
      <h2>{{ title }}</h2>

      <div class="content">
        <div class="details ht-layout-stack">
          <slot name="details"></slot>
        </div>

        <slot name="chart"></slot>
      </div>
    </div>
  </AppLayout>
</template>

<script>
import AppLayout from '@/layouts/AppLayout.vue';

export default {
  name: 'CellLinesViewLayout',
  components: { AppLayout },
  props: {
    title: { type: String, default: '' },
  },
  setup() {
    return {};
  },
};
</script>

<style lang="postcss" scoped>
.content {
  display: grid;
  grid-template-areas: 'details chart';
  grid-template-columns: 1fr auto;
  gap: var(--size-4);
  align-items: start;
}

.chart {
  grid-area: chart;
}

.details {
  grid-area: details;
}

.title {
  font-size: var(--font-size-4);
  font-weight: var(--font-weight-5);
}
</style>
