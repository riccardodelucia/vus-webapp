<template>
  <h2>Gene: {{ geneId.toUpperCase() }}</h2>
  <div class="grid">
    <CellLinesEssentialityDetails
      v-if="essentialityDetails && currentTab.panel === 'essentiality'"
      class="details"
      :details="essentialityDetails"
    ></CellLinesEssentialityDetails>
    <CellLinesSensitivityDetails
      v-if="currentTab.panel === 'sensitivity'"
      class="details"
      :details="sensitivityDetails"
      :drugs="drugs"
      @update:model-value="onUpdate"
    ></CellLinesSensitivityDetails>
    <ht-tab
      v-if="cellLinesData"
      class="chart"
      :tab-list="tabList"
      @tab-selected="onTabSelected"
    >
      <template #essentiality>
        <CellLinesEssentialities
          :sizes="sizes"
          :cell-lines-data="cellLinesData"
        >
        </CellLinesEssentialities>
      </template>
      <template v-if="selectedDrug" #sensitivity>
        <div v-if="state === 'loading'" class="center-grid">Loading...</div>
        <div v-else-if="state === 'error'" class="center-grid">
          Error: unable to retrieve data
        </div>
        <CellLinesSensitivities
          v-else
          :sizes="sizes"
          :sensitivities="sensitivities"
        >
        </CellLinesSensitivities>
      </template>
    </ht-tab>
  </div>
</template>

<script>
import CellLinesEssentialities from '@/components/CellLinesEssentialities.vue';
import CellLinesSensitivities from '@/components/CellLinesSensitivities.vue';
import CellLinesEssentialityDetails from '@/components/CellLinesEssentialityDetails.vue';
import CellLinesSensitivityDetails from '@/components/CellLinesSensitivityDetails.vue';

import { getInnerChartSizes } from '@computational-biology-sw-web-dev-unit/ht-vue';

import { ref, reactive, onBeforeMount } from 'vue';

import service from '@/services';

import { processErrorMessage } from '@/utils/errors.js';

import { sendErrorNotification } from '@/notifications.js';

export default {
  name: 'CellLinesAggregated',
  components: {
    CellLinesEssentialities,
    CellLinesSensitivities,
    CellLinesEssentialityDetails,
    CellLinesSensitivityDetails,
  },
  props: {
    geneId: { type: String, required: true },
    tissueName: { type: String, required: true },
  },
  setup(props) {
    const cellLinesData = ref(null);
    const drugs = ref(null);
    const selectedDrug = ref(null);
    const sensitivities = ref(null);

    const essentialityDetails = reactive({
      geneId: props.geneId,
      rankRatio: 0,
      tissueName: props.tissueName,
    });

    const sensitivityDetails = reactive({
      rankRatio: 0,
      tissueName: props.tissueName,
    });

    const tabList = ref([
      { label: 'Gene Essentiality', panel: 'essentiality' },
    ]);
    const currentTab = ref(tabList.value[0]);

    const state = ref('loading');

    onBeforeMount(async () => {
      try {
        const { data } = await service.getCellLinesDataAggregated(props);

        if (!data) {
          throw new Error(`Unable to retrieve data`);
        }

        cellLinesData.value = data.cellLinesData;
        essentialityDetails.rankRatio = data.rankRatio;

        const { data: drugsData } = await service.getDrugsTestedOnGene(props);
        if (drugsData.length > 0) {
          drugs.value = drugsData.map((item) => ({
            ...item,
            label: `${item.drugName}, GDSC v${item.gdscVersion}`,
          }));

          tabList.value.push({
            label: 'Drug Sensitivity',
            panel: 'sensitivity',
          });
        }
      } catch (error) {
        processErrorMessage(error);
      }
    });

    const width = 1100;
    const height = 700;

    const cssWidth = `${width}px`;
    const cssHeight = `${height}px`;

    const margins = {
      top: 30,
      bottom: 100,
      left: 60,
      right: 20,
    };

    const { innerWidth, innerHeight } = getInnerChartSizes(
      width,
      height,
      margins
    );

    const sizes = { width, height, margins, innerWidth, innerHeight };

    const onTabSelected = function (idx) {
      if (tabList.value[idx].panel === 'sensitivity') {
        currentTab.value = tabList.value[1];
      } else currentTab.value = tabList.value[0];
    };

    const onUpdate = async (value) => {
      selectedDrug.value = value;
      state.value = 'loading';
      try {
        const { data } = await service.getDrugsSensitivities({
          ...selectedDrug.value,
          drugId: props.geneId,
          tissueName: props.tissueName,
        });

        sensitivities.value = data.sensitivities;

        sensitivityDetails.rankRatio = data.rankRatio;

        state.value = 'loaded';
      } catch (err) {
        state.value = 'error';
        sendErrorNotification(err);
      }
    };

    return {
      sizes,
      tabList,
      onTabSelected,
      drugs,
      selectedDrug,
      essentialityDetails,
      sensitivityDetails,
      currentTab,
      cellLinesData,
      onUpdate,
      cssWidth,
      cssHeight,
      state,
      sensitivities,
    };
  },
};
</script>

<style lang="scss" scoped>
.center-grid {
  display: grid;
  place-items: center;
  width: v-bind('cssWidth');
  height: v-bind('cssHeight');
}
</style>
