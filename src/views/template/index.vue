<template>
  <div class="container">
    <div class="header">
      {{ service_name }}
    </div>
    <div class="container">
      <div>
        <el-tabs v-model="activeName">
          <el-tab-pane label="扩缩容模板" name="first">
            <div class="content">
              <div class="buttons">
                <el-button
                  size="medium"
                  type="primary"
                  @click="createTemplate"
                >+新建</el-button>
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
                  <el-table-column type="selection" width="50" />
                  <el-table-column
                    label="ID"
                    width="100px"
                    align="center"
                  >
                    <template slot-scope="{ row }">
                      <span>{{ row.tmpl_expand_id }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="扩容模板" min-width="100px">
                    <template slot-scope="{ row }">
                      <span>{{ row.tmpl_expand_name }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="执行集群" min-width="100px">
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
                  <el-table-column label="流量接入方式" min-width="100px">
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
          <el-tab-pane label="自动扩缩容" name="second">
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
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>

<script>
import {
  getTemplateList,
  decisionUpdate,
  getDecisionRule
} from '@/api/service'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination'
import _ from 'lodash'

export default {
  name: 'Template',
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
      form: {
        tmpl_decision_rule: {
          id: '',
          metric_value: '',
          redundancy: '',
          expand_size: '',
          is_valid: 1
        }
      },
      activeName: 'first',
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
      }
    }
  },
  created() {
    this.getList()
    this.getDecisionRule()
  },
  methods: {
    async getList() {
      this.listLoading = true
      const serviceName = this.$route.params.service_name
      const serviceClusterId = this.$route.params.service_cluster_id
      const params = {
        ...this.listQuery,
        service_name: serviceName,
        service_cluster_id: serviceClusterId
      }

      const res = await getTemplateList(params)
      this.templateList = _.get(res, 'tmpl_expand_list', [])
      this.total = res.pager.total
      this.listLoading = false
      this.service_name = serviceName
      this.service_cluster_id = serviceClusterId
    },
    async submit() {
      this.$refs['form'].validate(async(valid) => {
        if (valid) {
          this.form.tmpl_decision_rule.id = Number(this.form.tmpl_decision_rule.id)
          this.form.tmpl_decision_rule.metric_value = Number(this.form.tmpl_decision_rule.metric_value)
          this.form.tmpl_decision_rule.redundancy = Number(this.form.tmpl_decision_rule.redundancy)
          this.form.tmpl_decision_rule.expand_size = Number(this.form.tmpl_decision_rule.expand_size)
          this.form.tmpl_decision_rule.is_valid = Number(this.form.tmpl_decision_rule.is_valid)
          const res = await decisionUpdate(this.form)
          if (res.data.code === 200) {
            this.$message.success('保存成功')
            this.createDialogVisible = false
            this.$router.push({ name: 'serviceList' })
          } else {
            this.$message.error('保存失败')
          }
        }
      })
    },
    handleSelectionChange(val) {
      this.selectServices = val
    },
    createTemplate() {
      this.$router.push({
        path: `/service/${this.service_name}/${this.service_cluster_id}/template-create`
      })
    },
    async getDecisionRule() {
      const data = {
        service_cluster_id: this.$route.params.service_cluster_id
      }
      const res = await getDecisionRule(data)
      this.form.tmpl_decision_rule = _.get(res, 'tmpl_decision_rule', {})
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
