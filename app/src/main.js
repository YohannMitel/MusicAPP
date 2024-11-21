import { createApp } from 'vue'
import App from './App.vue'
// Importer le CSS de Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'



import { createRouter, createWebHistory } from 'vue-router'
import {routes} from "./routes.js"
import VueApexCharts from "vue3-apexcharts";

const router = createRouter({
    history: createWebHistory(),
    routes,
})

const app = createApp(App)

app.use(router)
app.use(VueApexCharts);
app.mount('#app')
