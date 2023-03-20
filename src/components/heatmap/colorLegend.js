import {
  quantize,
  interpolate,
  interpolateRound,
  range,
  quantile,
  format,
  scaleBand,
  axisBottom,
  axisRight,
  scaleLinear,
  select,
} from "d3";

function makeHorizontal(trueWidth, trueHeight) {
  const width = Math.max(trueWidth, trueHeight);
  const height = Math.min(trueWidth, trueHeight);

  return [width, height];
}

export function renderLegend({
  color,
  legendNode,
  orientation,
  width: trueWidth,
  height: trueHeight,
  invert = false,
}) {
  const ramp = function (color, n = 256) {
    const canvas = document.createElement("canvas");
    canvas.width = n;
    canvas.height = 1;
    const context = canvas.getContext("2d");
    if (!invert) {
      for (let i = 0; i < n; ++i) {
        context.fillStyle = color(i / (n - 1));
        context.fillRect(i, 0, 1, 1);
      }
    } else {
      for (let i = 0; i < n; ++i) {
        context.fillStyle = color((n - i - 1) / (n - 1));
        context.fillRect(i, 0, 1, 1);
      }
    }

    return canvas;
  };

  // always build horizontal legend, rotate afterwards if 'vertical'
  const [width, height] = makeHorizontal(trueWidth, trueHeight);

  // Continuous
  if (color.interpolate) {
    const n = Math.min(color.domain().length, color.range().length);

    select(legendNode)
      .append("image")
      .attr("width", width)
      .attr("height", height)
      .attr("preserveAspectRatio", "none")
      .attr(
        "href",
        ramp(color.copy().domain(quantize(interpolate(0, 1), n))).toDataURL()
      );
  }

  // Sequential
  else if (color.interpolator) {
    select(legendNode)
      .append("image")
      .attr("width", width)
      .attr("height", height)
      .attr("preserveAspectRatio", "none")
      .attr("href", ramp(color.interpolator()).toDataURL());
  }

  // Threshold
  else if (color.invertExtent) {
    const x = scaleLinear()
      .domain([-1, color.range().length - 1])
      .rangeRound([0, width]);

    select(legendNode)
      .selectAll("rect")
      .data(!invert ? color.range() : color.range().reverse())
      .join("rect")
      .attr("x", (d, i) => x(i - 1))
      .attr("y", 0)
      .attr("width", (d, i) => x(i) - x(i - 1))
      .attr("height", height)
      .attr("fill", (d) => d);
  }

  // Ordinal
  else {
    const x = scaleBand()
      .domain(!invert ? color.domain() : color.domain().reverse())
      .rangeRound([0, width]);

    select(legendNode)
      .selectAll("rect")
      .data(color.domain())
      .join("rect")
      .attr("x", x)
      .attr("y", 0)
      .attr("width", Math.max(0, x.bandwidth() - 1))
      .attr("height", height)
      .attr("fill", color);
  }

  if (orientation === "vertical")
    select(legendNode).attr("transform", `rotate(-90) translate(${-width}, 0)`);
}

export function makeAxis({
  color,
  orientation,
  width,
  height,
  nTicks,
  tickFormat,
  invert = false,
}) {
  let scale;
  let tickValues;
  let tickAdjust;
  let tickSize = 6;

  const makeTickAdjust = function (orientation) {
    if (orientation === "vertical") {
      return (g) => g.selectAll(".tick line").attr("x1", -width);
    } else {
      return (g) => g.selectAll(".tick line").attr("y1", -height);
    }
  };

  // Continuous
  if (color.interpolate) {
    const n = Math.min(color.domain().length, color.range().length);

    scale =
      orientation === "horizontal"
        ? color.copy().rangeRound(quantize(interpolate(0, width), n))
        : color.copy().rangeRound(quantize(interpolate(0, height), n));

    tickAdjust = makeTickAdjust(orientation);
  }

  // Sequential
  else if (color.interpolator) {
    scale =
      orientation === "horizontal"
        ? Object.assign(color.copy().interpolator(interpolateRound(0, width)), {
            range() {
              return [0, width];
            },
          })
        : Object.assign(
            color.copy().interpolator(interpolateRound(0, height)),
            {
              range() {
                return [0, height];
              },
            }
          );

    tickAdjust = makeTickAdjust(orientation);

    // scaleSequentialQuantile doesn’t implement ticks or tickFormat.
    if (!scale.ticks) {
      // this code patches the orientation for scaleSequentialQuantile
      if (orientation === "horizontal") {
        const interval = !invert ? [0, width] : [width, 0];

        scale = Object.assign(
          color.copy().interpolator(interpolateRound(...interval)),
          {
            range() {
              return interval;
            },
          }
        );
      } else {
        const interval = !invert ? [height, 0] : [0, height];

        scale = Object.assign(
          color.copy().interpolator(interpolateRound(...interval)),
          {
            range() {
              return interval;
            },
          }
        );
      }

      if (tickValues === undefined) {
        const n = Math.round(nTicks + 1);
        tickValues = range(n).map((i) => quantile(color.domain(), i / (n - 1)));
      }
      if (typeof tickFormat !== "function") {
        tickFormat = format(tickFormat === undefined ? ",f" : tickFormat);
      }
    }
  }

  // Threshold
  else if (color.invertExtent) {
    const thresholds = color.thresholds
      ? color.thresholds() // scaleQuantize
      : color.quantiles
      ? color.quantiles() // scaleQuantile
      : color.domain(); // scaleThreshold

    const thresholdFormat =
      tickFormat === undefined
        ? (d) => d
        : typeof tickFormat === "string"
        ? format(tickFormat)
        : tickFormat;

    scale =
      orientation === "horizontal"
        ? scaleLinear()
            .domain([-1, color.range().length - 1])
            .rangeRound([0, width])
        : scaleLinear()
            .domain([-1, color.range().length - 1])
            .rangeRound([0, height]);

    tickValues = range(thresholds.length);
    tickFormat = (i) => thresholdFormat(thresholds[i], i);

    tickAdjust = makeTickAdjust(orientation);
  } else {
    scale =
      orientation === "horizontal"
        ? scaleBand().domain(color.domain()).rangeRound([0, width])
        : scaleBand().domain(color.domain()).rangeRound([0, height]);

    tickAdjust = () => {};
    tickSize = 0;
  }

  // make standard vertical axis point upwards (no effect on scaleSequentialQuantile)
  orientation === "vertical" && scale.domain(scale.domain().reverse());

  // invert direction if needed
  invert && scale.domain(scale.domain().reverse());

  return { scale, tickValues, tickFormat, tickAdjust, tickSize };
}

export function renderAxis({
  axisNode,
  orientation,
  scale,
  width,
  height,
  nTicks = 10,
  tickFormat = "",
  tickSize = 6,
  tickAdjust = undefined,
  tickValues = undefined,
}) {
  let axisFunction;
  if (orientation === "vertical") {
    select(axisNode).attr("transform", `translate(${width}, 0)`);
    axisFunction = axisRight(scale);
  } else {
    select(axisNode).attr("transform", `translate(0, ${height})`);
    axisFunction = axisBottom(scale);
  }

  select(axisNode)
    .call(
      axisFunction
        .ticks(nTicks)
        .tickFormat(typeof tickFormat === "function" ? tickFormat : undefined)
        .tickSize(tickSize)
        .tickValues(tickValues)
    )
    .call(tickAdjust)
    .call((g) => g.select(".domain").remove());
}
