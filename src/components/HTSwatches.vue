<template>
  <div class="htd-swatches">
    <p class="htd-swatches__title">{{ title }}</p>
    <ul class="htd-swatches__list">
      <li
        v-for="label in color.domain()"
        :key="label"
        class="htd-swatches__listitem"
      >
        <div
          class="htd-swatches__color"
          :class="{ 'htd-swatches__color--round': shape === 'round' }"
          :style="{ backgroundColor: color(label) }"
        ></div>
        <span>{{ label }}</span>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'HTSwatches',
  props: {
    title: {
      type: String,
      default: '',
    },
    color: {
      type: Function,
      required: true,
    },
    shape: {
      type: String,
      default: 'square',
    },
  },
  setup() {
    return;
  },
};
</script>

<style lang="scss" scoped>
.htd-swatches {
  padding: var(--size-2);

  &__title {
    font-size: var(--font-size-2);
    font-weight: var(--font-weight-5);
  }

  &__list {
    list-style: none;
  }

  &__listitem {
    display: flex;
    align-items: center;
    gap: var(--size-2);
  }

  &__color {
    width: 1rem;
    height: 1rem;

    &--round {
      border-radius: 100%;
    }
  }
}
</style>
