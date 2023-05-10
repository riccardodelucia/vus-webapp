<template>
  <svg
    preserveAspectRatio="xMinYMin meet"
    :viewBox="[0, 0, width, height].join(' ')"
    :width="width"
    :height="height"
  >
    <g :transform="`translate(${margins.left}, ${margins.top})`">
      <g>
        <text
          :transform="`translate(${annotationWidth / 2},-4) rotate(-90)`"
          style="font-weight: bold"
        >
          sift
        </text>
        <rect
          v-for="(datum, idx) in annotationsHeatmap"
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
          style="font-weight: bold"
        >
          polyphen
        </text>
        <rect
          v-for="(datum, idx) in annotationsHeatmap"
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
            v-for="(datum, idx) in heatmap"
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
              fill="dodgerblue"
              pointer-events="none"
            />
          </g>
        </g>

        <g :transform="`translate(0, ${heatmapHeight + verticalGap})`">
          <g
            v-for="(datum, idx) in aggregatedDam"
            :key="idx"
            class="heatmap-patients"
            :transform="`translate(${xScaleTissues(datum.tissueName)},  0)`"
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
              fill="dodgerblue"
              pointer-events="none"
            />
          </g>

          <text
            :transform="`translate(${heatmapWidth + 2}, ${
              yScale.bandwidth() / 2 + 4
            })`"
            style="font-weight: bold"
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
import { ref, inject } from 'vue';
import { makeReactiveAxis } from '@computational-biology-sw-web-dev-unit/ht-vue';

import { useRouter } from 'vue-router';

export default {
  name: 'VariantsHeatmap',
  props: {
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
  },
  setup() {
    const geneId = inject('geneId');
    const variants = inject('variants');
    const tissues = inject('tissues');

    const heatmap = inject('heatmap');
    const aggregatedDam = inject('aggregatedDam');
    const annotationsHeatmap = inject('annotationsHeatmap');

    const axisTissues = ref(null);
    const axisVariants = ref(null);

    const router = useRouter();

    const padding = 0.05;

    const margins = { left: 0, right: 180, top: 120, bottom: 0 };

    const horizontalGap = 10;
    const verticalGap = 10;
    const heatmapTileHeight = 30;
    const heatmapWidth = 900;

    const heatmapHeight = heatmapTileHeight * variants.value.length;
    const height =
      margins.top +
      heatmapHeight +
      margins.bottom +
      verticalGap +
      heatmapTileHeight;

    // Make Scales
    const yScale = scaleBand()
      .range([0, heatmapHeight])
      .domain(variants.value)
      .padding(padding);

    const xScaleTissues = scaleBand()
      .range([0, heatmapWidth])
      .domain(tissues.value)
      .padding(padding);

    // use same tile width on annotations
    const annotationWidth = xScaleTissues.bandwidth();

    // knowing annotationsWidth, which depends on xScaleTissues, which depends on heatmapWidth, we can finally compute the final svg width
    const width =
      margins.left +
      2 * annotationWidth +
      horizontalGap +
      heatmapWidth +
      margins.right;

    makeReactiveAxis(() => {
      select(axisTissues.value)
        .call(axisTop(xScaleTissues).tickSize(0))
        .selectAll('.tick text')
        .attr('transform', 'translate(2,0) rotate(-30) ')
        .style('text-anchor', 'start');
      select(axisTissues.value).select('.domain').remove();
    });

    makeReactiveAxis(() => {
      select(axisVariants.value).call(axisRight(yScale).tickSize(0));
      select(axisVariants.value).select('.domain').remove();
    });

    const onClick = function ({ tissueName, variantId }) {
      router.push({
        name: 'essentiality',
        query: {
          tissueName,
          variantId,
          geneId: geneId,
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
      heatmap,
      aggregatedDam,
      annotationsHeatmap,
    };
  },
};
</script>

<style lang="scss" scoped="true">
.heatmap-patients {
  cursor: pointer;
  pointer-events: bounding-box;

  &:hover {
    * {
      fill: rgb(0, 255, 38);
    }
  }
}
</style>
