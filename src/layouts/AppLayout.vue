<template>
  <ht-app-layout :show-user="false" :sidenav-object="sidenavObject">
    <slot></slot>
  </ht-app-layout>
</template>

<script>
export default {
  name: 'AppLayout',

  setup() {
    const sidenavObject = {
      title: 'VUS',
      links: [{ id: 1, url: '/', label: 'Home', type: 'home' }],
    };

    return {
      sidenavObject,
    };
  },
};
</script>

<style lang="scss">
.app-content {
  margin: var(--size-4);
  max-width: 100%;
  width: fit-content;
  overflow: scroll;
}

.charts-container {
  background-color: var(--surface-2-light);
  color: var(--text-1-light);
  padding: var(--size-2);

  * {
    color: inherit;
  }
}

.flex {
  display: flex;
  gap: var(--space-md);
}

.details {
  padding: var(--size-2);

  & > *:not(:last-child) {
    margin-bottom: var(--size-3);
  }
}
</style>
