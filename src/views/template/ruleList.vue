<template>
  <div>
    <div>
      <el-button size="medium" type="primary" @click="createRule" :disabled="list.length > 0">+创建规则</el-button>
      <el-button size="medium" :disabled="selection.length !== 1" @click="editRule">编辑</el-button>
      <el-button size="medium" :disabled="selection.length < 1" @click="deleteRules" >删除</el-button>
    </div>
    <el-table :data="list" fit border highlight-current-row size="medium" style="margin-top: 10px" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="50" align="center" />
      <el-table-column label="规则名称" prop="name" align="center" />
      <el-table-column label="关联集群" align="center">
        <template>
          {{ clusterName }}
        </template>
      </el-table-column>
      <el-table-column label="度量指标" prop="metric_name" align="center" />
      <el-table-column label="单机QPS" prop="benchmark_qps" align="center" />
      <el-table-column label="冗余度范围" align="center">
        <template slot-scope="{ row }">
          <span>上限: <span style="color: blue">{{ row.max_redundancy }}%</span></span>
          <span style="display: inline-block; margin-left: 10px">下限: <span style="color: blue">{{ row.min_redundancy }}%</span></span>
        </template>
      </el-table-column>
      <el-table-column label="最小机器数" prop="min_instance_count" align="center" />
      <el-table-column label="扩缩容比例" align="center">
        <template slot-scope="{ row }">
          {{ row.execute_ratio }}%
        </template>
      </el-table-column>
      <el-table-column label="规则启停" align="center">
        <template slot-scope="{ row }">
          <el-switch v-model="row.status === 'enable'" @change="changeStatus(row)" />
          <span v-if="row.status === 'enable'" style="color: #409EFF">启用</span>
          <span v-else style="color: #909399">停用</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { disablePredictRule, enablePredictRule, getPredictRuleList, predictRuleDelete } from '@/api/cube'
import _ from 'lodash'
import { serviceClusterList } from '@/api/service'

export default {
  name: 'RuleList',
  props: {
    bridgx_cluster: {
      type: String,
      require: true
    }
  },
  components: {},
  data() {
    return {
      list: [],
      query: {
        page_size: 10,
        page_number: 1,
        total: 0
      },
      selection: [],
      clusterName: ''
    }
  },
  mounted() {
    this.fetchData()
  },
  methods: {
    async fetchData() {
      const res = await getPredictRuleList(this.$route.params.service_name, '', this.query.page_number, this.query.page_size)
      this.list = _.get(res, 'predict_rule_list', [])
      this.query.page_size = _.get(res, 'pager.page_size', 10)
      this.query.page_number = _.get(res, 'pager.page_number', 1)
      this.query.total = _.get(res, 'pager.total', 0)
      const cRes = await serviceClusterList(this.$route.params.service_name)
      const clusters = _.get(cRes, 'cluster_list', [])
      this.clusterName = _.get(clusters, '0.bridgx_cluster') || ''
    },
    handleSelectionChange(val) {
      this.selection = val
    },
    editRule() {
      this.$router.push({
        name: 'updateRule',
        params: {
          service_name: this.$route.params.service_name,
          service_cluster_id: this.$route.params.service_cluster_id,
          rule_id: this.selection[0].id
        }
      })
    },
    async deleteRules() {
      try {
        await this.$confirm('确定删除吗?', '警告', {
          confirmButtonText: '删除',
          cancelButtonText: '取消',
          type: 'warning'
        })
        const res = await predictRuleDelete(this.selection.map(i => i.id))
        if (res === 'success') {
          this.$message.success('删除成功')
          await this.fetchData()
        } else {
          this.$message.error('删除失败')
        }
      } catch (e) {
        // do nothing
      }
    },
    async changeStatus(rule) {
      let res
      if (rule.status === 'enable') {
        res = await disablePredictRule(rule.id)
      } else {
        res = await enablePredictRule(rule.id)
      }
      if (res === 'success') {
        this.$message.success('操作成功')
      } else {
        this.$message.error('操作失败')
      }
      await this.fetchData()
    },
    createRule() {
      this.$router.push({ name: 'createRule' })
    }
  }
}
</script>

<style lang="less" scoped>
</style>
