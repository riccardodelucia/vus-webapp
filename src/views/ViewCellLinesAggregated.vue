<template>
  <CellLinesViewLayout
    :gene-id="geneId"
    title="Cell Lines Information Aggregated"
  >
    <template #details>
      <router-link
        class="ht-button back-link"
        data-type="secondary"
        :to="{ name: 'variants', params: { geneId: geneId } }"
      >
        <span class="back-link">
          <vue-feather type="arrow-left"></vue-feather>
          Variants
        </span>
      </router-link>
      <CellLinesDetails
        :details="
          currentTab.panel === 'essentiality'
            ? essentialityDetails
            : sensitivityDetails
        "
        :type="currentTab.panel"
        :drug="selectedDrug"
      ></CellLinesDetails>
      <ht-select
        v-if="currentTab.panel === 'sensitivity'"
        v-model="selectedDrug"
        class="ht-formgroup"
        label="Select Drug"
        :options="drugList"
      ></ht-select>
    </template>
    <template #chart>
      <ht-tab :tab-list="tabList" @tab-selected="onTabSelected">
        <template #essentiality>
          <CellLinesEssentialityProfiles
            :sizes="sizes"
            :cell-lines-data="cellLinesData"
          >
          </CellLinesEssentialityProfiles>
        </template>
        <template v-if="drugListAvailable" #sensitivity>
          <CellLinesSensitivityProfiles
            :sizes="sizes"
            :drug="selectedDrug"
            :gene-id="geneId"
            :tissue-name="tissueName"
            @rank-ratio="onSensitivityRankRatio"
          >
          </CellLinesSensitivityProfiles>
        </template>
      </ht-tab>
    </template>
  </CellLinesViewLayout>
</template>

<script>
import CellLinesViewLayout from '@/layouts/CellLinesViewLayout.vue';

import CellLinesEssentialityProfiles from '@/components/CellLinesEssentialityProfiles.vue';
import CellLinesSensitivityProfiles from '@/components/CellLinesSensitivityProfiles.vue';
import CellLinesDetails from '@/components/CellLinesDetails.vue';

import { getInnerChartSizes } from '@computational-biology-sw-web-dev-unit/ht-vue';

import { ref, reactive } from 'vue';

export default {
  name: 'ViewCellLinesAggregated',
  components: {
    CellLinesViewLayout,
    CellLinesEssentialityProfiles,
    CellLinesSensitivityProfiles,
    CellLinesDetails,
  },
  props: {
    cellLinesData: { type: Array, required: true },
    geneId: { type: String, required: true },
    tissueName: { type: String, required: true },
    rankRatio: { type: Number, required: true },
    drugs: {
      type: Array,
      default: () => [],
    },
  },
  setup(props) {
    const drugList = props.drugs.map((item) => ({
      ...item,
      label: `${item.drugName}, GDSC v${item.gdscVersion}`,
    }));

    const selectedDrug = ref(null);
    let drugListAvailable = false;

    if (drugList.length > 0) {
      selectedDrug.value = drugList[0];
      drugListAvailable = true;
    }

    const essentialityDetails = {
      geneId: props.geneId,
      rankRatio: props.rankRatio,
      tissueName: props.tissueName,
    };

    const sensitivityDetails = reactive({
      geneId: props.geneId,
      rankRatio: 0,
      tissueName: props.tissueName,
    });

    const width = 1000;
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

    const tabList = [{ label: 'Essentiality', panel: 'essentiality' }];

    const currentTab = ref(tabList[0]);

    if (drugListAvailable)
      tabList.push({ label: 'Sensitivity', panel: 'sensitivity' });

    const onTabSelected = function (idx) {
      if (tabList[idx].panel === 'sensitivity') {
        currentTab.value = tabList[1];
      } else currentTab.value = tabList[0];
    };

    const onSensitivityRankRatio = (rankRatio) => {
      sensitivityDetails.rankRatio = rankRatio;
    };

    return {
      sizes,
      tabList,
      onTabSelected,
      drugList,
      selectedDrug,
      drugListAvailable,
      onSensitivityRankRatio,
      essentialityDetails,
      sensitivityDetails,
      currentTab,
    };
  },
};
</script>

<style lang="postcss" scoped></style>
