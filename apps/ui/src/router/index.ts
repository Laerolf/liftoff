import { createRouter, createWebHistory } from 'vue-router'

import { localeGuard, pageTitleGuard } from '@/middleware/guards'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: () => import('@/layouts/DefaultLayout.vue'),
      children: [
        {
          path: '',
          redirect: { name: 'flightPlanOverview' }
        },
        {
          path: 'flight-plans',
          children: [
            {
              name: 'flightPlanOverview',
              path: '',
              component: () => import('@/pages/flightPlans/OverviewPage.vue'),
              meta: { titleLocaleKey: 'pages.flightPlans.overview.title', isNavigationLink: true }
            },
            {
              name: 'flightPlanCreation',
              path: 'new',
              component: () => import('@/pages/flightPlans/CreationPage.vue'),
              meta: { titleLocaleKey: 'pages.flightPlans.creation.title' }
            }
          ]
        }
      ]
    }
  ]
})

router.beforeEach(localeGuard)
router.beforeEach(pageTitleGuard)

export default router
