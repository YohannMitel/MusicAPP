import Home from './views/Home.vue'
import WarmUp from './views/WarmUp.vue'
import GuitarHero from './views/GuitarHero.vue'
import Chachacha from './views/Chachacha.vue'
export const routes = [
    {
        path: '/', component: Home,  name:"Home",

    },
    {
        path: '/game1', component: WarmUp,  name:"WarmUp" , props: true 

    },
    {
        path: '/game2', component: GuitarHero,  name:"GuitarHero", props: true ,

    },
    {
        path: '/game3', component: Chachacha,  name:"Chachacha", props: true 
 
    }

]