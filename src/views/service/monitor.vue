<template>
  <div class="container">
    <div class="wrap">
      服务监控 - {{ $route.params.service_name }}
      <div style="margin-top: 20px">
        冗余度走势
        <line-chart :timestamps="redundancy.timestamp" :values="redundancy.val" :mark-line="redundancyLimit" type="冗余度" />
      </div>
      <div style="margin-top: 20px">
        {{ qpsName }}
        <line-chart :timestamps="qps.timestamp" :values="qps.val" :type="qpsName" />
      </div>
      <div style="margin-top: 20px">
        机器数
        <line-chart :timestamps="instanceCount.timestamp" :values="instanceCount.val" type="机器数" />
      </div>
      <div style="height: 30px; line-height: 30px">
        服务扩缩记录
        <div style="float: right">
          <el-button size="mini" type="primary" @click="getList">刷新</el-button>
        </div>
      </div>
      <el-table v-loading="listLoading" :data="historyList" border size="medium">
        <el-table-column label="执行结果" align="center">
          <template slot-scope="{ row }">
            <span v-if="row.task_status_desc === '成功'" style="color: rgb(0,168,67)">{{ row.task_status_desc }}</span>
            <span v-if="row.task_status_desc === '失败'" style="display: inline-block; background-color: #f4516c; color: white; padding: 2px 5px; border-radius: 10px">{{ row.task_status_desc }}</span>
            <span v-if="row.task_status_desc === '已创建'" style="color: rgb(0,168,67)">{{ row.task_status_desc }}</span>
            <span v-if="row.task_status_desc === '进行中'" style="color: rgb(0,168,67)">{{ row.task_status_desc }}</span>
          </template>
        </el-table-column>
        <el-table-column label="ID" prop="task_id" align="center" />
        <el-table-column label="执行方" prop="task_exec_opr" align="center" />
        <el-table-column label="执行方式" align="center">
          <template slot-scope="{ row }">
            {{ row.task_exec_type === "manual" ? "手动执行" : "自动化" }}
          </template>
        </el-table-column>
        <el-table-column label="执行动作" align="center">
          <template slot-scope="{ row }">
            <span>{{ row.schedule_type === "expand" ? "扩容" : "缩容" }}</span>
          </template>
        </el-table-column>
        <el-table-column label="执行集群" prop="bridgx_cluster" align="center" />
        <el-table-column label="失败/成功/全量" align="center">
          <template slot-scope="{ row }">
            <span style="color: red">{{ row.fail_count }}</span> / <span>{{ row.success_count }}</span> / <span>{{ row.total_count }}</span>
          </template>
        </el-table-column>
        <el-table-column label="发生时间" align="center">
          <template slot-scope="{ row }">
            {{ row.begin_at }}
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="total > 0"
        :total="total"
        :page.sync="query.page_num"
        :limit.sync="query.page_size"
        @pagination="getList"
      />
    </div>
  </div>
</template>

<script>
import Moment from 'moment'
import echarts from 'echarts'
import LineChart from '@/components/chart/LineChart'
import Pagination from '@/components/Pagination'
import { getHistoryList, serviceClusterList } from '@/api/service'
import {
  getPredictRuleList,
  queryLoadMetric, queryInstanceCountMetric, queryRedundancyMetric
} from '@/api/cube'
import _ from 'lodash'
export default {
  name: 'Monitor',
  components: {
    LineChart,
    Pagination
  },
  data() {
    return {
      chartData: {
        expectedData: [100, 120, 161, 134, 105, 160, 165],
        actualData: [120, 82, 91, 154, 162, 140, 145]
      },
      historyList: [],
      query: {
        page_num: 1,
        page_size: 10
      },
      qps: {
        timestamp: [],
        val: {
          name: '',
          data: []
        }
      },
      instanceCount: {
        timestamp: [],
        val: {
          name: '',
          data: []
        }
      },
      redundancy: {
        timestamp: [],
        val: {
          name: '',
          data: []
        }
      },
      redundancyLimit: {
        min: 0,
        max: 0
      },
      total: 0,
      cluster: {},
      clusters: [],
      listLoading: false,
      interval: null,
      qpsName: 'QPS'
    }
  },
  async mounted() {
    await this.getList()
    await this.intervalLoad()
    this.interval = setInterval(this.intervalLoad, 10000)
    echarts.connect('group1')
  },
  beforeDestroy() {
    clearInterval(this.interval)
  },
  methods: {
    async getList() {
      this.listLoading = true
      const cRes = await serviceClusterList(this.$route.params.service_name)
      this.clusters = _.get(cRes, 'cluster_list', [])
      if (_.isEmpty(this.$route.query.cluster)) {
        this.cluster = _.get(this.clusters, '0')
      } else {
        this.cluster = this.clusters.find(i => i.bridgx_cluster === this.$route.query.cluster)
      }
      const params = {
        ...this.query,
        service_cluster_id: this.cluster.service_cluster_id,
        service_name: this.$route.params.service_name
      }
      const res = await getHistoryList(params)
      this.historyList = _.get(res, 'schedule_task_list', [])
      this.total = res.pager.total
      this.listLoading = false
    },
    async intervalLoad() {
      const rRes = await getPredictRuleList(this.$route.params.service_name, undefined, 1, 50)
      this.redundancyLimit = {
        min: _.isEmpty(rule) ? null : rule.min_redundancy / 100,
        max: _.isEmpty(rule) ? null : rule.max_redundancy / 100
      }
      const rule = _.get(rRes, 'predict_rule_list.0')
      if (!_.isEmpty(rule)) {
        await this.loadChartData(rule.metric_name)
      }
    },
    loadChartData(metric_name) {
      if (metric_name === 'qps_section_factor') {
        this.qpsName = 'MetricQPS'
      }
      const begin = Moment().subtract(30, 'minutes')
      const end = Moment()
      this.getQps(begin, end, metric_name)
      this.getInstanceCount(begin, end, metric_name)
      this.getRedundancy(begin, end, metric_name)
    },
    async getQps(begin, end, metric_name) {
      const qps = await queryLoadMetric(metric_name, this.$route.params.service_name, this.cluster.service_cluster, this.formatTime(begin), this.formatTime(end))
      this.qps = {
        timestamp: qps ? _.get(qps, '0.timestamps', []).map(i => i * 1000) : [],
        val: {
          name: this.cluster.bridgx_cluster,
          data: qps ? _.get(qps, '0.values', []) : []
        }
      }
    },
    async getInstanceCount(begin, end, metric_name) {
      const instanceCount = await queryInstanceCountMetric(metric_name, this.$route.params.service_name, this.cluster.service_cluster, this.formatTime(begin), this.formatTime(end))
      this.instanceCount = {
        timestamp: instanceCount ? _.get(instanceCount, '0.timestamps', []).map(i => i * 1000) : [],
        val: {
          name: this.cluster.bridgx_cluster,
          data: instanceCount ? _.get(instanceCount, '0.values', []) : []
        }
      }
    },
    async getRedundancy(begin, end, metric_name) {
      const redundancy = await queryRedundancyMetric(metric_name, this.$route.params.service_name, this.cluster.service_cluster, this.formatTime(begin), this.formatTime(end))
      this.redundancy = {
        timestamp: redundancy ? _.get(redundancy, '0.timestamps', []).map(i => i * 1000) : [],
        val: {
          name: this.cluster.bridgx_cluster,
          data: redundancy ? _.get(redundancy, '0.values', []) : []
        }
      }
    },
    formatTime(time) {
      return +(+time / 1000).toFixed()
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
    .wrap {
      background: white;
      padding: 10px;
      box-shadow: 4px 4px 5px rgba(0, 0, 0, .08);
      .row {
        display: flex;
        flex-direction: row;
        .item {
          flex-basis: 50%;
        }
      }
    }
  }
</style>
