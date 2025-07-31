import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../pages/Home.vue';

const Router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: HomeView,
    },
  ],
});

export default Router;
