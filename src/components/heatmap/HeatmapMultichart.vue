<template>
  <div class="charts-container margin-top">
    <div class="legends">
      <div>
        <Swatches title="PolyPhen" :color="polyPhenColor"></Swatches>
        <Swatches title="SIFT" :color="siftColor"></Swatches>
      </div>
      <HTLegendColor
        :margins="legendChart.margins"
        :width="legendChart.width"
        :height="legendChart.height"
        :color="patientsHeatmapColor"
        title="log(#patients)"
      ></HTLegendColor>
    </div>
    <Heatmap
      :sizes="heatmapChart"
      :heatmap="heatmap"
      :yScale="yScale"
      :xScaleTissues="xScaleTissues"
      :xScaleAnnotations="xScaleAnnotations"
      :patientsHeatmapColor="patientsHeatmapColor"
      :annotationsColor="annotationsColor"
    ></Heatmap>
  </div>
</template>

<script>
import Heatmap from "@/components/heatmap/Heatmap.vue";

import HTLegendColor from "@/components/heatmap/HTLegendColor.vue";
import Swatches from "@/components/Swatches.vue";

import {
  scaleSequentialLog,
  scaleOrdinal,
  scaleBand,
  extent,
  interpolateReds,
  interpolateRgb,
  quantize,
  color,
} from "d3";

import { computed, inject } from "vue";

export default {
  name: "HeatmapMultichart",
  components: { Heatmap, HTLegendColor, Swatches },
  setup() {
    const GStore = inject("GStore");

    const data = computed(() => GStore.geneData);

    const mutations = computed(() =>
      Array.from(new Set(data.value.patients.map(({ mutation }) => mutation)))
    );

    const legendChart = {
      width: 105,
      height: 380,
      margins: {
        left: 0,
        right: 80,
        top: 30,
        bottom: 10,
      },
    };

    //////////////////////////
    // HEATMAP SIZES
    const patientsHeatmapWidth = 900;
    const annotationsHeatmapWidth = 50;
    const heatmapChart = computed(() => ({
      patientsHeatmapWidth,
      annotationsHeatmapWidth,
      heatmapsGap: 10,
      height: 40 * mutations.value.length,
      margins: { left: 0, right: 180, top: 150, bottom: 0 },
    }));

    const padding = 0.05;

    //////////////////////////
    // HEATMAP SPATIAL SCALES

    const innerHeight = computed(
      () =>
        heatmapChart.value.height -
        heatmapChart.value.margins.top -
        heatmapChart.value.margins.bottom
    );

    const yScale = computed(() => {
      return scaleBand()
        .range([0, innerHeight.value])
        .domain(mutations.value)
        .padding(padding);
    });

    const xScaleTissues = computed(() => {
      return scaleBand()
        .range([0, patientsHeatmapWidth])
        .domain(
          Array.from(new Set(data.value.patients.map(({ tissue }) => tissue)))
        )
        .padding(padding);
    });

    const xScaleAnnotations = computed(() => {
      return scaleBand()
        .range([0, annotationsHeatmapWidth])
        .domain(
          Array.from(
            new Set(
              data.value.annotations.map(({ annotationType }) => annotationType)
            )
          )
        )
        .padding(padding);
    });

    //////////////////////////
    // HEATMAP COLOR SCALES

    const interpolator = (t) => {
      if (t === -Infinity) {
        return color("#eee");
      } else {
        return interpolateReds(t);
      }
    };

    const patientsHeatmapColor = computed(() => {
      return scaleSequentialLog(interpolator).domain(
        extent(data.value.patients.map(({ value }) => value + 1))
      );
    });

    const polyPhenColor = scaleOrdinal()
      .domain(["Probably Damaging", "Possibly Damaging", "Benign"])
      .range(quantize(interpolateRgb("red", "aqua"), 3));

    const siftColor = scaleOrdinal()
      .domain([
        "Deleterious",
        "Deleterious (low confidence)",
        "Tolerated",
        "Tolerated (low confidence)",
      ])
      .range(quantize(interpolateRgb("red", "aqua"), 4));

    const annotationsColor = function (datum) {
      if (datum.annotationType === "SIFT") return siftColor(datum.value);
      return polyPhenColor(datum.value);
    };

    //////////////////////////
    // HEATMAP DATA
    const heatmap = computed(() => {
      return {
        annotations: data.value.annotations.map(
          ({ annotationType, mutation, value }) => ({
            annotationType,
            mutation,
            value,
          })
        ),
        patients: data.value.patients.map(({ tissue, mutation, value }) => ({
          x: tissue,
          y: mutation,
          value,
        })),
      };
    });

    return {
      legendChart,
      siftColor,
      polyPhenColor,
      heatmapChart,
      yScale,
      xScaleTissues,
      xScaleAnnotations,
      patientsHeatmapColor,
      annotationsColor,
      heatmap,
    };
  },
};
</script>

<style lang="scss" scoped>
.legends {
  display: flex;
  gap: var(--space-md);
}
.charts-container {
  display: flex;
  gap: var(--space-md);
}
</style>
