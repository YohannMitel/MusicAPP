import Home from './views/Home.vue'
import WarmUp from './views/WarmUp.vue'
import GuitarHero from './views/GuitarHero.vue'
import c from './views/c.vue'
export const routes = [
    {
        path: '/', component: Home,  name:"Home",

    },
    {
        path: '/game1', component: WarmUp,  name:"WarmUp",

    },
    {
        path: '/game2', component: GuitarHero,  name:"GuitarHero",

    },
    {
        path: '/test', component: c,  name:"s",

    }

]