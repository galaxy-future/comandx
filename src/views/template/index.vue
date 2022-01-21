<template>
  <div class="container">
    <div class="content">
      <div>
        <el-tabs v-model="activeName">
          <el-tab-pane label="关联集群" name="clusters">
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
                  <el-button type="text" @click="elastic(row)">扩缩容</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="扩缩容模板" name="template">
            <div>
              <div class="buttons">
                <el-button
                  size="medium"
                  type="primary"
                  :disabled="total>0"
                  @click="createTemplate"
                >+新建</el-button>
                <el-button
                  size="medium"
                  :disabled="selectTemplates.length !== 1"
                  @click="editTemplate"
                >编辑</el-button>
                <el-button
                  size="medium"
                  :disabled="selectTemplates.length < 1"
                  @click="confirmDeleteTemplate"
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
            <rule-list :tmplExpandId="tmpl_expand_id" />
          </el-tab-pane>
          <el-tab-pane label="扩缩容历史" name="history">
            <history />
          </el-tab-pane>
          <!-- <el-tab-pane label="自动扩缩容" name="second">
            <div class="content">
              <el-form
                ref="form"
                v-model="form"
                style="margin-left:20%"
                class="form"
                label-position="right"
                size="medium"
                label-width="140px"
                :rules="rules"
                :model="form"
              >
                <el-form-item
                  label="单机QPS"
                  prop="tmpl_decision_rule.metric_value"
                >
                  <el-input
                    v-model="form.tmpl_decision_rule.metric_value"
                    size="medium"
                    placeholder="请输入QPS值"
                    style="width: 400px"
                  />
                </el-form-item>
                <el-form-item
                  label="冗余度"
                  prop="tmpl_decision_rule.redundancy"
                >
                  <el-input
                    v-model="form.tmpl_decision_rule.redundancy"
                    size="medium"
                    placeholder="请输入冗余度"
                    style="width: 400px"
                  />
                  <div class="note">
                    例：承载流量需100台服务器，冗余度100%表示自动变更为200台
                  </div>
                </el-form-item>
                <el-form-item
                  label="扩容步长"
                  prop="tmpl_decision_rule.expand_size"
                >
                  <el-input
                    v-model="form.tmpl_decision_rule.expand_size"
                    size="medium"
                    placeholder="请输入扩容步长"
                    style="width: 400px"
                  />
                  <div class="note">
                    例：承载流量需100台服务器，扩容步幅10%表示每批次增加10台
                  </div>
                </el-form-item>
                <el-form-item
                  label="执行状态"
                  prop="tmpl_decision_rule.excute_status"
                >
                  <el-switch
                    v-model="form.tmpl_decision_rule.is_valid"
                    active-color="#13ce66"
                    inactive-color="#ff4949"
                    :active-value="1"
                    :inactive-value="0"
                  />
                </el-form-item>

                <div style="display: flex; justify-content: right; margin-right:58%">
                  <el-button type="primary" @click="submit">保存</el-button>

                </div>
              </el-form>
            </div>
          </el-tab-pane> -->
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
    <elastic :cluster="dialog.cluster" :dialog-visible="dialog.visible" @close="closeDialog" />
  </div>
</template>

<script>
import {
  getTemplateList,
  serviceClusterList,
  // decisionUpdate,
  // getDecisionRule,
  templateDeletes
} from '@/api/service'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination'
import History from '@/views/template/history'
import Elastic from '@/views/template/components/elastic'
import RuleList from '@/views/template/ruleList'
import _ from 'lodash'

export default {
  name: 'Template',
  components: { Pagination, History, RuleList, Elastic },
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
      activeName: 'clusters',
      listLoading: false,
      total: 0,
      listQuery: {
        page_num: 1,
        page_size: 20
      },
      selectTemplates: [],
      templateList: [],
      service_name: '',
      service_cluster_id: '',
      confirmDeleteTemplateDiglogVis: false,
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
      tmpl_expand_id: 0
    }
  },
  created() {
    this.getList()
    // this.getDecisionRule()
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
    elastic(cluster) {
      this.dialog.visible = true
      this.dialog.cluster = cluster
    },
    closeDialog() {
      this.dialog.visible = false
    },
    // async submit() {
    //   this.$refs['form'].validate(async(valid) => {
    //     if (valid) {
    //       this.form.tmpl_decision_rule.id = Number(this.form.tmpl_decision_rule.id)
    //       this.form.tmpl_decision_rule.metric_value = Number(this.form.tmpl_decision_rule.metric_value)
    //       this.form.tmpl_decision_rule.redundancy = Number(this.form.tmpl_decision_rule.redundancy)
    //       this.form.tmpl_decision_rule.expand_size = Number(this.form.tmpl_decision_rule.expand_size)
    //       this.form.tmpl_decision_rule.is_valid = Number(this.form.tmpl_decision_rule.is_valid)
    //       const res = await decisionUpdate(this.form)
    //       if (res.data.code === 200) {
    //         this.$message.success('保存成功')
    //         this.createDialogVisible = false
    //         this.$router.push({ name: 'serviceList' })
    //       } else {
    //         this.$message.error('保存失败')
    //       }
    //     }
    //   })
    // },
    handleSelectionChange(val) {
      this.selectTemplates = val
    },
    createTemplate() {
      this.$router.push({
        path: `/service/${this.service_name}/${this.service_cluster_id}/template-create`
      })
    },
    editTemplate() {
      this.$router.push({
        path: `/service/template-edit/${this.service_name}/${this.selectTemplates[0].tmpl_expand_id}`
      })
    },
    confirmDeleteTemplate() {
      this.confirmDeleteTemplateDiglogVis = true
    },
    cancelDeleteTemplate() {
      this.confirmDeleteTemplateDiglogVis = false
    },
    async deleteTemplates() {
      const data = {
        'tmpl_expand_id': this.selectTemplates.map(i => i.tmpl_expand_id)
      }
      const res = await templateDeletes(data)
      if (res.data.code === 200) {
        this.cancelDeleteTemplate()
        this.$message.success('删除成功')
        this.getList()
      } else {
        this.$message.error('删除失败')
      }
    }
    // async getDecisionRule() {
    //   const data = {
    //     service_cluster_id: this.$route.params.service_cluster_id
    //   }
    //   const res = await getDecisionRule(data)
    //   this.form.tmpl_decision_rule = _.get(res, 'tmpl_decision_rule', {})
    // }
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
