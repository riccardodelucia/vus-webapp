<template>
  <svg
    class="ht-chart"
    preserveAspectRatio="xMinYMin meet"
    :viewBox="[0, 0, width, height].join(' ')"
    :width="width"
    :height="height"
  >
    <g :transform="`translate(${margins.left}, ${margins.top})`">
      <g>
        <text
          :transform="`translate(${annotationWidth / 2},-4) rotate(-90)`"
          class="ht-chart-title bold"
        >
          sift
        </text>
        <rect
          v-for="(datum, idx) in annotations"
          :key="idx"
          :x="0"
          :y="yScale(datum.variantId)"
          :width="annotationWidth"
          :height="yScale.bandwidth()"
          :fill="siftColor(datum?.sift)"
        ></rect>
      </g>
      <g :transform="`translate(${annotationWidth + 1}, 0)`">
        <text
          :transform="`translate(${annotationWidth / 2},-4) rotate(-90)`"
          class="ht-chart-title bold"
        >
          polyphen
        </text>
        <rect
          v-for="(datum, idx) in annotations"
          :key="idx"
          :x="0"
          :y="yScale(datum.variantId)"
          :width="annotationWidth"
          :height="yScale.bandwidth()"
          :fill="polyphenColor(datum.polyphen)"
        ></rect>
      </g>
      <g :transform="`translate(${2 * annotationWidth + horizontalGap}, 0)`">
        <g ref="axisTissues"></g>
        <g :transform="`translate(${heatmapWidth}, 0)`">
          <g ref="axisVariants"></g>
        </g>
        <g>
          <g
            v-for="(datum, idx) in data"
            :key="idx"
            :transform="`translate(${xScaleTissues(
              datum.tissueName
            )},  ${yScale(datum.variantId)})`"
            class="heatmap-patients"
            @click="onClick(datum)"
          >
            <rect
              :x="0"
              :y="0"
              :width="xScaleTissues.bandwidth()"
              :height="yScale.bandwidth()"
              :fill="color(datum.nPatients)"
              pointer-events="none"
            ></rect>
            <circle
              v-if="datum.dam"
              :cx="xScaleTissues.bandwidth() / 2"
              :cy="yScale.bandwidth() / 2"
              r="5"
              stroke="dodgerblue"
              fill="dodgerblue"
              stroke-width="2px"
              pointer-events="none"
            />
          </g>
          <g
            v-if="variantId"
            :transform="`translate(0,  ${yScale(variantId)})`"
          >
            <rect
              class="variant-highlight"
              x="0"
              y="0"
              :width="heatmapWidth"
              :height="yScale.bandwidth()"
            ></rect>
          </g>
        </g>

        <g :transform="`translate(0, ${heatmapHeight + verticalGap})`">
          <g
            v-for="(datum, idx) in aggregatedData"
            :key="idx"
            class="heatmap-patients"
            :transform="`translate(${xScaleTissues(datum.tissueName)},  0)`"
            @click="onClickAggregated(datum)"
          >
            <rect
              :x="0"
              :y="0"
              :width="xScaleTissues.bandwidth()"
              :height="yScale.bandwidth()"
              :fill="color(datum.nPatients)"
              pointer-events="none"
            ></rect>
            <circle
              v-if="datum.dam > 0"
              :cx="xScaleTissues.bandwidth() / 2"
              :cy="yScale.bandwidth() / 2"
              r="5"
              fill="dodgerblue"
              pointer-events="none"
            />
          </g>

          <text
            :transform="`translate(${heatmapWidth + 2}, ${
              yScale.bandwidth() / 2 + 4
            })`"
            class="ht-chart-title bold"
          >
            Aggregated DAM
          </text>
        </g>
      </g>
    </g>
  </svg>
</template>

<script>
import { axisTop, axisRight, select, scaleBand } from 'd3';
import { ref, watchEffect } from 'vue';
import { makeReactiveAxis } from '@computational-biology-sw-web-dev-unit/ht-vue';

import { useRouter } from 'vue-router';

export default {
  name: 'VariantsHeatmap',
  props: {
    variantId: { type: String, default: '' },
    geneId: { type: String, required: true },
    color: {
      type: Function,
      required: true,
    },
    polyphenColor: {
      type: Function,
      required: true,
    },
    siftColor: {
      type: Function,
      required: true,
    },
    data: { type: Array, required: true },
    aggregatedData: { type: Array, required: true },
    annotations: { type: Array, required: true },
  },
  setup(props) {
    const padding = 0.05;

    const margins = { left: 0, right: 180, top: 140, bottom: 0 };

    const horizontalGap = 10;
    const verticalGap = 10;
    const heatmapTileHeight = 30;
    const heatmapWidth = 900;

    const variants = ref(null);
    const tissues = ref(null);
    const heatmapHeight = ref(0);
    const height = ref(0);
    const width = ref(0);

    const annotationWidth = ref(0);

    const axisTissues = ref(null);
    const axisVariants = ref(null);
    const yScale = ref(null);
    const xScaleTissues = ref(null);

    const router = useRouter();

    watchEffect(async () => {
      variants.value = Array.from(
        new Set(props.data.map(({ variantId }) => variantId))
      );
      tissues.value = Array.from(
        new Set(props.data.map(({ tissueName }) => tissueName))
      );

      heatmapHeight.value = heatmapTileHeight * variants.value.length;
      height.value =
        margins.top +
        heatmapHeight.value +
        margins.bottom +
        verticalGap +
        heatmapTileHeight;

      // Make Scales
      yScale.value = scaleBand()
        .range([0, heatmapHeight.value])
        .domain(variants.value)
        .padding(padding);

      xScaleTissues.value = scaleBand()
        .range([0, heatmapWidth])
        .domain(tissues.value)
        .padding(padding);

      // use same tile width on annotations
      annotationWidth.value = xScaleTissues.value.bandwidth();

      // knowing annotationsWidth, which depends on xScaleTissues, which depends on heatmapWidth, we can finally compute the final svg width
      width.value =
        margins.left +
        2 * annotationWidth.value +
        horizontalGap +
        heatmapWidth +
        margins.right;

      makeReactiveAxis(() => {
        select(axisTissues.value)
          .call(axisTop(xScaleTissues.value).tickSize(0))
          .selectAll('.tick text')
          .attr('transform', 'translate(2,0) rotate(-30) ')
          .style('text-anchor', 'start')
          .style('font-size', '15px');
        select(axisTissues.value).select('.domain').remove();
      });

      makeReactiveAxis(() => {
        select(axisVariants.value)
          .call(axisRight(yScale.value).tickSize(0))
          .selectAll('.tick text')
          .style('font-size', '15px');
        select(axisVariants.value)
          .selectAll('.tick text')
          .each(function (d) {
            console.log(d);
            if (d === props.variantId) {
              select(this).style('color', 'red');
            }
          });
        select(axisVariants.value).select('.domain').remove();
      });
    });

    const onClick = function ({ tissueName, variantId, dam }) {
      router.push({
        name: 'cell-lines-by-variant',
        params: {
          tissueName,
          variantId,
          geneId: props.geneId,
          dam: Boolean(dam),
        },
      });
    };

    const onClickAggregated = function ({ tissueName }) {
      router.push({
        name: 'cell-lines-aggregated',
        params: {
          tissueName,
          geneId: props.geneId,
        },
      });
    };

    return {
      width,
      annotationWidth,
      horizontalGap,
      verticalGap,
      heatmapWidth,
      heatmapHeight,
      height,
      margins,
      axisVariants,
      axisTissues,
      xScaleTissues,
      yScale,
      onClick,
      onClickAggregated,
    };
  },
};
</script>

<style lang="postcss" scoped>
.heatmap-patients {
  cursor: pointer;
  pointer-events: bounding-box;

  &:hover {
    rect {
      fill: rgb(0, 255, 38);
    }
  }
}
svg {
  padding: var(--size-2);
}

.bold {
  font-weight: var(--font-weight-6);
}

.variant-highlight {
  fill: none;
  stroke-width: 2px;
  stroke: red;
}
</style>
