import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/login/Login.vue'
import SignUp from '../views/login/SignUp.vue'
import Admin from '../views/admin/Admin.vue'
import Users from '../views/admin/Users.vue'
import Activity from '../views/admin/Activity.vue'
import Profile from '../views/Profile.vue'
import Upload from '../views/Upload.vue'

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
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
