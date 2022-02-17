<style lang="less">
 .template-dialog {
   .el-dialog__body {
     padding: 10px 20px!important;
   }
 }
</style>
<template>
  <div class="container">
    <div class="content">
      <div>
        <el-tabs v-model="activeName">
          <el-tab-pane label="运行环境" name="clusters">
            <el-tabs v-model="activeEnv" type="border-card" :before-leave="handActive">
              <el-tab-pane label="prod" name="prod">
                <el-table
                    :data="clusters"
                    border
                    fit
                    highlight-current-row
                    size="medium"
                >
                  <el-table-column label="ID" prop="service_cluster_id" align="center" />
                  <el-table-column label="集群名称" prop="bridgx_cluster" align="center" />
                  <el-table-column label="在线机器数" prop="instance_count" align="center" />
                  <el-table-column label="集群机型" prop="instance_type_desc" align="center" />
                  <el-table-column label="云厂商" align="center">
                    <template slot-scope="{ row }">
                      {{ row.provider | filterCloudProvider }}
                    </template>
                  </el-table-column>
                  <el-table-column label="付费方式" align="center">
                    <template slot-scope="{ row }">
                      {{ row.charge_type | parsePaidType }}
                    </template>
                  </el-table-column>
                  <el-table-column label="操作" align="center">
                    <template slot-scope="{ row }">
                      <el-button type="text" @click="goToMonitor(row)">集群监控</el-button>
                      <el-button type="text" :disabled="deploys === null || deploys.length < 1" @click="publishService(row)">发布</el-button>
                      <el-button type="text" :disabled="templateList === null || templateList.length < 1" @click="elastic(row)">扩缩容</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </el-tab-pane>
              <el-tab-pane name="add">
                <div slot="label">+添加环境</div>
              </el-tab-pane>
            </el-tabs>
          </el-tab-pane>
          <el-tab-pane label="发布模板" name="deploy">
            <div class="buttons">
              <el-button
                size="medium"
                type="primary"
                :disabled="clusters.length > 0"
                @click="createTemplate('deploy')"
              >+创建模板</el-button>
              <el-button
                size="medium"
                type="primary"
                @click="addZadig"
              >+Zadig部署</el-button>
              <el-button
                size="medium"
                :disabled="selectDeployTemplates.length !== 1"
                @click="editTemplate('deploy')"
              >编辑</el-button>
              <el-button
                size="medium"
                :disabled="selectDeployTemplates.length < 1"
                @click="confirmDeleteTemplate('deploy')"
              >删除</el-button>
            </div>
            <div class="table">
              <el-table
                v-loading="listLoading"
                :data="deploys"
                border
                fit
                highlight-current-row
                size="medium"
                @selection-change="handleDeploySelectionChange"
              >
                <el-table-column type="selection" width="50" align="center" />
                <el-table-column
                  label="ID"
                  width="100px"
                  align="center"
                >
                  <template slot-scope="{ row }">
                    <span>{{ row.tmpl_deploy_id }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="模板名称" min-width="100px" align="center">
                  <template slot-scope="{ row }">
                    <span>{{ row.tmpl_deploy_name }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="部署资源类型" min-width="100px" align="center">
                  <template slot-scope="{ row }">
                    <span>{{ row.deploy_resource_type }}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  label="部署资源名称"
                  width="150px"
                  align="center"
                >
                  <template slot-scope="{ row }">
                    {{ row.inst_cluster_name }}
                  </template>
                </el-table-column>
                <el-table-column label="部署方式" min-width="100px" align="center">
                  <template slot-scope="{ row }">
                    {{ row.deploy_mode | parseDeployMode }}
                  </template>
                </el-table-column>
                <el-table-column label="模板描述" min-width="100px" align="center">
                  <template slot-scope="{ row }">
                    {{ row.tmpl_desc }}
                  </template>
                </el-table-column>
              </el-table>
              <pagination
                v-show="deployQuery.total > 0"
                :total="deployQuery.total"
                :page.sync="deployQuery.page_num"
                :limit.sync="deployQuery.page_size"
                @pagination="getList"
              />
            </div>
          </el-tab-pane>
          <el-tab-pane label="扩缩容模板" name="template">
            <div>
              <div class="buttons">
                <el-button
                  size="medium"
                  type="primary"
                  :disabled="clusters.length > 0"
                  @click="createTemplate('expand')"
                >+创建模板</el-button>
                <el-button
                  size="medium"
                  :disabled="selectTemplates.length !== 1"
                  @click="editTemplate('expand')"
                >编辑</el-button>
                <el-button
                  size="medium"
                  :disabled="selectTemplates.length < 1"
                  @click="confirmDeleteTemplate('expand')"
                >删除</el-button>
              </div>
              <div class="table">
                <el-table
                  v-loading="listLoading"
                  :data="templateList"
                  border
                  fit
                  highlight-current-row
                  size="medium"
                  @selection-change="handleSelectionChange"
                >
                  <el-table-column type="selection" width="50" align="center" />
                  <el-table-column
                    label="ID"
                    width="100px"
                    align="center"
                  >
                    <template slot-scope="{ row }">
                      <span>{{ row.tmpl_expand_id }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="扩缩容流程" min-width="100px" align="center">
                    <template slot-scope="{ row }">
                      <span>{{ row.tmpl_expand_name }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="执行集群" min-width="100px" align="center">
                    <template slot-scope="{ row }">
                      <span>{{ row.inst_cluster_name }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="进行容器化"
                    width="150px"
                    align="center"
                  >
                    <template slot-scope="{ row }">
                      {{ row.is_container === true ? "是" : "否" }}
                    </template>
                  </el-table-column>
                  <el-table-column label="流量接入方式" min-width="100px" align="center">
                    <template slot-scope="{ row }">
                      {{ row.register_type }}
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
          </el-tab-pane>
          <el-tab-pane label="扩缩容规则" name="rule">
            <rule-list :tmpl-expand-id="tmpl_expand_id" />
          </el-tab-pane>
          <el-tab-pane label="扩缩容历史" name="history">
            <history />
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
    <el-dialog :visible="confirmDeleteTemplateDiglogVis" width="30%" @close="cancelDeleteTemplate">
      <div style="font-size:25px;text-align:center">
        确定要删除吗?
      </div>
      <div style="text-align:center;margin-top:20px">
        <el-button
          type="primary"
          @click="deleteTemplates()"
        >删除</el-button>
        <el-button
          @click="cancelDeleteTemplate()"
        >取消</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="publishVis" title="服务发布" width="30%" custom-class="template-dialog">
      <el-row style="margin-bottom: 20px">
        <el-col :span="8">
          服务: {{ serviceName }}
        </el-col>
        <el-col :span="8">
          环境: prod
        </el-col>
        <el-col :span="8">
          集群: {{ publishForm.cluster }}
        </el-col>
      </el-row>
      <el-form label-width="100px">
        <el-form-item label="产物来源" required>
          <el-radio v-model="publishForm.resource" label="Zadig">Zadig</el-radio>
          <el-radio v-model="publishForm.resource" label="depository">产物仓库</el-radio>
        </el-form-item>
        <el-form-item v-if="publishForm.resource === 'depository'" label="发布产物" required>
          <el-input v-model="publishForm.download_file_url" size="medium" />
        </el-form-item>
        <el-form-item v-if="publishForm.resource === 'Zadig'" label="工作流" required>
          <el-select v-loading="loading.workflow" v-model="publishForm.workflow" size="medium" @change="afterSelectedWorkFlow">
            <el-option v-for="(i, idx) in workflows" :key="idx" :label="i.workflow_name" :value="i.workflow_name" />
          </el-select>
        </el-form-item>
        <el-form-item v-loading="loading.artifact" v-if="publishForm.resource === 'Zadig'" v-load-more="loadMore" label="构建产物" required>
          <el-select v-model="publishForm.artifact" size="medium">
            <el-option v-for="(i, idx) in artifacts" :key="idx" :label="i.image_name" :value="i.image_name" />
          </el-select>
        </el-form-item>
        <el-form-item label="发布方式">
          <el-radio v-model="publishForm.type" label="oneByOne">全量发布</el-radio>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="medium" @click="publishVis = false">取消</el-button>
        <el-button size="medium" type="primary" :disabled="checkPublish" @click="doPublish">发布</el-button>
      </span>
    </el-dialog>
    <elastic :cluster="dialog.cluster" :dialog-visible="dialog.visible" @close="closeDialog" />
  </div>
</template>

<script>
import {
  deployList,
  getTemplateList,
  serviceClusterList,
  templateDeletes,
  serviceDeploy, workflowList, artifactList
} from '@/api/service'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination'
import History from '@/views/template/history'
import Elastic from '@/views/template/components/elastic'
import RuleList from '@/views/template/ruleList'
import loadMore from '@/directive/el-select-load-more'
import _ from 'lodash'

export default {
  name: 'Template',
  components: { Pagination, History, RuleList, Elastic },
  directives: { waves, loadMore },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    },
    parseDeployMode(mode) {
      const map = {
        instance: '云服务器部署'
      }
      return _.get(map, mode, '未知')
    }
  },
  data() {
    return {
      dialog: {
        visible: false,
        cluster: {}
      },
      form: {
        tmpl_decision_rule: {
          id: '',
          metric_value: '',
          redundancy: '',
          expand_size: '',
          is_valid: 1
        }
      },
      activeEnv: 'prod',
      activeName: 'clusters',
      listLoading: false,
      total: 0,
      listQuery: {
        page_num: 1,
        page_size: 20
      },
      selectTemplates: [],
      selectDeployTemplates: [],
      templateList: [],
      service_name: '',
      service_cluster_id: '',
      confirmDeleteTemplateDiglogVis: false,
      deleteType: '',
      publishVis: false,
      loading: {
        workflow: false,
        artifact: false
      },
      workflows: [],
      artifacts: [],
      publishForm: {
        cluster: '',
        resource: 'Zadig',
        workflow: '',
        artifact: '',
        download_file_url: '',
        type: 'oneByOne',
        count: 0
      },
      artifactsQuery: {
        page_size: 20,
        page_num: 1,
        total: 0
      },
      rules: {
        'tmpl_decision_rule.metric_value': [
          { required: true, message: '请输入QPS值', trigger: 'blur' }
        ],
        'tmpl_decision_rule.redundancy': [
          { required: true, message: '请输入冗余度', trigger: 'blur' }
        ],
        'tmpl_decision_rule.expand_size': [
          { required: true, message: '请输入扩容步长', trigger: 'blur' }
        ]
      },
      clusters: [],
      deploys: [],
      deployQuery: {
        page_num: 1,
        page_size: 20,
        total: 0
      },
      tmpl_expand_id: 0
    }
  },
  computed: {
    checkPublish() {
      if (this.publishForm.resource === 'Zadig') {
        return this.publishForm.workflow === '' || this.publishForm.artifact === ''
      }
      return this.publishForm.download_file_url === ''
    },
    serviceName() {
      return this.$route.params.service_name
    }
  },
  created() {
    this.getList()
  },
  methods: {
    async getList() {
      this.listLoading = true
      const cRes = await serviceClusterList(this.$route.params.service_name)
      this.clusters = _.get(cRes, 'cluster_list', [])
      const serviceName = this.$route.params.service_name
      const serviceClusterId = this.$route.params.service_cluster_id
      const params = {
        ...this.listQuery,
        service_name: serviceName,
        service_cluster_id: serviceClusterId
      }

      const res = await getTemplateList(params)
      this.templateList = _.get(res, 'tmpl_expand_list', [])
      this.tmpl_expand_id = _.get(this.templateList, '0.tmpl_expand_id') || 0
      this.total = res.pager.total

      const dRes = await deployList(this.$route.params.service_name, this.$route.params.service_cluster_id, 1, 20)
      this.deploys = _.get(dRes, 'deploy_expand_list', [])
      this.deployQuery = {
        page_size: _.get(dRes, 'pager.page_size', 20),
        page_num: _.get(dRes, 'pager.page_num', 1),
        total: _.get(dRes, 'pager.total', 0)
      }
      this.listLoading = false
      this.service_name = serviceName
      this.service_cluster_id = serviceClusterId
    },
    goToMonitor(cluster) {
      this.$router.push({
        name: 'serviceMonitor',
        params: {
          service_name: this.$route.params.service_name
        },
        query: {
          cluster: cluster.bridgx_cluster
        }
      })
    },
    async publishService(cluster) {
      this.publishForm.cluster = cluster.bridgx_cluster
      this.publishForm.count = cluster.instance_count
      this.publishVis = true
      this.loading.workflow = true
      // const res = await workflowList(this.service_name)
      this.workflows = await workflowList(this.service_name)
      this.loading.workflow = false
    },
    async afterSelectedWorkFlow() {
      this.loading.artifact = true
      const res = await artifactList(this.service_name, this.publishForm.workflow, 'file', this.artifactsQuery.page_num, this.artifactsQuery.page_size)
      this.artifacts = _.get(res, 'artifact_list', [])
      this.artifactsQuery.total = _.get(res, 'pager.total', 0)
      this.loading.artifact = false
    },
    async loadMore() {
      if (this.artifactsQuery.total === this.artifacts.length) {
        return
      }
      this.artifactsQuery.page_num++
      const res = await artifactList(this.service_name, this.publishForm.workflow, 'file', this.artifactsQuery.page_num, this.artifactsQuery.page_size)
      this.artifacts = _.concat(this.artifacts, ..._.get(res, 'artifact_list', []))
    },
    async doPublish() {
      const file = this.publishForm.resource === 'Zadig' ? this.publishForm.artifact : this.publishForm.download_file_url
      const res = await serviceDeploy(this.$route.params.service_cluster_id, '', 'manual', file, false)
      if (res.code === 200) {
        this.$message.success('发布成功')
        this.$router.push({
          name: 'publishService',
          params: {
            id: res.data.task_id,
            service_cluster_id: this.$route.params.service_cluster_id
          }
        })
      } else {
        this.$message.error('发布失败')
        this.publishVis = false
      }
    },
    elastic(cluster) {
      this.dialog.visible = true
      this.dialog.cluster = cluster
    },
    closeDialog() {
      this.dialog.visible = false
    },
    handleSelectionChange(val) {
      this.selectTemplates = val
    },
    handleDeploySelectionChange(val) {
      this.selectDeployTemplates = val
    },
    createTemplate(type) {
      this.$router.push({
        path: `/service/${this.service_name}/${this.service_cluster_id}/template-create?type=${type}`
      })
    },
    editTemplate(type) {
      const id = type === 'deploy' ? this.selectDeployTemplates[0].tmpl_deploy_id : this.selectTemplates[0].tmpl_expand_id
      this.$router.push({
        path: `/service/template-edit/${this.service_name}/${id}`
      })
    },
    addZadig() {
      window.open('http://172.16.16.223:32019/v1/projects')
    },
    confirmDeleteTemplate(type) {
      this.confirmDeleteTemplateDiglogVis = true
      this.deleteType = type
    },
    cancelDeleteTemplate() {
      this.confirmDeleteTemplateDiglogVis = false
    },
    async deleteTemplates() {
      const data = {
        'tmpl_expand_id': this.deleteType === 'deploy' ? this.selectDeployTemplates.map(i => i.tmpl_deploy_id) : this.selectTemplates.map(i => i.tmpl_expand_id)
      }
      const res = await templateDeletes(data)
      if (res.data.code === 200) {
        this.cancelDeleteTemplate()
        this.$message.success('删除成功')
        await this.getList()
      } else {
        this.$message.error('删除失败')
      }
    },
    handActive(name) {
      if (name === 'add') {
        return false
      }
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
    background-color: #ffffff;
    padding: 20px;
    box-shadow: 4px 4px 5px rgba(0, 0, 0, 0.08);
    .table {
      margin-top: 10px;
    }
  }
}
</style>
