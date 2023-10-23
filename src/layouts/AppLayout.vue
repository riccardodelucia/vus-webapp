<template>
  <ht-layout-app :sidenav-object="sidenavObject">
    <template #header>
      <ht-theme-switcher></ht-theme-switcher>
    </template>
    <div class="app-content ht-container ht-card">
      <slot></slot>
    </div>
  </ht-layout-app>
</template>

<script>
export default {
  name: 'AppLayout',

  setup() {
    const sidenavObject = {
      title: 'VUS',
      links: [
        { id: 1, url: '/', label: 'Home', type: 'home' },
        { id: 2, url: '/app', label: 'App', type: 'bar-chart-2' },
      ],
    };

    return {
      sidenavObject,
    };
  },
};
</script>

<style lang="postcss">
.legend-title {
  font-size: var(--font-size-3);
}

.legend li > * {
  margin-right: var(--size-3);
}

.legend-symbol {
  display: inline-block;
  width: 0.8rem;
  aspect-ratio: 1;
}

.round-symbol {
  border-radius: var(--radius-round);
}

.app-content {
  margin: var(--size-4) var(--size-5);
}

.grid {
  display: grid;
  grid-template-columns: max-content 1fr;
  gap: var(--size-4);
  margin-top: var(--size-4);
}

.details {
  grid-column: 1/2;
}
.chart {
  grid-column: 2/3;
}
</style>
