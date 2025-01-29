<template>
  <ht-layout-webpage>
    <template #header>
      <div class="header-content">
        <nav class="header-nav">
          <a
            href="https://humantechnopole.it/en/research-groups/iorio-group/"
            target="_blank"
          >
            <img :src="logo" alt="Iorio logo" class="iorio-logo" />
          </a>
        </nav>
        <ul class="header-controls-list">
          <li><ht-theme-switcher></ht-theme-switcher></li>
        </ul>
      </div>
    </template>
    <slot></slot>
    <template #footer>
      <div class="footer-content">
        <h2>VUS Portal</h2>
      </div>
    </template>
  </ht-layout-webpage>
</template>

<script setup>
import logo from '@/assets/logos/iorio-logo-white.svg';
</script>

<style lang="postcss" scoped>
.footer-content {
  text-align: center;
  margin-bottom: var(--size-4);

  h2 {
    font-size: var(--font-size-6);
  }
}

.footer-link {
  text-decoration: none;
  color: white;

  &:hover {
    text-decoration: underline;
  }
}

.iorio-logo {
  height: 3rem;
}

.header-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--size-3);
  padding-block: var(--size-3);

  @media (min-width: 50em) {
    flex-direction: row;
    margin-left: var(--size-4);

    .header-nav {
      margin-right: auto;
    }
  }
}
.header-controls-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  gap: var(--size-3);
}
</style>
