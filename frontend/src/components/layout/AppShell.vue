<script setup lang="ts">
import AppConfirmDialog from '../feedback/AppConfirmDialog.vue'
import AppNotifications from '../feedback/AppNotifications.vue'
import AppSidebar from './AppSidebar.vue'
</script>

<template>
  <div class="app-shell">
    <AppSidebar />
    <main class="app-shell__content">
      <RouterView />
    </main>
    <AppNotifications />
    <AppConfirmDialog />
  </div>
</template>

<style scoped lang="scss">
.app-shell {
  display: flex;
  min-width: 1280px;
  min-height: 100vh;
  background: #f7f8fc;

  &__content {
    min-width: 0;
    flex: 1;
    padding: 42px 50px;
  }
}
</style>
