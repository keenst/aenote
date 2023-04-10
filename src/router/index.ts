import { createRouter, createWebHistory } from 'vue-router'
import NotesPage from '../components/NotesPage.vue'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'

const routes: any[] = [
    {
        path: '/',
        name: 'Home',
        component: Home
    },
    {
        path: '/notes',
        name: 'NotesPage',
        component: NotesPage
    },
    {
        path: '/login',
        name: 'Login',
        component: Login
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router