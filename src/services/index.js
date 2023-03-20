import getEnv from "../utils/env.js";
const urlBackend = getEnv("VITE_URL_BACKEND");

import { sendErrorNotification } from "../notifications";

import axios from "axios";

const instance = axios.create({
  baseURL: urlBackend,
});

export default {
  getMutationByGene(id) {
    return instance
      .get("mutationsByGene/", {
        params: { id },
      })
      .then((res) => {
        if (!res.data[0])
          throw new Error(`No results available for gene: ${id}`);
        return res.data[0];
      })
      .catch((error) => {
        sendErrorNotification({
          title: "Cannot retrieve data",
          message: error.message || error,
        });
      });
  },
  getEssentialityProfiles(query) {
    return instance
      .get("essentiality/", {
        params: query,
      })
      .then((res) => {
        if (!res.data || res.data.length === 0)
          throw new Error(`No results available for this query`);
        return res.data;
      })
      .catch((error) => {
        sendErrorNotification({
          title: "Cannot retrieve data",
          message: error.message || error,
        });
      });
  },
};
