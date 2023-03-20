<template>
  <div>
    <h5>{{ title }}</h5>
    <div class="swatch" v-for="label in color.domain()" :key="label">
      <div
        class="swatch__color"
        :style="{ backgroundColor: color(label) }"
      ></div>
      <span class="text--sm">{{ label }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: "Swatches",
  props: {
    title: {
      type: String,
      default: "",
    },
    color: {
      type: Function,
      required: true,
    },
  },
  setup() {
    return {};
  },
};
</script>

<style lang="scss" scoped>
.swatch {
  display: flex;
  gap: var(--space-xs);
  align-items: center;

  &__color {
    width: 1rem;
    height: 1rem;
  }
}
</style>
