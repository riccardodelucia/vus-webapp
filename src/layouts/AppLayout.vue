<template>
  <ht-layout-app :sidenav-object="sidenavObject">
    <template #header>
      <ht-theme-switcher></ht-theme-switcher>
    </template>
    <div class="ht-container">
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
        { id: 2, url: '/search', label: 'Search', type: 'search' },
      ],
    };

    return {
      sidenavObject,
    };
  },
};
</script>

<style lang="postcss">
.app-content {
  width: max-content;
  overflow-x: scroll;
  box-shadow: var(--shadow-3);
}

.back-link {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--size-2);
}
</style>
