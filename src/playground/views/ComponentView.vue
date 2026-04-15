<script setup lang="ts">
import { shallowRef, ref } from 'vue'

const props = defineProps<{
  componentName: string
}>()

const vueModules = import.meta.glob('../../components/*/*.vue') as Record<
  string,
  () => Promise<{ default: object }>
>

const CurrentComponent = shallowRef<object | null>(null)
const loadError = ref<string | null>(null)

async function loadComponent(name: string): Promise<void> {
  loadError.value = null
  CurrentComponent.value = null
  const key = Object.keys(vueModules).find((k) => k.includes(`/${name}/`))
  if (!key) {
    loadError.value = `No .vue file found for "${name}"`
    return
  }
  try {
    const mod = await vueModules[key]()
    CurrentComponent.value = mod.default
  } catch (e) {
    loadError.value = `Failed to load component "${name}"`
    console.error(e)
  }
}

loadComponent(props.componentName)
</script>

<template>
  <div class="p-6">
    <div class="mb-6">
      <h2 class="text-2xl font-semibold capitalize text-lume-foreground">{{ componentName }}</h2>
      <p class="text-sm text-lume-muted-foreground mt-1">Component preview</p>
    </div>

    <div class="border rounded-lg p-8 bg-lume-card text-lume-card-foreground">
      <p v-if="loadError" class="text-lume-destructive">{{ loadError }}</p>
      <component :is="CurrentComponent" v-else-if="CurrentComponent" />
      <p v-else class="text-lume-muted-foreground">Loading...</p>
    </div>
  </div>
</template>