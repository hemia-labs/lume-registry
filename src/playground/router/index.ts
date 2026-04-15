import { createRouter, createWebHistory } from 'vue-router'
import ComponentView from '../views/ComponentView.vue'

// Eager-load all meta.json files to get component list
const metaModules = import.meta.glob('../components/*/meta.json', {
  eager: true,
}) as Record<string, { default: { name: string; description?: string } }>

const componentList = Object.values(metaModules).map((m) => m.default.name)

// Create routes for each component
const routes = componentList.map((name) => ({
  path: `/${name}`,
  name,
  component: ComponentView,
  props: { componentName: name },
}))

// Add redirect from root to first component
const routesWithRedirect = [
  {
    path: '/',
    redirect: `/${componentList[0] || 'button'}`,
  },
  ...routes,
]

export const router = createRouter({
  history: createWebHistory(),
  routes: routesWithRedirect,
})