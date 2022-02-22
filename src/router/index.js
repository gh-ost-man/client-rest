import { createRouter, createWebHistory } from 'vue-router'
import Role from "@/_helpers/_role.js";


const requireAuth = (to, from, next) => {
  const { authorize } = to.meta;

  if (authorize) {
    if (localStorage.user) {

      let user = JSON.parse(localStorage.user);

      let userRoles = user.roles ? user.roles.split(',') : null;
      let flag = false;

      if (!userRoles || userRoles === '') {
        next({ name: 'Forbidden' });
        return;
      }

      if (to.path === "/") {
        if (!userRoles.includes("Student")) {
          next({ name: 'ProfileAdmin' });
        } else {
          next({ name: 'ProfileStudent' });
        }
      } else {
        if (userRoles && userRoles !== '') {
          for (let role of userRoles) {
            if (authorize.includes(role)) {
              flag = true;
              break;
            }
          }

          if (flag) {
            next();
          } else {
            console.log("Forbidden 1");
            next({ name: 'Forbidden' });
          }
        } else {
          console.log("Forbidden 2");
          next({ name: 'Forbidden' });
          return;
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
    path: '/home',
    name: 'HomePage',
    component: () => import(/* webpackChunkName: "about" */ '../views/Home.vue'),
    beforeEnter: requireAuth,
    meta: {
      layout: 'home',
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
  {
    path: '/profile',
    name: 'ProfileStudent',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/profile'),
    beforeEnter: requireAuth,
    meta: {
      layout: 'home', authorize: ["Student"],
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
    children: [
      {
        path: '/d/users',
        name: 'UsersList',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "about" */ '../views/user/list.vue'),
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
    ]
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
    children: [
      {
        path: '/d/categories',
        name: 'CategoriesList',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "about" */ '../views/category/list.vue'),
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
    ]
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
    children: [
      {
        path: '/d/questions',
        name: 'QuestionsList',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "about" */ '../views/question/list.vue'),
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
    ]
  },


  /* Exams */
  {
    path: '/d/exams',
    name: 'Exams',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/exam/'),
    beforeEnter: requireAuth,
    meta: {
      layout: 'admin', authorize: ['Teacher'],
    },
    children: [
      {
        path: '/d/exams',
        name: 'ExamsList',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "about" */ '../views/exam/list.vue'),
        beforeEnter: requireAuth,
        meta: {
          layout: 'admin', authorize: ['Teacher'],
        },
      },
      {
        path: '/d/exams/create',
        name: 'CreateExam',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "about" */ '../views/exam/create.vue'),
        beforeEnter: requireAuth,
        meta: {
          layout: 'admin', authorize: ["Teacher"],
        },
      },
      {
        path: '/d/exams/edit/:id',
        name: 'EditExam',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "about" */ '../views/exam/edit.vue'),
        beforeEnter: requireAuth,
        meta: {
          layout: 'admin', authorize: ["Teacher"],
        },
        props: true
      },
    
      {
        path: '/d/exams/:id/questions',
        name: 'ExamQuestions',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "about" */ '../views/exam/listQuestions.vue'),
        beforeEnter: requireAuth,
        meta: {
          layout: 'admin', authorize: ["Teacher"],
        },
      },
    ]
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
