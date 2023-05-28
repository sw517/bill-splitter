import './assets/main.css';

import { createApp } from 'vue';
import { createPinia } from 'pinia';

// Vuetify
import '@mdi/font/css/materialdesignicons.css';
import 'vuetify/styles';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';

const vuetify = createVuetify({
  components,
  directives,
});

import App from './App.vue';

const app = createApp(App);

app.use(createPinia());
app.use(vuetify);
app.mount('#app');
