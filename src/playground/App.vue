<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import PlaygroundSidebar from './components/PlaygroundSidebar.vue'
import PlaygroundHeader from './components/PlaygroundHeader.vue'

// Eager-load all meta.json files to build the sidebar list
const metaModules = import.meta.glob('../components/*/meta.json', {
  eager: true,
}) as Record<string, { default: { name: string; description?: string } }>

const componentList = Object.values(metaModules).map((m) => m.default)

// Build nav sections from component list
const navSections = computed(() => [
  {
    title: 'Components',
    items: componentList.map((comp) => ({
      id: `/${comp.name}`,
      label: comp.name.charAt(0).toUpperCase() + comp.name.slice(1),
    })),
  },
])

const route = useRoute()
const router = useRouter()

const sidebarOpen = ref(false)
const isDark = ref(false)

function toggleDarkMode() {
  isDark.value = !isDark.value
  if (isDark.value) {
    document.documentElement.setAttribute('data-theme', 'dark')
  } else {
    document.documentElement.setAttribute('data-theme', 'light')
  }
}

function handleNavigate(id: string) {
  router.push(id)
  sidebarOpen.value = false
}
</script>

<template>
  <div class="min-h-screen bg-lume-background text-lume-foreground">
    <div class="flex min-h-screen">
      <!-- Sidebar -->
      <PlaygroundSidebar
        :sections="navSections"
        :active-section="route.path"
        :open="sidebarOpen"
        @navigate="handleNavigate"
        @close="sidebarOpen = false"
      />

      <!-- Main area -->
      <div class="flex-1 flex flex-col min-w-0">
        <PlaygroundHeader
          :is-dark="isDark"
          :sidebar-open="sidebarOpen"
          @toggle-dark="toggleDarkMode"
          @toggle-sidebar="sidebarOpen = !sidebarOpen"
        />

        <main class="flex-1 overflow-y-auto">
          <div class="mx-auto max-w-4xl px-4 py-8 lg:px-8">
            <router-view />
          </div>
        </main>

        <!-- Footer -->
        <footer class="border-t px-4 py-3">
          <p class="text-xs text-lume-muted-foreground text-center">
            @hemia/lume — Component system for Vue, React, Svelte & Astro
          </p>
        </footer>
      </div>
    </div>
  </div>
</template>