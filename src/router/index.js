import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Dashboard from '../views/Dashboard.vue'
import Login from '../views/login/Login.vue'
import SignUp from '../views/login/SignUp.vue'
import Admin from '../views/admin/Admin.vue'
import Users from '../views/admin/Users.vue'
import Activity from '../views/admin/Activity.vue'
import Profile from '../views/Profile.vue'
import Upload from '../views/Upload.vue'
import EmailConfirmation from '../views/login/EmailConfirmation.vue'

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
    path: '/upload',
    component: Upload
  },
  {
    path: '/dashboard',
    component: Dashboard
  },
  {
    path: '/admin',
    component: Admin,
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
      }
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

export default router