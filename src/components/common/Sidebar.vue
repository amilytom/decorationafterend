<template>
  <div class="sidebar">
    <el-menu
      class="sidebar-el-menu"
      :default-active="onRoutes"
      background-color="#324157"
      text-color="#bfcbd9"
      active-text-color="#20a0ff"
      unique-opened
      router
    >
      <template v-for="item in items">
        <template v-if="item.subs">
          <el-submenu :index="item.index" :key="item.index">
            <template slot="title">
              <i :class="item.icon"></i
              ><span slot="title">{{ item.title }}</span>
            </template>
            <template v-for="subItem in item.subs">
              <el-submenu
                v-if="subItem.subs"
                :index="subItem.index"
                :key="subItem.index"
              >
                <template slot="title">{{ subItem.title }}</template>
                <el-menu-item
                  v-for="(threeItem, i) in subItem.subs"
                  :key="i"
                  :index="threeItem.index"
                >
                  {{ threeItem.title }}
                </el-menu-item>
              </el-submenu>
              <el-menu-item v-else :index="subItem.index" :key="subItem.index">
                {{ subItem.title }}
              </el-menu-item>
            </template>
          </el-submenu>
        </template>
        <template v-else>
          <el-menu-item :index="item.index" :key="item.index">
            <i :class="item.icon"></i><span slot="title">{{ item.title }}</span>
          </el-menu-item>
        </template>
      </template>
    </el-menu>
  </div>
</template>

<script>
export default {
  data() {
    return {
      items: [
        {
          icon: "el-icon-lx-home",
          index: "dashboard",
          title: "系统首页",
        },
        {
          icon: "el-icon-lx-sort",
          index: "order",
          title: "预约管理",
        },
        {
          icon: "el-icon-lx-present",
          index: "event",
          title: "活动管理",
        },
        {
          icon: "el-icon-lx-cascades",
          index: "cate",
          title: "分类管理",
        },
        {
          icon: "el-icon-lx-text",
          index: "article",
          title: "文章管理",
        },
        {
          icon: "el-icon-lx-pic",
          index: "case",
          title: "案例管理",
        },
        {
          icon: "el-icon-lx-settings",
          index: "company",
          title: "企业信息管理",
        },
        {
          icon: "el-icon-lx-friend",
          index: "admin",
          title: "管理员管理",
        },
      ],
    };
  },
  computed: {
    onRoutes() {
      return this.$route.path.replace("/", "");
    },
  },
  created() {
    // 通过 Event Bus 进行组件间通信，来折叠侧边栏
    // bus.$on('collapse', msg => {
    //     this.collapse = msg;
    // })
  },
};
</script>

<style scoped>
.sidebar {
  display: block;
  position: absolute;
  left: 0;
  top: 70px;
  bottom: 0;
  overflow-y: scroll;
}

.sidebar::-webkit-scrollbar {
  width: 0;
}

.sidebar-el-menu:not(.el-menu--collapse) {
  width: 250px;
}

.sidebar > ul {
  height: 100%;
}
</style>
