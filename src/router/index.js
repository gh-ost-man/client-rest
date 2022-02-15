import { createRouter, createWebHistory } from 'vue-router'
import Role from "@/_helpers/_role.js";


const requireAuth = (to, from, next) => {
  const { authorize } = to.meta;
  
   console.log(to);

  if (authorize) {
    if (localStorage.user) {

      let user = JSON.parse(localStorage.user);

      let userRoles = user.roles ? user.roles.split(',') : null;
      let flag = false;

      if(to.path === "/") {
        if(!userRoles.includes("Student")) {
          next({name: 'ProfileAdmin'});
        } 
      } else {
        if (userRoles) {
          userRoles.forEach(role => {
            if (authorize.includes(role)) {
              flag = true;
            }
          });
  
          if (flag) {
            next();
          } else {
            console.log("Forbidden 1");
            next({ name: 'Forbidden' });
          }
        } else {
          console.log("Forbidden 2");
          next({ name: 'Forbidden' });
        }
      }

    
    } else {
      next({ name: 'Login' });
    }
  } else {
    next();
  }
}

const routes = [
  { 
    path: '/:pathMatch(.*)*', 
    component: () => import(/* webpackChunkName: "about" */ '../views/error/notfound'),
    meta: {
      layout: 'default'
    }
   },
  {
    path: '/',
    name: 'Home',
    component: () => import(/* webpackChunkName: "about" */ '../views/Home.vue'),
    beforeEnter: requireAuth,
    meta: {
      layout: 'home', authorize: ["Student"],
    }
  },
  {
    path: '/error/forbidden',
    name: 'Forbidden',
    component: () => import(/* webpackChunkName: "about" */ '../views/error/forbidden'),
    meta: { layout: 'default' }
    
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '/login',
    name: 'Login',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/auth/Login')
  },
  {
    path: '/register',
    name: 'Register',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/auth/Register')
  },
  {
    path: '/d/profile',
    name: 'ProfileAdmin',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/profile'),
    beforeEnter: requireAuth,
    meta: {
      layout: 'admin', authorize: ["Admin", "Manager", "Teacher"],
    }
  },

  /* Users */
  {
    path: '/d/users',
    name: 'Users',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/user/'),
    beforeEnter: requireAuth,
    meta: {
      layout: 'admin', authorize: ["Admin", "Manager"],
    },
  },
  {
    path: '/d/users/create',
    name: 'CreateUser',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/user/create.vue'),
    beforeEnter: requireAuth,
    meta: {
      layout: 'admin', authorize: ["Admin"],
    },
  },
  {
    path: '/d/users/edit/:id',
    name: 'EditUser',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/user/edit.vue'),
    beforeEnter: requireAuth,
    meta: {
      layout: 'admin', authorize: ["Admin"],
    },
  },

  /* Categories */
  {
    path: '/d/categories',
    name: 'Categories',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/category/'),
    beforeEnter: requireAuth,
    meta: {
      layout: 'admin', authorize: ['Teacher'],
    },
  },
  {
    path: '/d/categories/create',
    name: 'CreateCategory',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/category/create.vue'),
    beforeEnter: requireAuth,
    meta: {
      layout: 'admin', authorize: ["Teacher"],
    },
  },
  {
    path: '/d/categories/edit/:id',
    name: 'EditCategory',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/category/edit.vue'),
    beforeEnter: requireAuth,
    meta: {
      layout: 'admin', authorize: ["Teacher"],
    },
  },

    /* Questions */
    {
      path: '/d/questions',
      name: 'Questions',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ '../views/question/'),
      beforeEnter: requireAuth,
      meta: {
        layout: 'admin', authorize: ['Teacher'],
      },
    },
    {
      path: '/d/questions/create',
      name: 'CreateQuestion',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ '../views/question/create.vue'),
      beforeEnter: requireAuth,
      meta: {
        layout: 'admin', authorize: ["Teacher"],
      },
    },
    {
      path: '/d/questions/edit/:categoryId/:id',
      name: 'EditQuestion',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ '../views/question/edit.vue'),
      beforeEnter: requireAuth,
      meta: {
        layout: 'admin', authorize: ["Teacher"],
      },
      props: true
    },

    /* Tests */
    {
      path: '/d/tests',
      name: 'Tests',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ '../views/test/'),
      beforeEnter: requireAuth,
      meta: {
        layout: 'admin', authorize: ['Teacher'],
      },
    },
    {
      path: '/d/tests/create',
      name: 'CreateTest',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ '../views/test/create.vue'),
      beforeEnter: requireAuth,
      meta: {
        layout: 'admin', authorize: ["Teacher"],
      },
    },
    {
      path: '/d/tests/edit/:id',
      name: 'EditTest',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ '../views/test/edit.vue'),
      beforeEnter: requireAuth,
      meta: {
        layout: 'admin', authorize: ["Teacher"],
      },
      props: true
    },

    {
      path: '/d/tests/:id/questions',
      name: 'TestQuestions',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ '../views/test/listQuestions.vue'),
      beforeEnter: requireAuth,
      meta: {
        layout: 'admin', authorize: ["Teacher"],
      },
    },


]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
