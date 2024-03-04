import lodash from 'lodash-es';
import deepdash from 'deepdash-es';
const _ = deepdash(lodash);

export function interceptorCamelize(response) {
  // if this is a multipart file response, there is nothing to camelize
  if (response.headers['content-type'] === 'application/json') {
    const res = _.mapKeysDeep(response.data, function (__, key) {
      return _.camelCase(key);
    });
    response.data = res;
  }

  return response;
}

export const getInnerChartSizes = function (width, height, margin) {
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  return { innerWidth, innerHeight };
};
