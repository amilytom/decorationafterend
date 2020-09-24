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
          placeholder="搜索分类名称"
          class="handle-input mr10"
        ></el-input>
        <el-button type="primary" icon="search" @click="search">搜索</el-button>
        <el-button type="primary" icon="search" @click="handleAdd"
          >添加</el-button
        >
      </div>
      <el-table
        :data="tableData"
        border
        class="table"
        ref="multipleTable"
        @selection-change="handleSelectionChange"
      >
        <el-table-column prop="id" label="分类id"> </el-table-column>
        <el-table-column prop="name" label="分类名称" sortable>
        </el-table-column>
        <el-table-column prop="name" label="图片" sortable>
          <template slot-scope="scope">
            <img :src="scope.row.img" min-width="60" height="60" />
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="创建时间"> </el-table-column>
        <el-table-column label="操作" width="180" align="center">
          <template slot-scope="scope">
            <el-button
              type="text"
              icon="el-icon-edit"
              @click="handleEdit(scope.$index, scope.row)"
              >修改</el-button
            >
            <el-button
              type="text"
              icon="el-icon-delete"
              class="red"
              @click="handleDelete(scope.$index, scope.row)"
              >删除
            </el-button>
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

    <!-- 添加弹出框 -->
    <el-dialog title="添加分类" :visible.sync="addVisible" width="40%">
      <el-form ref="form" :model="addForm" label-width="100px">
        <el-form-item label="分类名称">
          <el-input v-model="addForm.name"></el-input>
        </el-form-item>
        <el-form-item label="图片">
          <img :src="addForm.img" class="pre-img" style="width: 50%" />
          <div class="crop-demo-btn">
            选择图片
            <input
              class="crop-input"
              type="file"
              name="image"
              accept="image/*"
              @change="setImage($event, 1)"
            />
          </div>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveAdd">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑弹出框 -->
    <el-dialog title="修改分类" :visible.sync="editVisible" width="40%">
      <el-form ref="form" :model="editForm" label-width="100px">
        <el-form-item label="分类名称">
          <el-input v-model="editForm.name"></el-input>
        </el-form-item>
        <el-form-item label="图片">
          <img :src="editForm.img" class="pre-img" style="width: 50%" />
          <div class="crop-demo-btn">
            选择图片
            <input
              class="crop-input"
              type="file"
              name="image"
              accept="image/*"
              @change="setImage($event, 2)"
            />
          </div>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveEdit">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 删除提示框 -->
    <el-dialog
      title="删除分类提示"
      :visible.sync="delVisible"
      width="300px"
      center
    >
      <div class="del-dialog-cnt">删除不可恢复，是否确定删除？</div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="delVisible = false">取 消</el-button>
        <el-button type="primary" @click="deleteRow">确 定</el-button>
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
      addVisible: false,
      editVisible: false,
      delVisible: false,
      editForm: {
        name: "",
        img: "",
      },
      addForm: {
        name: "",
        img: "",
      },
      idx: -1,
      count: 0,
      searchName: "",
    };
  },
  created() {
    this.getData();
  },
  methods: {
    setImage(e, addOrUpdate) {
      const file = e.target.files[0];
      this.file = file;
      if (!file.type.includes("image/")) {
        return;
      }
      this.upload(addOrUpdate);
    },
    upload(addOrUpdate) {
      var form = new FormData();
      form.append("img", this.file);
      this.fetchData({
        method: "post",
        url: "/api/upload",
        data: form,
        success: (data) => {
          if (addOrUpdate == 1) {
            this.addForm.img = data.path;
          } else {
            this.editForm.img = data.path;
          }
        },
      });
    },
    // 分页导航
    handleCurrentChange(val) {
      this.curPage = val;
      this.getData();
    },
    // 获取列表数据
    getData(search) {
      this.fetchData({
        method: "get",
        url: "/api/cate",
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
    handleAdd() {
      this.addVisible = true;
    },
    handleEdit(index, row) {
      this.idx = index;
      const item = this.tableData[index];
      this.editForm = {
        id: item.id,
        name: item.name,
        img: item.img,
      };
      this.editVisible = true;
    },
    handleDelete(index, row) {
      this.idx = index;
      this.delVisible = true;
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
    // 添加
    saveAdd() {
      this.fetchData({
        method: "post",
        url: "/api/cate/",
        data: this.addForm,
        success: (data) => {
          this.$message.success(`添加成功`);
          this.addVisible = false;
          this.getData();
        },
      });
    },
    // 修改
    saveEdit() {
      this.fetchData({
        method: "put",
        url: "/api/cate",
        data: this.editForm,
        success: (data) => {
          this.$message.success(`修改成功`);
          this.editVisible = false;
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
        url: "/api/cate",
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
