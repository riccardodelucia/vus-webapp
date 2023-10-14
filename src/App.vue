<template>
  <div>
    <router-view />
    <div class="notifications-container ht-layout-stack">
      <ht-toast
        v-for="({ type, title, message, id }, idx) in notifications"
        :key="idx"
        :type="type"
        :title="title"
        :toast-id="id"
        @close-notification="onCloseNotification"
      >
        <p>{{ message }}</p>
      </ht-toast>
    </div>
  </div>
</template>

<script>
import { notifications, removeNotification } from './notifications';

export default {
  data() {
    return { notifications };
  },
  methods: {
    onCloseNotification(notification) {
      removeNotification(notification);
    },
  },
};
</script>

<style lang="postcss" scoped>
.notifications-container {
  padding: var(--size-2);
  position: absolute;
  bottom: 0;
  right: 0;

  width: 25%;

  @media only screen and (max-width: 700px) {
    width: 100%;
  }
}
</style>
