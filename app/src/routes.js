import Home from './views/Home.vue'
import WarmUp from './views/WarmUp.vue'
export const routes = [
    {
        path: '/', component: Home,  name:"Home",

    },
    {
        path: '/game1', component: WarmUp,  name:"WarmUp",

    }

]