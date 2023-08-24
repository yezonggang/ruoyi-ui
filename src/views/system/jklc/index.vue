<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="拱顶下沉" prop="gdxc">
        <el-input
          v-model="queryParams.gdxc"
          placeholder="请输入拱顶下沉"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="周边收敛" prop="zbsl">
        <el-input
          v-model="queryParams.zbsl"
          placeholder="请输入周边收敛"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="拱脚下沉" prop="gjxc">
        <el-input
          v-model="queryParams.gjxc"
          placeholder="请输入拱脚下沉"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="渗水压力" prop="scyl">
        <el-input
          v-model="queryParams.scyl"
          placeholder="请输入渗水压力"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="层间压力" prop="cjyl">
        <el-input
          v-model="queryParams.cjyl"
          placeholder="请输入层间压力"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="供架内力" prop="gjnl">
        <el-input
          v-model="queryParams.gjnl"
          placeholder="请输入供架内力"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="砼内力" prop="tnl">
        <el-input
          v-model="queryParams.tnl"
          placeholder="请输入砼内力"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="锚杆轴力" prop="mgzl">
        <el-input
          v-model="queryParams.mgzl"
          placeholder="请输入锚杆轴力"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="围岩内移" prop="wynbwy">
        <el-input
          v-model="queryParams.wynbwy"
          placeholder="请输入围岩内移"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="相关建议" prop="xgjy">
        <el-input
          v-model="queryParams.xgjy"
          placeholder="请输入相关建议"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['system:jklc:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['system:jklc:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['system:jklc:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['system:jklc:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="jklcList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="id" align="center" prop="id" />
      <el-table-column label="拱顶下沉" align="center" prop="gdxc" />
      <el-table-column label="周边收敛" align="center" prop="zbsl" />
      <el-table-column label="拱脚下沉" align="center" prop="gjxc" />
      <el-table-column label="渗水压力" align="center" prop="scyl" />
      <el-table-column label="层间压力" align="center" prop="cjyl" />
      <el-table-column label="供架内力" align="center" prop="gjnl" />
      <el-table-column label="砼内力" align="center" prop="tnl" />
      <el-table-column label="锚杆轴力" align="center" prop="mgzl" />
      <el-table-column label="围岩内移" align="center" prop="wynbwy" />
      <el-table-column label="相关建议" align="center" prop="xgjy" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:jklc:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:jklc:remove']"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改监控量测对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="拱顶下沉" prop="gdxc">
          <el-input v-model="form.gdxc" placeholder="请输入拱顶下沉" />
        </el-form-item>
        <el-form-item label="周边收敛" prop="zbsl">
          <el-input v-model="form.zbsl" placeholder="请输入周边收敛" />
        </el-form-item>
        <el-form-item label="拱脚下沉" prop="gjxc">
          <el-input v-model="form.gjxc" placeholder="请输入拱脚下沉" />
        </el-form-item>
        <el-form-item label="渗水压力" prop="scyl">
          <el-input v-model="form.scyl" placeholder="请输入渗水压力" />
        </el-form-item>
        <el-form-item label="层间压力" prop="cjyl">
          <el-input v-model="form.cjyl" placeholder="请输入层间压力" />
        </el-form-item>
        <el-form-item label="供架内力" prop="gjnl">
          <el-input v-model="form.gjnl" placeholder="请输入供架内力" />
        </el-form-item>
        <el-form-item label="砼内力" prop="tnl">
          <el-input v-model="form.tnl" placeholder="请输入砼内力" />
        </el-form-item>
        <el-form-item label="锚杆轴力" prop="mgzl">
          <el-input v-model="form.mgzl" placeholder="请输入锚杆轴力" />
        </el-form-item>
        <el-form-item label="围岩内移" prop="wynbwy">
          <el-input v-model="form.wynbwy" placeholder="请输入围岩内移" />
        </el-form-item>
        <el-form-item label="相关建议" prop="xgjy">
          <el-input v-model="form.xgjy" placeholder="请输入相关建议" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listJklc, getJklc, delJklc, addJklc, updateJklc } from "@/api/system/jklc";

export default {
  name: "Jklc",
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 监控量测表格数据
      jklcList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        gdxc: null,
        zbsl: null,
        gjxc: null,
        scyl: null,
        cjyl: null,
        gjnl: null,
        tnl: null,
        mgzl: null,
        wynbwy: null,
        xgjy: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询监控量测列表 */
    getList() {
      this.loading = true;
      listJklc(this.queryParams).then(response => {
        this.jklcList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        gdxc: null,
        zbsl: null,
        gjxc: null,
        scyl: null,
        cjyl: null,
        gjnl: null,
        tnl: null,
        mgzl: null,
        wynbwy: null,
        wddz: null,
        xgjy: null
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加监控量测";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getJklc(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改监控量测";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateJklc(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addJklc(this.form).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$modal.confirm('是否确认删除监控量测编号为"' + ids + '"的数据项？').then(function() {
        return delJklc(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('system/jklc/export', {
        ...this.queryParams
      }, `jklc_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
