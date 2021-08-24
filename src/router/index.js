import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Dashboard from '../views/Dashboard.vue'
import Login from '../views/login/Login.vue'
import SignUp from '../views/login/SignUp.vue'
import Admin from '../views/admin/Admin.vue'
import Users from '../views/admin/Users.vue'
import Activity from '../views/admin/Activity.vue'
import Pending from '../views/admin/Pending.vue'
import Profile from '../views/Profile.vue'
import EmailConfirmation from '../views/login/EmailConfirmation.vue'
import authService from "@/services/authService";

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: Home
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/signup',
    component: SignUp
  },
  {
    path: '/profile',
    component: Profile
  },
  {
    path: '/dashboard',
    component: Dashboard,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/admin',
    component: Admin,
    meta: {
      requiresAuth: true
    },
    children: [
      {
        path: 'users',
        name: 'manageUsers',
        component: Users
      },
      {
        path: 'activity',
        name: 'activity',
        component: Activity
      },
      {
        path: '/pending',
        name: 'pending',
        component: Pending
      },
    ]
  },
  {
    path: '/emailconfirmation/:confirmationCode',
    component: EmailConfirmation
  }
]

const router = new VueRouter({
  base: process.env.BASE_URL,
  routes
});

router.beforeEach((to, from, next) => {
  if(to.matched.some(record => record.meta.requiresAuth)) {
      if (!authService.isUserLogged()) {
          next({
              path: '/login',
              params: { nextUrl: to.fullPath }
          });
      } else {
        next();
      }
  } else {
    next();
  }
})

export default router