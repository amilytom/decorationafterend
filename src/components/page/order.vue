<template>
  <div class="table">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item
          ><i class="el-icon-lx-cascades"></i> {{ title }}</el-breadcrumb-item
        >
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="handle-box">
        <el-input
          v-model="searchName"
          placeholder="搜索预约姓名"
          class="handle-input mr10"
        ></el-input>
        <el-button type="primary" icon="search" @click="search">搜索</el-button>
      </div>
      <el-table
        :data="tableData"
        border
        class="table"
        ref="multipleTable"
        @selection-change="handleSelectionChange"
      >
        <el-table-column prop="id" label="预约id"> </el-table-column>
        <el-table-column prop="name" label="预约姓名" sortable>
        </el-table-column>
        <el-table-column prop="phone" label="电话" sortable> </el-table-column>
        <el-table-column prop="type" label="装修类型"> </el-table-column>
        <el-table-column prop="orderDate" label="预约日期"> </el-table-column>
        <el-table-column prop="message" label="留言"> </el-table-column>
        <el-table-column prop="status" label="状态">
          <template slot-scope="scope">
            <div v-if="scope.row.status == 0">未联系</div>
            <div v-if="scope.row.status == 1">已联系</div>
            <div v-if="scope.row.status == 2">已确定</div>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="创建时间"> </el-table-column>
        <el-table-column prop="message" label="操作">
          <template slot-scope="scope">
            <div>
              <el-button
                type="primary"
                @click="showUpdateStatus(scope.row.id, 1, '已联系')"
                v-if="scope.row.status == 0"
                >已联系</el-button
              >
            </div>
            <div style="margin-top: 10px">
              <el-button
                type="success"
                @click="showUpdateStatus(scope.row.id, 2, '已确定')"
                v-if="scope.row.status == 0 || scope.row.status == 1"
                >已确定</el-button
              >
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination
          background
          @current-change="handleCurrentChange"
          :page-size="rows"
          layout="prev, pager, next"
          :total="count"
        >
        </el-pagination>
      </div>
    </div>

    <!-- 修改状态提示框 -->
    <el-dialog
      title="修改预约状态提示"
      :visible.sync="updateStatusVisible"
      width="400px"
      center
    >
      <div class="del-dialog-cnt">
        你确定要修改预约状态为 {{ updateStatusName }} 吗？
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="updateStatusVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateStatus">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      title: this.$route.meta.title,
      tableData: [],
      curPage: 1,
      rows: 2,
      multipleSelection: [],
      select_cate: "",
      select_word: "",
      del_list: [],

      updateStatusVisible: false,
      editForm: {
        name: "",
        url: "",
        articleId: "",
        img: "",
      },
      addForm: {
        name: "",
        url: "",
        articleId: "",
        img: "",
      },
      idx: -1,
      count: 0,
      searchName: "",
      file: "",
      updateStatusStatus: "",
      updateStatusIndex: "",
      updateStatusName: "",
    };
  },
  created() {
    this.getData();
  },
  methods: {
    // 分页导航
    handleCurrentChange(val) {
      this.curPage = val;
      this.getData();
    },
    // 获取列表数据
    getData(search) {
      this.fetchData({
        method: "get",
        url: "/api/order",
        params: {
          page: search ? 1 : this.curPage,
          rows: this.rows,
          name: this.searchName,
        },
        success: (data) => {
          this.tableData = data.list;
          this.count = data.count;
        },
      });
    },
    search() {
      this.getData(true);
    },
    showUpdateStatus(index, status, name) {
      this.updateStatusIndex = index;
      this.updateStatusStatus = status;
      this.updateStatusName = name;
      this.updateStatusVisible = true;
    },
    delAll() {
      const length = this.multipleSelection.length;
      let str = "";
      this.del_list = this.del_list.concat(this.multipleSelection);
      for (let i = 0; i < length; i++) {
        str += this.multipleSelection[i].name + " ";
      }
      this.$message.error("删除了" + str);
      this.multipleSelection = [];
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // 修改
    updateStatus() {
      let vm = this;
      this.fetchData({
        method: "put",
        url: "/api/order/status",
        data: {
          id: vm.updateStatusIndex,
          status: vm.updateStatusStatus,
        },
        success: (data) => {
          this.$message.success(`修改成功`);
          this.updateStatusVisible = false;
          this.getData();
        },
      });

      // this.$set(this.tableData, this.idx, this.form);
      // this.editVisible = false;
    },
    // 确定删除
    deleteRow() {
      this.fetchData({
        method: "delete",
        url: "/api/order",
        data: {
          id: this.tableData[this.idx].id,
        },
        success: (data) => {
          this.$message.success("删除成功");
          this.delVisible = false;
          this.getData();
        },
      });
    },
  },
};
</script>

<style scoped>
.handle-box {
  margin-bottom: 20px;
}

.handle-select {
  width: 120px;
}

.handle-input {
  width: 300px;
  display: inline-block;
}

.del-dialog-cnt {
  font-size: 16px;
  text-align: center;
}

.table {
  width: 100%;
  font-size: 14px;
}

.red {
  color: #ff0000;
}

.mr10 {
  margin-right: 10px;
}
</style>
