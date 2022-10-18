import { createRouter, createWebHistory } from "vue-router";
import Home from '../pages/index.vue'
import Login from '../pages/login.vue'
import List from '../pages/list.vue'
const routes = [
  { 
    path: "/", 
    component: Home, 
  },
  {
    path: "/login",
    component: Login,
    // meta: {
    //   needAuth: true,
    //   title: 'Login'
    // } 
  },
  {
    path: "/list",
    component: List,
  },
  
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to, from, next) => {
  if(to.meta.needAuth) {
    if(sessionStorage.getItem('token')) {
      next()
    } else {
      next("/login")
    }
  } else {
    next()
  }
 
})

export default router;