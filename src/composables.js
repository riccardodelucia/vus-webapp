import { computed } from 'vue';
export const useRankRatio = (details) => {
  return computed(() => {
    const value = Number(details.rankRatio.toFixed(2));
    if (value === 0) return 'Undefined';
    return value;
  });
};
