import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

const router = new Router({
  routes: [
    {
      path: "/",
      redirect: "/login",
    },
    {
      path: "/",
      component: () => import("../components/common/Home.vue"),
      meta: { title: "自述文件" },
      children: [
        {
          path: "/dashboard",
          component: () => import("../components/page/dashboard.vue"),
          meta: { title: "系统首页" },
        },
        {
          path: "/event",
          component: () => import("../components/page/event.vue"),
          meta: { title: "活动管理" },
        },
        {
          path: "/order",
          component: () => import("../components/page/order.vue"),
          meta: { title: "预约管理" },
        },
        {
          path: "/cate",
          component: () => import("../components/page/cate.vue"),
          meta: { title: "分类管理" },
        },
        {
          path: "/article",
          component: () => import("../components/page/article.vue"),
          meta: { title: "文章管理" },
        },
        {
          path: "/case",
          component: () => import("../components/page/case.vue"),
          meta: { title: "案例管理" },
        },
        {
          path: "/company",
          component: () => import("../components/page/company.vue"),
          meta: { title: "企业信息管理" },
        },
        {
          path: "/admin",
          component: () => import("../components/page/admin.vue"),
          meta: { title: "管理员管理" },
        },
      ],
    },
    {
      path: "/login",
      component: () => import("../components/page/login.vue"),
    },
    {
      path: "*",
      redirect: "/404",
    },
  ],
});

export default router;

//使用钩子函数对路由进行权限跳转
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("token");
  if (!token && to.path !== "/login") {
    next("/login");
  }
  next();
  // if(to.path == '/admin'){
  //   // role === 1 ? next() : next('/403');
  //   next('/admin')
  // }
  // else if (to.meta.permission) {
  //   // 如果是管理员权限则可进入，这里只是简单的模拟管理员权限而已
  //   // role === 'admin' ? next() : next('/403');
  // }
  // else {
  //   // 简单的判断IE10及以下不进入富文本编辑器，该组件不兼容
  //   if (navigator.userAgent.indexOf('MSIE') > -1 && to.path === '/editor') {
  //     Vue.prototype.$alert('vue-quill-editor组件不兼容IE10及以下浏览器，请使用更高版本的浏览器查看', '浏览器不兼容通知', {
  //       confirmButtonText: '确定'
  //     });
  //   } else {
  //     next();
  //   }
  // }
});
