<script setup lang="ts">
withDefaults(
  defineProps<{
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
    size?: 'sm' | 'md' | 'lg'
    disabled?: boolean
  }>(),
  {
    variant: 'primary',
    size: 'md',
    disabled: false,
  }
)

defineEmits<{
  click: [event: MouseEvent]
}>()
</script>

<template>
  <button
    :class="['btn', `btn--${variant}`, `btn--${size}`]"
    :disabled="disabled"
    @click="$emit('click', $event)"
  >
    <slot>Button</slot>
  </button>
</template>

<style scoped>
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  border: 1px solid transparent;
  transition: background-color 0.2s, color 0.2s, border-color 0.2s, opacity 0.2s;
  white-space: nowrap;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Sizes */
.btn--sm {
  padding: 0.25rem 0.75rem;
  font-size: 0.875rem;
}
.btn--md {
  padding: 0.5rem 1rem;
  font-size: 1rem;
}
.btn--lg {
  padding: 0.75rem 1.5rem;
  font-size: 1.125rem;
}

/* Variants */
.btn--primary {
  background-color: #6366f1;
  color: #ffffff;
  border-color: #6366f1;
}
.btn--primary:hover:not(:disabled) {
  background-color: #4f46e5;
  border-color: #4f46e5;
}

.btn--secondary {
  background-color: #e2e8f0;
  color: #1e293b;
  border-color: #e2e8f0;
}
.btn--secondary:hover:not(:disabled) {
  background-color: #cbd5e1;
  border-color: #cbd5e1;
}

.btn--outline {
  background-color: transparent;
  color: #6366f1;
  border-color: #6366f1;
}
.btn--outline:hover:not(:disabled) {
  background-color: #eef2ff;
}

.btn--ghost {
  background-color: transparent;
  color: #475569;
  border-color: transparent;
}
.btn--ghost:hover:not(:disabled) {
  background-color: #f1f5f9;
}
</style>
