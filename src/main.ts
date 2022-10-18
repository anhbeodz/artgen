import { createApp } from 'vue'
import './tailwind.css'
import './artgen.css'
import App from './App.vue'
import { createHead } from '@vueuse/head'
import store from "./store";
import router from "./router/index";


const app = createApp({
  render: () => h(App),
}); 

const head = createHead()
app.use(router)
app.use(head)
app.use(store)
.mount(document.body)
