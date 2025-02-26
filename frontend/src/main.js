import { createApp } from 'vue';
import App from './App.vue';
import router from "./router"

import PrimeVue from 'primevue/config';
import 'primeicons/primeicons.css'; // Icons
import Lara from '@primevue/themes/lara';

import './assets/main.css'

const app = createApp(App);

app.use(router)
app.use(PrimeVue, {
    theme:{
        preset: Lara,
        options: {
            darkModeSelector: '.app-dark'
        }
    }
});
app.mount('#app');
