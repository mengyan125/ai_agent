<script setup lang="ts">
withDefaults(
  defineProps<{
    title: string
    status: 'healthy' | 'unhealthy' | 'loading'
    detail: string
  }>(),
  { detail: '' },
)
</script>

<template>
  <article class="health-card">
    <h2>{{ title }}</h2>
    <div class="health-card__status" :class="`health-card__status--${status}`">
      <span class="health-card__dot" />
      <strong>{{ status === 'loading' ? '检查中' : status === 'healthy' ? 'Healthy' : 'Unavailable' }}</strong>
    </div>
    <p>{{ detail }}</p>
  </article>
</template>

<style scoped lang="scss">
.health-card {
  border-radius: 16px;
  background: #fff;
  padding: 38px 36px 32px;

  h2 { margin: 0; color: #64748b; font-size: 24px; font-weight: 700; }
  p { margin: 18px 0 0; color: #64748b; font-size: 18px; }

  &__status { display: flex; align-items: center; gap: 12px; margin-top: 20px; color: #047857; font-size: 28px; }
  &__dot { width: 18px; height: 18px; border-radius: 50%; background: currentColor; }
  &__status--unhealthy { color: #dc2626; }
  &__status--loading { color: #64748b; }
}
</style>
