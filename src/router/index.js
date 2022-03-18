import { createRouter, createWebHistory } from 'vue-router'
import Role from "@/_helpers/_role.js";
import { decryptData } from "../_helpers/crypto";

const requireAuth = (to, from, next) => {
  const { authorize } = to.meta;

  if (authorize) {
    if (localStorage.auth) {

      let user = JSON.parse(decryptData(localStorage.auth));

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
    path: '/home1',
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
    path: '/home',
    name: 'HomeStudent',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/student/'),
    beforeEnter: requireAuth,
    meta: {
      layout: 'home', authorize: ["Student"],
    }
  },
  {
    path: '/d/home',
    name: 'HomeAdmin',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/admin/'),
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
  {
    path: '/history',
    name: 'HistoryStudent',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/student/history/'),
    beforeEnter: requireAuth,
    meta: {
      layout: 'home', authorize: ["Student"],
    }
  },
  {
    path: '/exams',
    name: 'ExamsStudent',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/student/exam/index.vue'),
    beforeEnter: requireAuth,
    meta: {
      layout: 'home', authorize: ["Student"],
    }
  },
  {
    path: '/passExam/:idExam',
    name: 'PassExamStudent',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/student/exam/Pass.vue'),
    beforeEnter: requireAuth,
    meta: {
      layout: 'home', authorize: ["Student"],
    },
    props: true
  },
  {
    path: '/result/:idReport',
    name: 'ExamResult',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/student/exam/Result.vue'),
    beforeEnter: requireAuth,
    meta: {
      layout: 'home', authorize: ["Student"],
    },
    props: true
  },

  /* Users */
  {
    path: '/d/users',
    name: 'Users',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/admin/user/'),
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
        component: () => import(/* webpackChunkName: "about" */ '../views/admin/user/list.vue'),
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
        component: () => import(/* webpackChunkName: "about" */ '../views/admin/user/create.vue'),
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
        component: () => import(/* webpackChunkName: "about" */ '../views/admin/user/edit.vue'),
        beforeEnter: requireAuth,
        meta: {
          layout: 'admin', authorize: ["Admin"],
        },
      },
      {
        path: '/d/users/e/:id/',
        name: 'UserExams',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "about" */ '../views/admin/user/listExams.vue'),
        beforeEnter: requireAuth,
        meta: {
          layout: 'admin', authorize: ["Manager"],
        },
        props: true
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
    component: () => import(/* webpackChunkName: "about" */ '../views/admin/category/'),
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
        component: () => import(/* webpackChunkName: "about" */ '../views/admin/category/list.vue'),
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
        component: () => import(/* webpackChunkName: "about" */ '../views/admin/category/create.vue'),
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
        component: () => import(/* webpackChunkName: "about" */ '../views/admin/category/edit.vue'),
        beforeEnter: requireAuth,
        meta: {
          layout: 'admin', authorize: ["Teacher"],
        },
        props: true
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
    component: () => import(/* webpackChunkName: "about" */ '../views/admin/question/'),
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
        component: () => import(/* webpackChunkName: "about" */ '../views/admin/question/list.vue'),
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
        component: () => import(/* webpackChunkName: "about" */ '../views/admin/question/create.vue'),
        beforeEnter: requireAuth,
        meta: {
          layout: 'admin', authorize: ["Teacher"],
        },
      },
      {
        path: '/d/questions/edit/:id',
        name: 'EditQuestion',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "about" */ '../views/admin/question/edit.vue'),
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
    component: () => import(/* webpackChunkName: "about" */ '../views/admin/exam/'),
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
        component: () => import(/* webpackChunkName: "about" */ '../views/admin/exam/list.vue'),
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
        component: () => import(/* webpackChunkName: "about" */ '../views/admin/exam/create.vue'),
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
        component: () => import(/* webpackChunkName: "about" */ '../views/admin/exam/edit.vue'),
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
        component: () => import(/* webpackChunkName: "about" */ '../views/admin/exam/listQuestions.vue'),
        beforeEnter: requireAuth,
        meta: {
          layout: 'admin', authorize: ["Teacher"],
        },
      },

    ]
  },

  /* Reports */
  {
    path: '/d/reports',
    name: 'Reports',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/admin/report/all/'),
    beforeEnter: requireAuth,
    meta: {
      layout: 'admin',
    },
    children: [
      {
        path: '/d/reports',
        name: 'ReportsList',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "about" */ '../views/admin/report/all/list.vue'),
        beforeEnter: requireAuth,
        meta: {
          layout: 'admin', authorize: ['Manager'],
        },
      },
      {
        path: '/d/reports/details/:idReport',
        name: 'ReportsDetails',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "about" */ '../views/admin/report/all/details.vue'),
        beforeEnter: requireAuth,
        meta: {
          layout: 'admin', authorize: ['Manager'],
        },
        props: true,
      },

    ]
  },
  {
    path: '/d/reports/e/',
    name: 'ReportsByExam',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/admin/report/byExam/'),
    beforeEnter: requireAuth,
    meta: {
      layout: 'admin',
    },
    children: [
      {
        path: '/d/reports/e/',
        name: 'ReportsByExamList',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "about" */ '../views/admin/report/byExam/list.vue'),
        beforeEnter: requireAuth,
        meta: {
          layout: 'admin', authorize: ['Manager'],
        },
      },
      {
        path: '/d/reports/e/:idExam',
        name: 'ReportByExamDetails',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "about" */ '../views/admin/report/byExam/details.vue'),
        beforeEnter: requireAuth,
        meta: {
          layout: 'admin', authorize: ['Manager'],
        },
        props: true
      },
    ]
  }


]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
