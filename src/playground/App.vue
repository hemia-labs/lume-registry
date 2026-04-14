<script setup lang="ts">
import { ref, shallowRef } from 'vue'

interface ComponentMeta {
  name: string
  description?: string
}

// Eager-load all meta.json files to build the sidebar list
const metaModules = import.meta.glob('../components/*/meta.json', {
  eager: true,
}) as Record<string, { default: ComponentMeta }>

// Lazy-load the first .vue file inside each component directory
const vueModules = import.meta.glob('../components/*/*.vue') as Record<
  string,
  () => Promise<{ default: object }>
>

const componentList: ComponentMeta[] = Object.values(metaModules).map(
  (m) => m.default
)

const selected = ref<string>(componentList[0]?.name ?? '')
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

function onSelect(name: string): void {
  selected.value = name
  loadComponent(name)
}

// Load first component on mount
if (selected.value) {
  loadComponent(selected.value)
}
</script>

<template>
  <div class="playground">
    <aside class="sidebar">
      <div class="sidebar-header">
        <span class="sidebar-logo">✦</span>
        <h1 class="sidebar-title">Lume Registry</h1>
      </div>
      <nav>
        <ul class="component-list">
          <li
            v-for="comp in componentList"
            :key="comp.name"
            :class="['component-item', { active: comp.name === selected }]"
            @click="onSelect(comp.name)"
          >
            <span class="component-name">{{ comp.name }}</span>
            <span v-if="comp.description" class="component-description">
              {{ comp.description }}
            </span>
          </li>
        </ul>
      </nav>
    </aside>

    <main class="content">
      <header class="content-header">
        <h2 class="content-title">{{ selected }}</h2>
      </header>

      <section class="preview-area">
        <p v-if="loadError" class="error">{{ loadError }}</p>
        <component :is="CurrentComponent" v-else-if="CurrentComponent" />
        <p v-else class="loading">Loading…</p>
      </section>
    </main>
  </div>
</template>

<style>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background: #f8fafc;
  color: #1e293b;
}
</style>

<style scoped>
.playground {
  display: flex;
  height: 100vh;
  overflow: hidden;
}

/* Sidebar */
.sidebar {
  width: 260px;
  flex-shrink: 0;
  background: #ffffff;
  border-right: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}

.sidebar-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1.25rem 1rem;
  border-bottom: 1px solid #e2e8f0;
}

.sidebar-logo {
  font-size: 1.25rem;
  color: #6366f1;
}

.sidebar-title {
  font-size: 1rem;
  font-weight: 600;
  color: #1e293b;
}

.component-list {
  list-style: none;
  padding: 0.5rem;
}

.component-item {
  padding: 0.625rem 0.75rem;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.15s;
}

.component-item:hover {
  background-color: #f1f5f9;
}

.component-item.active {
  background-color: #eef2ff;
}

.component-name {
  display: block;
  font-weight: 500;
  font-size: 0.9rem;
  text-transform: capitalize;
  color: #1e293b;
}

.component-item.active .component-name {
  color: #6366f1;
}

.component-description {
  display: block;
  font-size: 0.75rem;
  color: #94a3b8;
  margin-top: 0.125rem;
}

/* Content */
.content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.content-header {
  padding: 1.25rem 2rem;
  border-bottom: 1px solid #e2e8f0;
  background: #ffffff;
}

.content-title {
  font-size: 1.25rem;
  font-weight: 600;
  text-transform: capitalize;
  color: #1e293b;
}

.preview-area {
  flex: 1;
  padding: 2rem;
  overflow-y: auto;
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
}

.loading {
  color: #94a3b8;
  font-size: 0.9rem;
}

.error {
  color: #ef4444;
  font-size: 0.9rem;
}
</style>
