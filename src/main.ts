import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import { vuetify } from './vuetify';
import { GesturePlugin } from '@vueuse/gesture';
import { MotionPlugin } from '@vueuse/motion';

const app = createApp(App);
app.use(vuetify);
app.use(GesturePlugin);
app.use(MotionPlugin);
app.mount('#app');
