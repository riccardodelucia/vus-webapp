<template>
  <ht-layout-app sidenav-title="VUS Portal" :sidenav-links="sidenavLinks">
    <template #header>
      <ul class="header-controls">
        <li>
          <ht-theme-switcher></ht-theme-switcher>
        </li>
      </ul>
    </template>
    <slot></slot>
  </ht-layout-app>
</template>

<script setup>
const sidenavLinks = [
  { label: 'Home', icon: 'home', to: '/' },
  { label: 'App', icon: 'bar-chart-2', to: '/app' },
];
</script>

<style lang="postcss" scoped>
.header-controls {
  margin-left: auto;
  list-style: none;
  padding: 0;
  display: flex;
  gap: var(--size-3);
}
</style>
