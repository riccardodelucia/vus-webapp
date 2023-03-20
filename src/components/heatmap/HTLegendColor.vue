<template>
  <svg
    :viewBox="[0, 0, width, height].join(' ')"
    :width="width"
    :height="height"
  >
    <g :transform="`translate(${margins.left}, ${margins.top})`">
      <text class="legend__title" x="0" :y="-6" fill="currentColor">
        {{ title }}
      </text>
      <g ref="legend"></g>
      <g ref="axis"></g>
    </g>
  </svg>
</template>

<script>
import { renderLegend, makeAxis, renderAxis } from "./colorLegend.js";
import { ref, watchEffect } from "vue";

export default {
  name: "HTLegendColor",
  props: {
    color: { type: Function, required: true },
    title: { type: String, default: "" },
    margins: {
      type: Object,
      default: () => ({
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
      }),
    },
    width: {
      type: Number,
      required: true,
    },
    height: {
      type: Number,
      required: true,
    },
    nTicks: {
      type: Number,
      default: 10,
    },
    tickFormat: {
      type: String,
      default: undefined,
    },
    invert: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const innerWidth = props.width - props.margins.left - props.margins.right;
    const innerHeight = props.height - props.margins.top - props.margins.bottom;

    const legend = ref(null);
    const axis = ref(null);

    const orientation = props.width >= props.height ? "horizontal" : "vertical";

    watchEffect(() => {
      const axisData = makeAxis({
        color: props.color,
        orientation,
        width: innerWidth,
        height: innerHeight,
        nTicks: props.nTicks,
        tickFormat: props.tickFormat,
        invert: props.invert,
      });

      renderLegend({
        color: props.color,
        legendNode: legend.value,
        orientation,
        width: innerWidth,
        height: innerHeight,
        invert: props.invert,
      });

      renderAxis({
        axisNode: axis.value,
        orientation,
        width: innerWidth,
        height: innerHeight,
        ...axisData,
      });
    });

    return {
      legend,
      axis,
    };
  },
};
</script>

<style>
.legend__title {
  font-size: 15px;
  font-weight: bold;
}
</style>
