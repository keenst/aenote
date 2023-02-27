import { createRouter, createWebHistory } from 'vue-router'

import Editor from '/src/components/Editor.vue'
import Page1 from '/src/components/page1.vue'
import Page2 from '/src/components/page2.vue'

const routes = [
    {
        path: '/editor',
        name: 'Editor',
        component: Editor
    },
    {
        path: '/page1',
        name: 'Page1',
        component: Page1
    },
    {
        path: '/page2',
        name: 'Page2',
        component: Page2
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router