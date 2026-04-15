<script setup lang="ts">
interface NavItem {
  id: string
  label: string
  badge?: string
}

interface NavSection {
  title: string
  items: NavItem[]
}

defineProps<{
  sections: NavSection[]
  activeSection: string
  open: boolean
}>()

const emit = defineEmits<{
  navigate: [id: string]
  close: []
}>()

const expandedSections = defineModel<Set<string>>('expanded', { default: new Set(['Components']) })

function isExpanded(title: string): boolean {
  return expandedSections.value.has(title)
}

function toggleSection(title: string): void {
  const newSet = new Set(expandedSections.value)
  if (newSet.has(title)) {
    newSet.delete(title)
  } else {
    newSet.add(title)
  }
  expandedSections.value = newSet
}

import { useRoute } from 'vue-router'

const route = useRoute()

function isActive(id: string): boolean {
  return id === route.path
}

function handleNav(id: string): void {
  emit('navigate', id)
}
</script>

<template>
  <!-- Mobile overlay -->
  <div
    v-if="open"
    class="fixed inset-0 z-40 bg-black/50 lg:hidden"
    @click="emit('close')"
  />

  <aside
    :class="[
      'fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r bg-lume-background transition-transform duration-200',
      open ? 'translate-x-0' : '-translate-x-full',
      'lg:static lg:translate-x-0 lg:z-auto'
    ]"
  >
    <!-- Sidebar header -->
    <div class="flex h-14 items-center gap-2 border-b px-4 lg:px-5">
      <div class="h-7 w-7 rounded-lg bg-lume-primary flex items-center justify-center">
        <span class="text-lume-primary-foreground text-xs font-bold">L</span>
      </div>
      <div class="flex flex-col">
        <span class="text-sm font-semibold leading-none text-lume-foreground">Lume</span>
        <span class="text-[10px] text-lume-muted-foreground leading-none mt-0.5">v0.0.1</span>
      </div>
      <button
        class="ml-auto lg:hidden inline-flex items-center justify-center rounded-md h-8 w-8 hover:bg-lume-accent"
        @click="emit('close')"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M18 6 6 18" /><path d="m6 6 12 12" />
        </svg>
      </button>
    </div>

    <!-- Navigation -->
    <nav class="flex-1 overflow-y-auto py-3 px-3">
      <div v-for="section in sections" :key="section.title" class="mb-2">
        <button
          class="mb-1 w-full flex items-center justify-between rounded-md px-2 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-lume-muted-foreground/70 hover:text-lume-muted-foreground transition-colors"
          @click="toggleSection(section.title)"
        >
          <span>{{ section.title }}</span>
          <svg
            :class="['h-3 w-3 transition-transform', isExpanded(section.title) ? 'rotate-0' : '-rotate-90']"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </button>
        <ul v-show="isExpanded(section.title)" class="space-y-0.5">
          <li v-for="item in section.items" :key="item.id">
            <button
              :class="[
                'w-full flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors',
                isActive(item.id)
                  ? 'bg-lume-primary/10 text-lume-primary font-medium'
                  : 'text-lume-muted-foreground hover:bg-lume-accent hover:text-lume-accent-foreground'
              ]"
              @click="handleNav(item.id)"
            >
              <span class="flex-1 text-left">{{ item.label }}</span>
              <span v-if="item.badge" class="rounded-full bg-lume-muted px-1.5 py-0.5 text-[10px] font-medium">
                {{ item.badge }}
              </span>
            </button>
          </li>
        </ul>
      </div>
    </nav>

    <!-- Sidebar footer -->
    <div class="border-t p-3">
      <div class="rounded-lg bg-lume-muted/50 p-3">
        <p class="text-xs font-medium text-lume-foreground">Need help?</p>
        <p class="text-[11px] text-lume-muted-foreground mt-0.5">Check the docs for guides and API reference.</p>
        <a
          href="#"
          class="mt-2 inline-flex items-center text-xs font-medium text-lume-primary hover:underline"
        >
          View Docs
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="ml-1">
            <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
          </svg>
        </a>
      </div>
    </div>
  </aside>
</template>