<template>
  <h2>Gene: {{ geneId.toUpperCase() }}</h2>
  <div class="grid">
    <CellLinesEssentialityDetails
      v-if="essentialityDetails && currentTab.panel === 'essentiality'"
      class="details"
      :details="essentialityDetails"
    ></CellLinesEssentialityDetails>
    <CellLinesSensitivitiesDetails
      v-if="sensitivityDetails && currentTab.panel === 'sensitivity'"
      class="details"
      :details="essentialityDetails"
      :drugs="drugs"
      @update:model-value="onUpdate"
    ></CellLinesSensitivitiesDetails>

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
        <SensitivityProfiles
          :sizes="sizes"
          :drug="selectedDrug"
          :gene-id="geneId"
          :tissue-name="tissueName"
          @rank-ratio="onSensitivityRankRatio"
        >
        </SensitivityProfiles>
      </template>
    </ht-tab>
  </div>
</template>

<script>
import CellLinesEssentialities from '@/components/CellLinesEssentialities.vue';
import SensitivityProfiles from '@/components/cell_lines/SensitivityProfiles.vue';
import CellLinesEssentialityDetails from '@/components/CellLinesEssentialityDetails.vue';
import CellLinesSensitivitiesDetails from '@/components/cell_lines/CellLinesSensitivitiesDetails.vue';

import { getInnerChartSizes } from '@computational-biology-sw-web-dev-unit/ht-vue';

import { ref, onBeforeMount } from 'vue';

import service from '@/services';

import { processErrorMessage } from '@/utils/errors.js';

export default {
  name: 'CellLinesAggregated',
  components: {
    CellLinesEssentialities,
    SensitivityProfiles,
    CellLinesEssentialityDetails,
    CellLinesSensitivitiesDetails,
  },
  props: {
    geneId: { type: String, required: true },
    tissueName: { type: String, required: true },
  },
  setup(props) {
    const cellLinesData = ref(null);
    const rankRatio = ref(0);
    const drugs = ref(null);
    const selectedDrug = ref(null);
    const essentialityDetails = ref(null);
    const sensitivityDetails = ref(null);

    const tabList = ref([{ label: 'Essentiality', panel: 'essentiality' }]);
    const currentTab = ref(tabList.value[0]);

    onBeforeMount(async () => {
      try {
        const { data } = await service.getCellLinesDataAggregated(props);

        if (!data) {
          throw new Error(`Unable to retrieve data`);
        }

        cellLinesData.value = data.cellLinesData;
        rankRatio.value = data.rankRatio;

        const { data: drugsData } = await service.getDrugsTestedOnGene(props);
        if (drugsData.length > 0) {
          drugs.value = drugsData.map((item) => ({
            ...item,
            label: `${item.drugName}, GDSC v${item.gdscVersion}`,
          }));

          tabList.value.push({ label: 'Sensitivity', panel: 'sensitivity' });

          sensitivityDetails.value = {
            geneId: props.geneId,
            rankRatio: 0,
            tissueName: props.tissueName,
          };
        }

        essentialityDetails.value = {
          geneId: props.geneId,
          rankRatio: rankRatio.value,
          tissueName: props.tissueName,
        };
      } catch (error) {
        processErrorMessage(error);
      }
    });

    const width = 1100;
    const height = 700;

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

    const onSensitivityRankRatio = (rankRatio) => {
      sensitivityDetails.value.rankRatio = rankRatio;
    };

    const onUpdate = (value) => {
      selectedDrug.value = value;
    };

    return {
      sizes,
      tabList,
      onTabSelected,
      drugs,
      selectedDrug,
      onSensitivityRankRatio,
      essentialityDetails,
      sensitivityDetails,
      currentTab,
      cellLinesData,
      onUpdate,
    };
  },
};
</script>

<style lang="postcss" scoped></style>
