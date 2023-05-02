<template>
  <svg
    preserveAspectRatio="xMinYMin meet"
    :viewBox="[0, 0, width, height].join(' ')"
    :width="width"
    :height="height"
  >
    <g :transform="`translate(${margins.left}, ${margins.top})`">
      <g ref="axisAnnotations"></g>
      <rect
        v-for="(datum, idx) in annotationsHeatmap"
        :key="idx"
        :x="xScaleAnnotations('sift')"
        :y="yScale(datum.variantId)"
        :width="xScaleAnnotations.bandwidth()"
        :height="yScale.bandwidth()"
        :fill="datum.sift ? siftColor(datum.sift) : 'transparent'"
      ></rect>
      <rect
        v-for="(datum, idx) in annotationsHeatmap"
        :key="idx"
        :x="xScaleAnnotations('polyphen')"
        :y="yScale(datum.variantId)"
        :width="xScaleAnnotations.bandwidth()"
        :height="yScale.bandwidth()"
        :fill="datum.polyphen ? polyphenColor(datum.polyphen) : 'transparent'"
      ></rect>
      <g :transform="`translate(${annotationsWidth + gap}, 0)`">
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
            @mouseover="onMouseover"
            @mouseleave="onMouseleave($event, datum)"
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
              :fill="DOT_COLOR"
              pointer-events="none"
            />
          </g>
        </g>
      </g>
    </g>
  </svg>
</template>

<script>
import { axisTop, axisRight, select, scaleBand } from 'd3';
import { ref } from 'vue';
import { makeReactiveAxis } from '@computational-biology-sw-web-dev-unit/ht-vue';

import { useRouter } from 'vue-router';

const DOT_COLOR = 'dodgerblue';
const HOVER_COLOR = 'rgb(0, 255, 38)';

export default {
  name: 'VariantsHeatmap',
  props: {
    geneId: { type: String, required: true },
    heatmap: {
      type: Array,
      required: true,
    },
    annotationsHeatmap: {
      type: Array,
      required: true,
    },
    variants: {
      type: Array,
      required: true,
    },
    tissues: {
      type: Array,
      required: true,
    },
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
  setup(props) {
    const axisAnnotations = ref(null);
    const axisTissues = ref(null);
    const axisVariants = ref(null);

    const router = useRouter();

    const padding = 0.05;

    const margins = { left: 0, right: 180, top: 120, bottom: 0 };

    const gap = 10;
    const heatmapWidth = 900;

    const innerHeight = 30 * props.variants.length;
    const height = margins.top + innerHeight + margins.bottom;

    // Make Scales
    const yScale = scaleBand()
      .range([0, innerHeight])
      .domain(props.variants)
      .padding(padding);

    const xScaleTissues = scaleBand()
      .range([0, heatmapWidth])
      .domain(props.tissues)
      .padding(padding);

    // use same tile width on annotations
    const annotationsWidth = 2 * xScaleTissues.bandwidth() + padding;

    // knowing annotationsWidth, which depends on xScaleTissues, which depends on heatmapWidth, we can finally compute the final svg width
    const width =
      margins.left + annotationsWidth + gap + heatmapWidth + margins.right;

    const xScaleAnnotations = scaleBand()
      .range([0, annotationsWidth])
      .domain(['sift', 'polyphen'])
      .padding(padding);

    makeReactiveAxis(() => {
      select(axisAnnotations.value)
        .call(axisTop(xScaleAnnotations).tickSize(0))
        .selectAll('.tick text')
        .attr('transform', 'translate(2,0) rotate(-30) ')
        .style('text-anchor', 'start');
      select(axisAnnotations.value).select('.domain').remove();
    });

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

    const onClick = function (datum) {
      router.push({
        name: 'essentiality',
        query: {
          tissueName: datum.tissueName,
          variantId:
            datum.variantId !== 'AGGREGATED DAM' ? datum.variantId : '',
          geneId: props.geneId,
        },
      });
    };

    const onMouseover = function (e) {
      const s = select(e.target);
      s.selectAll('circle').attr('fill', HOVER_COLOR);
      s.selectAll('rect').attr('fill', HOVER_COLOR);
    };

    const onMouseleave = function (e, datum) {
      const s = select(e.target);
      s.selectAll('circle').attr('fill', DOT_COLOR);
      s.selectAll('rect').attr('fill', props.color(datum.nPatients));
    };

    return {
      width,
      annotationsWidth,
      gap,
      heatmapWidth,
      height,
      margins,
      axisVariants,
      axisTissues,
      axisAnnotations,
      xScaleTissues,
      xScaleAnnotations,
      yScale,
      onClick,
      onMouseover,
      onMouseleave,
      DOT_COLOR,
    };
  },
};
</script>

<style lang="scss" scoped="true">
.heatmap-patients {
  cursor: pointer;

  pointer-events: bounding-box;
}
</style>
