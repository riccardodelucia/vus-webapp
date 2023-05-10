import getEnv from '../utils/env.js';
import { interceptorCamelize } from '@computational-biology-sw-web-dev-unit/ht-vue';

const urlBackend = getEnv('VITE_URL_BACKEND');

import axios from 'axios';

const instance = axios.create({
  baseURL: urlBackend,
  timeout: 10000,
});

instance.interceptors.response.use(interceptorCamelize);

export default {
  getVariants(gene) {
    return instance.get(`variants/${gene}`);
  },
  getTissues() {
    return instance.get('tissues');
  },
  getVariantsData(gene) {
    return instance.get(`variants-data/${gene}`);
  },
  getAnnotations(gene) {
    return instance.get(`annotations/${gene}`);
  },
  getCellLineEssentialityProfiles({ tissueName, variantId, geneId }) {
    return instance.get(`cell-line-essentiality`, {
      params: {
        tissue_name: tissueName,
        variant_id: variantId,
        gene_id: geneId,
      },
    });
  },
};
