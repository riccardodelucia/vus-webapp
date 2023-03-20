<template>
  <div>
    <router-view />
    <div class="notifications-container">
      <ht-notifications
        :notifications="notifications"
        @remove-notification="onRemoveNotification"
      />
    </div>
  </div>
</template>

<script>
import { notifications, removeNotification } from "./notifications";

export default {
  data() {
    return { notifications };
  },
  methods: {
    onRemoveNotification(notification) {
      removeNotification(notification);
    },
  },
};
</script>

<style lang="scss">
.container {
  width: fit-content;
  margin: var(--space-md);
}
</style>
