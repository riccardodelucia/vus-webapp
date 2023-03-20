<template>
  <g>
    <rect
      v-for="(datum, idx) in heatmap"
      :key="idx"
      :x="xScale(datum.x)"
      :y="yScale(datum.y)"
      :width="xScale.bandwidth()"
      :height="yScale.bandwidth()"
      :fill="color(datum.value)"
    ></rect>
  </g>
</template>

<script>
export default {
  name: "Marks",
  props: {
    heatmap: {
      type: Array,
      required: true,
    },
    xScale: {
      type: Function,
      required: true,
    },
    yScale: {
      type: Function,
      required: true,
    },
    color: {
      type: Function,
      required: true,
    },
  },
};
</script>

<style lang="scss" scoped></style>
