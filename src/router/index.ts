import { createRouter, createWebHistory } from 'vue-router'

import Editor from '/src/components/Editor.vue'

const routes = [
    {
        path: '/',
        name: 'Editor',
        component: Editor
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router