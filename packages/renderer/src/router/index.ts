import { createMemoryHistory, createRouter } from 'vue-router'
import routes from '~pages'

const router = createRouter({
  // ...
  history: createMemoryHistory(),
  routes,
})

export default router
