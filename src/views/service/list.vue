<template>
  <div class="container">
    <div class="header">
      <div class="search">
        <div class="search-item">
          <span class="label">服务名称</span>
          <el-input
            v-model="search.service_name"
            size="medium"
            placeholder="输入服务名称搜索"
            clearable
            style="width: 200px"
            @change="getList"
          />
        </div>

        <div class="search-item">
          <span class="label">服务类型</span>
          <el-select
            v-model="search.language"
            size="medium"
            @change="getList"
          >
            <el-option
              v-for="p in languageMap"
              :key="p.key"
              :label="p.label"
              :value="p.key"
            />
          </el-select>
        </div>
      </div>
      <div class="buttons">
        <el-button
          size="medium"
          type="primary"
          @click="getList"
        >查询</el-button>
        <el-button size="medium" @click="resetSearch">重置</el-button>
      </div>
    </div>
    <div class="content">
      <div class="buttons">
        <el-button
          size="medium"
          type="primary"
          @click="handleCreate"
        >+创建服务</el-button>
        <el-button
          size="medium"
          :disabled="selectServices.length !== 1"
          @click="handleEdit"
        >编辑</el-button>
      </div>
      <div class="table">
        <el-table
          v-loading="listLoading"
          :data="serviceList"
          border
          fit
          highlight-current-row
          size="medium"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="50px" />
          <el-table-column label="序号" width="50px">
            <template slot-scope="{ row }">
              <span>{{ row.service_id }}</span>
            </template>
          </el-table-column>
          <el-table-column label="服务名称" min-width="60px">
            <template slot-scope="{ row }">
              <el-button type="text" @click="goTemplateIndex(row)">{{ row.service_name }}</el-button>
            </template>
          </el-table-column>
          <el-table-column label="服务类型" min-width="50px">
            <template slot-scope="{ row }">
              <span>{{ row.language }}</span>
            </template>
          </el-table-column>
          <el-table-column label="镜像库地址" width="150px">
            <template slot-scope="{ row }">
              {{ row.image_url }}
            </template>
          </el-table-column>
          <el-table-column label="扩缩容流程" width="150px">
            <template slot-scope="{ row }">
              {{ row.tmpl_expand_name }}
            </template>
          </el-table-column>
          <el-table-column label="自动扩缩容策略" min-width="60px">
            <template slot-scope="{ row }">
              <el-switch
                v-model="row.auto_decision"
                active-color="#13ce66"
                inactive-color="#ff4949"
                active-value="on"
                inactive-value="off"
                disabled
              />
              {{ row.auto_decision === 'on' ? "开启" : "关闭" }}
            </template>
          </el-table-column>
          <el-table-column label="扩缩容状态" min-width="50px">
            <template slot-scope="{ row }">
              <span>{{ row.task_type_status | taskTypeStatus }} </span>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                type="text"
                @click="process(scope.row)"
              >扩缩容</el-button>
              <el-button
                type="text"
                @click="processHistory(scope.row)"
              >扩缩容历史</el-button>
            </template>
          </el-table-column>
        </el-table>
        <pagination
          v-show="total > 0"
          :total="total"
          :page.sync="listQuery.page_num"
          :limit.sync="listQuery.page_size"
          @pagination="getList"
        />
      </div>
    </div>

    <el-dialog title="编辑服务" :visible="editServiceDialogVisible" width="30%" @close="cancelEditServiceDialog">
      <el-form
        ref="editServiceDialogForm"
        :model="editServiceDialogForm"
        label-width="100px"
      >
        <el-form-item label="服务描述">
          <el-input
            v-model="editServiceDialogForm.description"
            type="textarea"
            :rows="3"
            placeholder="请输入服务描述"
            style="width:230px"
          />
        </el-form-item>
        <el-form-item style="margin-left:5%">
          <el-button type="primary" @click="editServiceDialog">保存</el-button>
          <el-button @click="cancelEditServiceDialog">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog title="执行扩缩容" :visible="dialogVisible" width="40%" @close="cancelDialog">
      <el-form
        ref="dialogForm"
        :model="dialogForm"
        label-width="80px"
        label-position="right"
        :rules="rules"
      >
        <el-form-item label="操作动作">
          <el-radio-group v-model="dialogForm.operateType" size="medium">
            <el-radio-button label="expand" value="expand">扩容</el-radio-button>
            <el-radio-button label="shrink" value="shrink">缩容</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="操作台数">
          <el-radio-group v-model="dialogForm.operateCount" size="medium">
            <el-radio-button
              v-for="item in numRadios"
              :key="item.label"
              :label="item.label"
            >{{ item.name }}</el-radio-button>
          </el-radio-group>
          <div>
            其他：
            <el-input
              v-model="dialogForm.otherNum"
              prop="otherNum"
              style="width: 80px"
            />
            台
          </div>
        </el-form-item>
        <el-form-item>
          <div style="margin-left:20%"><el-button type="primary" @click="submitDialog">立即执行</el-button>
            <el-button @click="cancelDialog">取消</el-button></div>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>

</template>

<script>
import { getServiceList, serviceExpand, serviceShrink, serviceDelete, serviceEdit, getTemplateList } from '@/api/service'
// import { cloudAccountList } from "@/api/cloud";
import { languageMap } from '@/config/service'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination'
import _ from 'lodash'

export default {
  name: 'Service',
  components: { Pagination },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    },
    taskTypeStatus(value) {
      let str = ''
      if (value === 'FAIL') {
        str = '失败'
      }
      if (value === 'SUCC') {
        str = '成功'
      }
      if (value === 'RUNNIGN') {
        str = '运行中'
      }
      if (value === 'INIT') {
        str = '未进行'
      }
      return str
    }
  },
  data() {
    return {
      rules: {
        dialogTemplate: [
          { required: true, message: '请选择扩缩容流程', trigger: 'blur' }
        ]
      },
      dialogVisible: false,
      editServiceDialogVisible: false,
      listLoading: false,
      total: 0,
      search: {
        service_name: '',
        language: ''
      },
      listQuery: {
        page_num: 1,
        page_size: 20
      },
      selectServices: [],
      languageMap: languageMap,
      numRadios: [
        {
          label: 1,
          name: '+1'
        },
        {
          label: 5,
          name: '+5'
        },
        {
          label: 10,
          name: '+10'
        },
        {
          label: 50,
          name: '+50'
        },
        {
          label: 100,
          name: '+100'
        },
        {
          label: 200,
          name: '+200'
        }
      ],
      serviceList: [],
      templateList: [],
      dialogForm: {
        dialogTemplate: 0,
        operateType: 'expand',
        otherNum: '',
        operateCount: 5
      },
      editServiceDialogForm: {
        description: ''
      },
      currentRowServiceClusterId: ''
    }
  },
  created() {
    this.getList()
  },
  methods: {
    async getList() {
      this.listLoading = true
      const params = {
        ...this.search,
        ...this.listQuery
      }
      const res = await getServiceList(params)
      this.serviceList = _.get(res, 'service_list', [])
      this.total = res.pager.total
      this.listLoading = false
    },
    resetSearch() {
      this.search = {
        service_name: '',
        language: ''
      }
      this.listQuery = {
        page_num: 1,
        page_size: 20
      }
    },
    process(row) {
      this.currentRowServiceClusterId = row.service_cluster_id
      this.getTemplateList(row)
      this.dialogVisible = true
    },
    async getTemplateList(row) {
      const params = {
        'service_name': row.service_name,
        'page_num': 1,
        'page_size': 100
      }
      const res = await getTemplateList(params)
      this.templateList = _.get(res, 'tmpl_expand_list', [])
      if (this.templateList.length !== 0) {
        this.dialogForm.dialogTemplate = this.templateList[0].tmpl_expand_id
      }
    },
    async submitDialog() {
      if (
        this.dialogForm.operateCount === 0 &&
        this.dialogForm.otherNum === 0
      ) {
        this.$message.info('操作台数为0')
        return
      }
      const count =
        this.dialogForm.otherNum === ''
          ? this.dialogForm.operateCount
          : this.dialogForm.otherNum
      const params = {
        service_cluster_id: Number(this.currentRowServiceClusterId),
        count: Number(count)
      }
      let res
      switch (this.dialogForm.operateType) {
        case 'expand':
          res = await serviceExpand(params)
          if (res.code === 200) {
            this.$message.success('提交成功')
            this.dialogVisible = false
          } else {
            this.$message.error('提交失败')
          }
          break
        case 'shrink':
          res = await serviceShrink(params)
          if (res.code === 200) {
            this.$message.success('提交成功')
            this.dialogVisible = false
          } else {
            this.$message.error('提交失败')
          }
          break
      }
    },
    cancelDialog() {
      this.dialogVisible = false
    },
    cancelEditServiceDialog() {
      this.editServiceDialogVisible = false
    },
    handleSelectionChange(val) {
      this.selectServices = val
    },
    async editServiceDialog() {
      if (this.selectServices.length !== 1) {
        this.$message.info('请选择一条记录')
        return
      }
      const data = {
        'service_info': {
          'service_name': this.selectServices[0].service_name,
          'description': this.editServiceDialogForm.description
        }
      }
      const res = await serviceEdit(data)
      if (res.data.code === 200) {
        this.$message.success('编辑成功')
        this.editServiceDialogVisible = false
        this.getList()
      } else {
        this.$message.error('编辑失败')
      }
    },
    handleCreate() {
      this.$router.push({ name: 'serviceCreate' })
    },
    handleEdit() {
      this.editServiceDialogForm.description = this.selectServices[0].description
      this.editServiceDialogVisible = true
    },
    async handleDelete() {
      const res = await serviceDelete(this.selectServices.map(0))
      if (res.code === 200) {
        this.$message.success('删除成功')
      }
      await this.getList()
    },
    processHistory(row) {
      this.$router.push({ path: `/service/history/${row.service_cluster_id}` })
    },
    goTemplateIndex(row) {
      this.$router.push({ path: `/service/${row.service_name}/${row.service_cluster_id}/template` })
    }

  }
}
</script>

<style lang="less" scoped>
.container {
  position: absolute;
  width: 100%;
  height: 100%;
  padding: 10px 10px 0 10px;
  background-color: rgb(240, 242, 245);
  .header {
    background-color: #ffffff;
    padding: 20px;
    box-shadow: 4px 4px 5px rgba(0, 0, 0, 0.08);
    display: flex;
    flex-direction: row;
    .search {
      display: flex;
      flex-basis: 100%;
      .search-item {
        display: flex;
        margin-right: 40px;
        .label {
          display: flex;
          align-items: center;
          padding: 0 20px;
        }
      }
    }
    .buttons {
      display: flex;
      width: 200px;
    }
  }
  .content {
    margin-top: 20px;
    background-color: #ffffff;
    padding: 20px;
    box-shadow: 4px 4px 5px rgba(0, 0, 0, 0.08);
    .buttons {
      button {
        margin-right: 40px;
      }
    }
    .table {
      margin-top: 10px;
    }
  }
}
</style>
