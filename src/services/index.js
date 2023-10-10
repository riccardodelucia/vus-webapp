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
  getVariantsData(gene) {
    return instance.get(`variants-data/${gene}`);
  },
  getVariantsAggregatedData(gene) {
    return instance.get(`variants-aggregated/${gene}`);
  },
  getVariantsAnnotations(gene) {
    return instance.get(`variants-annotations/${gene}`);
  },
  getCellLinesDataByVariant({ tissueName, variantId, geneId }) {
    return instance.get(`cell-lines/by-variant`, {
      params: {
        tissue_name: tissueName,
        variant_id: variantId,
        gene_id: geneId,
      },
    });
  },
  getCellLinesDataAggregated({ tissueName, geneId }) {
    return instance.get(`cell-lines/aggregated`, {
      params: {
        tissue_name: tissueName,
        gene_id: geneId,
      },
    });
  },
  getDrugsTestedOnGene({ tissueName, geneId }) {
    return instance.get(`drugs`, {
      params: {
        tissue_name: tissueName,
        gene_id: geneId,
      },
    });
  },
  getDrugsSensitivities({ geneId, tissueName, drugGdscId, gdscVersion }) {
    return instance.get(`drugs/sensitivities`, {
      params: {
        tissue_name: tissueName,
        gene_id: geneId,
        drug_gdsc_id: drugGdscId,
        gdsc_version: gdscVersion,
      },
    });
  },
};
