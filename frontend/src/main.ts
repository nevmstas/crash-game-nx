import router from './router';
import { createApp } from 'vue';
import { VueQueryPlugin } from '@tanstack/vue-query'
import App from './app/App.vue';

import './index.css'

const app = createApp(App);
app.use(VueQueryPlugin)
app.use(router);
app.mount('#root');
