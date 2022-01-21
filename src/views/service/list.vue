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
        <el-button size="medium" type="primary" style="float: right" @click="getList">刷新</el-button>
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
          <el-table-column label="ID" width="50px" align="center">
            <template slot-scope="{ row }">
              <span>{{ row.service_id }}</span>
            </template>
          </el-table-column>
          <el-table-column label="服务名称" min-width="60px" align="center">
            <template slot-scope="{ row }">
              <el-button type="text" @click="goTemplateIndex(row)">{{ row.service_name }}</el-button>
            </template>
          </el-table-column>
          <el-table-column label="服务类型" min-width="50px" align="center">
            <template slot-scope="{ row }">
              <span>{{ row.language }}</span>
            </template>
          </el-table-column>
          <el-table-column label="关联集群" min-width="50px" align="center">
            <template slot-scope="{ row }">
              <span>{{ row.cluster_num }}</span>
            </template>
          </el-table-column>
          <el-table-column label="服务描述" prop="description" align="center" />
          <!--
          <el-table-column label="自动扩缩容策略" min-width="60px" align="center">
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
          </el-table-column> -->
          <el-table-column label="操作" align="center">
            <template slot-scope="{ row }">
              <el-button type="text" :disabled="row.tmpl_expand_id === '' || row.tmpl_expand_id === 0" @click="transferTo('serviceMonitor', row)">
                服务监控
              </el-button>
              <el-button
                type="text"
                @click="process(row)"
              >扩缩容</el-button>
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
        label-width="100px"
        label-position="right"
        :rules="rules"
      >
        <el-form-item label="执行集群">
          <el-select v-model="dialogForm.cluster" size="mini">
            <el-option v-for="(c, idx) in clusters" :key="idx" :label="c.bridgx_cluster" :value="c" />
          </el-select>
        </el-form-item>
        <el-form-item label="操作动作">
          <el-radio-group v-model="dialogForm.operateType" size="mini">
            <el-radio-button label="expand" value="expand">扩容</el-radio-button>
            <el-radio-button label="shrink" value="shrink" :disabled="shrinkDisabled">缩容</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="集群信息">
          <span>{{ dialogForm.cluster.instance_type_desc }}</span>
          <span style="display: inline-block; margin-left: 15px">{{ dialogForm.cluster.provider | filterCloudProvider }}-{{ dialogForm.cluster.charge_type | parsePaidType }}-{{ dialogForm.cluster.computing_power_type }}</span>
          <span style="display: inline-block; margin-left: 15px">运行中<span style="color: red">{{ dialogForm.cluster.instance_count }}</span>台</span>
        </el-form-item>
        <!--        <el-form-item label="自动扩缩容">-->
        <!--          停用-->
        <!--        </el-form-item>-->
        <el-form-item label="扩容方式">
          <el-radio-group v-model="dialogForm.expandType">
            <el-radio label="instanceNum">按机器数</el-radio>
            <el-radio label="redundancy" disabled>按冗余度</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-show="dialogForm.expandType === 'redundancy'" label="冗余度">
          <el-slider
            v-model="dialogForm.redundancy"
            style="width: 80%"
            :format-tooltip="format"
            :min="100"
            :max="300"
            :marks="marks"
          />
        </el-form-item>
        <el-form-item v-show="dialogForm.expandType === 'instanceNum'" label="操作台数">
          <el-radio-group v-if="dialogForm.operateType === 'expand'" v-model="dialogForm.operateCount" size="mini">
            <el-radio-button
              v-for="item in numRadios"
              :key="item.label"
              :label="item.label"
            >{{ item.name }}</el-radio-button>
          </el-radio-group>
          <el-radio-group v-else v-model="dialogForm.operateCount" size="mini">
            <el-radio-button
              v-for="item in shrinkNumRadios"
              :key="item.label"
              :label="item.label"
            >{{ item.name }}</el-radio-button>
          </el-radio-group>
          <div>
            其他：
            <el-input
              v-model="dialogForm.otherNum"
              prop="otherNum"
              size="mini"
              style="width: 80px"
            />
            台
          </div>
        </el-form-item>
        <el-form-item>
          <div style="margin-left:20%">
            <el-button type="primary" size="medium" @click="submitDialog">立即执行</el-button>
            <el-button size="medium" @click="cancelDialog">取消</el-button></div>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog title="执行扩缩容" :visible="warningDialogVisible" width="30%" @close="cancelWarningDialogVisible">
      <div style="font-size:25px;text-align:center">
        提示：不能进行扩缩容
      </div>
      <div style="text-align:center;margin-top:5px">
        当前服务尚未创建对应的扩缩容流程，请</div>
      <div style="text-align:center"><el-button
        type="text"
        @click="goTemplateCreate()"
      >创建扩缩容流程</el-button>
      </div>
    </el-dialog>
  </div>

</template>

<script>
import {
  getServiceList,
  serviceExpand,
  serviceShrink,
  // serviceDelete,
  serviceEdit,
  getTemplateList,
  serviceClusterList
} from '@/api/service'
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
      warningDialogVisible: false,
      listLoading: false,
      total: 0,
      search: {
        service_name: '',
        language: ''
      },
      marks: {
        100: '100%',
        300: {
          style: {
            width: '40px'
          },
          label: this.$createElement('span', '300%')
        },
        154: {
          label: this.$createElement('span', '当前冗余度: 154%')
        }
      },
      listQuery: {
        page_num: 1,
        page_size: 10
      },
      selectServices: [],
      languageMap: languageMap,
      numRadios: [
        {
          label: 1,
          name: '1'
        },
        {
          label: 5,
          name: '5'
        },
        {
          label: 10,
          name: '10'
        },
        {
          label: 50,
          name: '50'
        },
        {
          label: 100,
          name: '100'
        },
        {
          label: 200,
          name: '200'
        }
      ],
      clusters: [],
      cluster: {},
      serviceList: [],
      templateList: [],
      dialogForm: {
        cluster: '',
        dialogTemplate: 0,
        operateType: 'expand',
        otherNum: '',
        operateCount: 0,
        expandType: 'instanceNum',
        redundancy: 200
      },
      format: (val) => `${val}%`,
      editServiceDialogForm: {
        description: ''
      },
      currentRowServiceClusterId: '',
      currentRowServiceName: '',
      shrinkNums: [1, 5, 10, 50, 100, 200]
    }
  },
  computed: {
    shrinkDisabled() {
      return this.dialogForm.cluster.instance_count === 0
    },
    shrinkNumRadios() {
      const nums = [...this.shrinkNums.filter(i => i < this.dialogForm.cluster.instance_count), this.dialogForm.cluster.instance_count]
      return nums.map(i => ({
        label: i,
        name: `-${i}`
      }))
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
    async process(row) {
      this.currentRowServiceClusterId = row.service_cluster_id
      this.currentRowServiceName = row.service_name
      const cRes = await serviceClusterList(row.service_name)
      this.clusters = _.get(cRes, 'cluster_list', [])
      if (this.clusters.length > 0) {
        this.dialogForm.cluster = _.get(this.clusters, '0')
      }
      if (row.tmpl_expand_id === '' || row.tmpl_expand_id === 0) {
        this.warningDialogVisible = true
      } else {
        await this.getTemplateList(row)
        this.dialogVisible = true
      }
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
    transferTo(name, service) {
      this.$router.push({ name, params: {
        service_name: service.service_name
      }})
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
    cancelWarningDialogVisible() {
      this.warningDialogVisible = false
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
    goTemplateIndex(row) {
      this.$router.push({ path: `/service/${row.service_name}/${row.service_cluster_id}/template` })
    },
    goTemplateCreate() {
      this.$router.push({
        path: `/service/${this.currentRowServiceName}/${this.currentRowServiceClusterId}/template-create`
      })
    }
  }
}
</script>

<style>
  .el-slider__stop {
    background: #f1f5fc;
  }
</style>

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
