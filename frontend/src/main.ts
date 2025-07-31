import Router from './plugins/router';
import { createApp } from 'vue';
import { VueQueryPlugin } from '@tanstack/vue-query';
import App from './App.vue';

import './index.css';

const app = createApp(App);
app.use(VueQueryPlugin);
app.use(Router);
app.mount('#root');
