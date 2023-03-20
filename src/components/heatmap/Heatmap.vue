<template>
  <div :style="{ height: sizes.height }">
    <svg
      preserveAspectRatio="xMinYMin meet"
      :viewBox="[0, 0, width, sizes.height].join(' ')"
      :width="width"
      :height="sizes.height"
    >
      <g :transform="`translate(${sizes.margins.left}, ${sizes.margins.top})`">
        <g>
          <g ref="axisAnnotations"></g>
          <rect
            v-for="(datum, idx) in heatmap.annotations"
            :key="idx"
            :x="xScaleAnnotations(datum.annotationType)"
            :y="yScale(datum.mutation)"
            :width="xScaleAnnotations.bandwidth()"
            :height="yScale.bandwidth()"
            :fill="annotationsColor(datum)"
          ></rect>
        </g>
        <g
          :transform="`translate(${
            sizes.annotationsHeatmapWidth + sizes.heatmapsGap
          }, 0)`"
        >
          <g ref="axisTissues"></g>
          <g :transform="`translate(${sizes.patientsHeatmapWidth}, 0)`">
            <g ref="axisMutations"></g>
          </g>
          <g>
            <rect
              v-for="(datum, idx) in heatmap.patients"
              :key="idx"
              :x="xScaleTissues(datum.x)"
              :y="yScale(datum.y)"
              :width="xScaleTissues.bandwidth()"
              :height="yScale.bandwidth()"
              :fill="patientsHeatmapColor(datum.value)"
              class="heatmap-patients"
              @mouseover="onMouseover($event, datum)"
              @mouseleave="onMouseleave($event, datum)"
              @click="onClick(datum)"
            ></rect>
          </g>
        </g>
      </g>
    </svg>
  </div>
</template>

<script>
import { axisTop, axisRight, select } from "d3";
import { ref, computed } from "vue";
import { makeReactiveAxis } from "@computational-biology-web-unit/ht-vue";

import { useRouter } from "vue-router";

export default {
  name: "Heatmap",
  props: {
    sizes: {
      type: Object,
      required: true,
    },
    heatmap: {
      type: Object,
      required: true,
    },
    yScale: {
      type: Function,
      required: true,
    },
    xScaleTissues: {
      type: Function,
      required: true,
    },
    xScaleAnnotations: {
      type: Function,
      required: true,
    },
    patientsHeatmapColor: {
      type: Function,
      required: true,
    },
    annotationsColor: {
      type: Function,
      required: true,
    },
  },
  setup(props) {
    const axisTissues = ref(null);
    const axisAnnotations = ref(null);
    const axisMutations = ref(null);

    const width = computed(
      () =>
        props.sizes.margins.left +
        props.sizes.annotationsHeatmapWidth +
        props.sizes.heatmapsGap +
        props.sizes.patientsHeatmapWidth +
        props.sizes.margins.right
    );

    const router = useRouter();

    makeReactiveAxis(() => {
      select(axisAnnotations.value)
        .call(axisTop(props.xScaleAnnotations).tickSize(0))
        .selectAll(".tick text")
        .attr("transform", "translate(2,0) rotate(-30) ")
        .style("text-anchor", "start");
      select(axisAnnotations.value).select(".domain").remove();
    });

    makeReactiveAxis(() => {
      select(axisTissues.value)
        .call(axisTop(props.xScaleTissues).tickSize(0))
        .selectAll(".tick text")
        .attr("transform", "translate(2,0) rotate(-30) ")
        .style("text-anchor", "start");
      select(axisTissues.value).select(".domain").remove();
    });

    makeReactiveAxis(() => {
      select(axisMutations.value).call(axisRight(props.yScale).tickSize(0));
      select(axisMutations.value).select(".domain").remove();
    });

    const onMouseover = function (e, datum) {
      datum.value !== 0 && select(e.target).attr("fill", "blue");
    };
    const onMouseleave = function (e, datum) {
      select(e.target).attr("fill", props.patientsHeatmapColor(datum.value));
    };

    const onClick = function (datum) {
      router.push({
        name: "essentiality",
        query: { cancerType: datum.x, variant: datum.y },
      });
    };

    return {
      width,
      axisAnnotations,
      axisMutations,
      axisTissues,
      onMouseover,
      onMouseleave,
      onClick,
    };
  },
};
</script>

<style lang="scss" scoped="true">
.heatmap-patients {
  cursor: pointer;
}
</style>
