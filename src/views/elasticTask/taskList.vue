<template>
  <div class="container">
    <div class="header">
      <div class="search">
        <div class="search-item">
          <span class="label">任务名</span>
          <el-input v-model="search.taskName" size="medium" placeholder="输入任务名搜索" clearable style="width: 200px" @change="fetchData" />
        </div>
        <div class="search-item">
          <span class="label">执行集群</span>
          <el-select v-model="search.cluster" v-load-more="loadMore" size="medium" @change="fetchData">
            <el-option v-for="(item, idx) in clusterOptions" :key="idx" :value="item.value" :label="item.label" />
          </el-select>
        </div>
        <div class="search-item">
          <span class="label">执行状态</span>
          <el-select v-model="search.status" size="medium" @change="fetchData">
            <el-option v-for="item in allTaskStatus" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </div>
      </div>
      <div class="buttons">
        <el-button size="medium" type="primary" @click="fetchData">查询</el-button>
        <el-button size="medium" @click="resetSearch">重置</el-button>
      </div>
    </div>
    <div class="content">
      <div>
        <el-button size="medium" type="primary" @click="createOnceTask">+新建</el-button>
        <el-button size="medium" type="primary" style="float: right" @click="fetchData">刷新</el-button>
      </div>
      <div class="table">
        <el-table
          v-loading="listLoading"
          :data="list"
          border
          highlight-current-row
          style="width: 100%;"
          size="medium"
        >
          <el-table-column label="ID" align="center">
            <template slot-scope="{row}">
              <el-button type="text" @click="showDetail(row)">{{ row.task_id }}
              </el-button>
            </template>
          </el-table-column>
          <el-table-column label="任务名" align="center">
            <template slot-scope="scope">
              {{ scope.row.task_name }}
            </template>
          </el-table-column>
          <el-table-column label="执行状态" align="center">
            <template slot-scope="scope">
              {{ scope.row.task_status | parseTaskStatusRoughly }}
            </template>
          </el-table-column>
          <el-table-column label="执行集群" align="center">
            <template slot-scope="scope">
              {{ scope.row.cluster_name }}
            </template>
          </el-table-column>
          <el-table-column label="执行动作" align="center">
            <template slot-scope="{ row }">
              <div v-if="row.task_action === 'EXPAND'" class="task-action-container">
                扩容
                <svg class="task-action-svg">
                  <use xlink:href="#icon-upward" />
                </svg>
              </div>
              <div v-else-if="row.task_action === 'SHRINK'" class="task-action-container">
                缩容
                <svg class="task-action-svg">
                  <use xlink:href="#icon-downward" />
                </svg>
              </div>
              <div v-else>
                未知
              </div>
            </template>
          </el-table-column>
          <el-table-column label="执行结果" align="center">
            <template slot-scope="{ row }">
              <span v-if="row.task_status === 'SUCCESS'" style="color: rgb(0,168,67)">成功</span>
              <el-tooltip v-else-if="row.task_status === 'FAILED'" placement="top">
                <div slot="content">
                  {{ row.fail_reason }}
                </div>
                <span v-clipboard:copy="row.fail_reason" v-clipboard:success="clipboardSuccess" style="display: inline-block; background-color: #f4516c; color: white; padding: 2px 5px; border-radius: 10px">
                  失败
                </span>
              </el-tooltip>
              <el-progress v-else :text-inside="true" :stroke-width="20" :percentage="getPercent(row.success_num, row.total_num)" />
            </template>
          </el-table-column>
          <el-table-column label="失败/成功/全量" align="center">
            <template slot-scope="{row}">
              <span style="color: #f4516c">{{ row.fail_num }}</span> /
              <span style="color:rgb(0,168,67)">{{ row.success_num }}</span> /
              <span style="color:black">{{ row.total_num }}</span>
            </template>
          </el-table-column>
          <el-table-column label="执行时间" align="center">
            <template slot-scope="scope">
              {{ scope.row.create_at | formatMomentZone('YYYY-MM-DD HH:mm:ss') }}
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button type="text" @click="instancesDetail(scope.row)">执行明细</el-button>
            </template>
          </el-table-column>
        </el-table>
        <pagination v-show="total>0" :total="total" :page.sync="listQuery.page_number" :limit.sync="listQuery.page_size" @pagination="fetchData" />
      </div>
    </div>
    <el-dialog :visible.sync="detailDialogVisible" title="任务详情">
      <div class="detail-container">
        <div class="title">
          {{ taskDetail.task_name }}
          <div style="float: right">
            <el-button size="mini" type="primary" @click="updateDetail">刷新</el-button>
          </div>
          <hr />
        </div>
        <div class="detail-content">
          <el-row>
            <el-col :span="4"><span class="detail-label">执行集群: </span></el-col>
            <el-col :span="8"><div class="detail-value">{{ taskDetail.cluster_name }}</div></el-col>
            <el-col :span="4"><span class="detail-label">失败/成功/全量: </span></el-col>
            <el-col :span="8">
              <div class="detail-value">
                <span style="color: #f4516c">{{ taskDetail.fail_num }}</span> /
                <span style="color:rgb(0,168,67)">{{ taskDetail.success_num }}</span> /
                <span style="color:black">{{ taskDetail.total_num }}</span>
              </div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="4"><span class="detail-label">变更动作: </span></el-col>
            <el-col :span="8"><div class="detail-value">{{ taskDetail.task_action | parseTaskAction }}</div></el-col>
            <el-col :span="4"><span class="detail-label">变更机器数: </span></el-col>
            <el-col :span="8"><div class="detail-value">{{ taskDetail.total_num }}</div></el-col>
          </el-row>
          <el-row>
            <el-col :span="4"><span class="detail-label">执行时间: </span></el-col>
            <el-col :span="8"><div class="detail-value">{{ taskDetail.create_at | formatMomentZone('YYYY-MM-DD HH:mm:ss') }}</div></el-col>
            <el-col :span="4"><span class="detail-label">执行耗时</span></el-col>
            <el-col :span="8"><div class="detail-value">{{ taskDetail.execute_time | parseMin }}</div></el-col>
          </el-row>
        </div>
        <div class="detail-button"><el-button type="primary" size="medium" @click="closeDetail">关闭</el-button></div>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="instancesDialogVisible" title="执行明细" width="80%">
      <div class="detail-container">
        <div class="title">
          {{ taskDetail.task_name }}
          <div style="float: right">
            <el-button size="mini" type="primary" @click="exportExcel">导出</el-button>
          </div>
        </div>
        <div class="detail-content">
          <el-table v-loading="instanceLoading" :data="instances" size="mini" border>
            <el-table-column label="IP">
              <template slot-scope="{ row }">
                {{ row.ip_inner }}
              </template>
            </el-table-column>
            <el-table-column label="状态">
              <template slot-scope="{ row }">
                {{ row.status | formatInstanceStatuses }}
              </template>
            </el-table-column>
            <el-table-column label="开始时间">
              <template slot-scope="{ row }">
                {{ row.create_at | formatMomentZone('YYYY-MM-DD HH:mm:ss') }}
              </template>
            </el-table-column>
            <el-table-column label="耗时">
              <template slot-scope="{ row }">
                {{ row.startup_time | parseMin }}
              </template>
            </el-table-column>
          </el-table>
          <pagination v-show="instanceTotal>0" :total="instanceTotal" :page.sync="instancesQuery.page_number" :limit.sync="instancesQuery.page_size" @pagination="getInstances" />
        </div>
        <div class="detail-button" style="margin-top: 20px">
          <el-button type="primary" size="medium" @click="closeInstances">关闭</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import _ from 'lodash'
import { clusterDescribeAll } from '@/api/cluster'
import { taskDescribe, taskDescribeAll, taskInstances } from '@/api/task'
import { taskStatus } from '@/config/cloud'
import Pagination from '@/components/Pagination'
import clipboard from '@/directive/clipboard/index'
import loadMore from '@/directive/el-select-load-more'
import { formatInstanceStatuses } from '@/filters'

export default {
  name: 'TaskList',
  directives: {
    clipboard,
    loadMore
  },
  components: { Pagination },
  filters: {
    percentFilter(num) {
      return Math.round(num * 100)
    }
  },
  data() {
    return {
      test: '',
      allTaskStatus: [
        {
          value: '',
          label: '全部'
        },
        ...taskStatus
      ],
      listLoading: false,
      list: [],
      detailDialogVisible: false,
      instancesDialogVisible: false,
      instanceLoading: false,
      taskDetail: {},
      task: {
        cluster_name: '',
        run_mode: '',
        type: '',
        count: 0
      },
      search: {
        taskName: '',
        cluster: '',
        status: ''
      },
      clusterOptions: [],
      listQuery: {
        page_number: 1,
        page_size: 10
      },
      clusterQuery: {
        page_number: 1,
        page_size: 50,
        total: 0
      },
      total: 0,
      selectTasks: [],
      instances: [],
      instancesQuery: {
        page_number: 1,
        page_size: 10
      },
      instanceTotal: 0,
      interval: null
    }
  },
  created() {
    this.fetchData()
    this.interval = setInterval(this.fetchData, 15000)
  },
  beforeDestroy() {
    clearInterval(this.interval)
  },
  methods: {
    async fetchData() {
      this.listLoading = true
      const res = await taskDescribeAll(this.search.taskName, this.search.cluster, this.search.status, this.listQuery.page_number, this.listQuery.page_size)
      this.list = res.task_list
      this.total = res.pager.total
      const cRes = await clusterDescribeAll('', '', '', '', 'standard', this.clusterQuery.page_number, this.clusterQuery.page_size)
      this.clusterQuery.total = _.get(cRes, 'pager.total', 0)
      this.clusterOptions = [{
        value: '',
        label: '全部'
      }, ..._.get(cRes, 'cluster_list', []).map(i => ({
        value: i.cluster_name,
        label: i.cluster_name
      }))]
      this.listLoading = false
    },
    resetSearch() {
      this.search = {
        taskName: '',
        cluster: '',
        status: ''
      }
    },
    createOnceTask() {
      this.$router.push({ name: 'createOnceTask' })
    },
    async showDetail(task) {
      this.detailDialogVisible = true
      this.taskDetail = await taskDescribe(task.task_id)
    },
    async updateDetail() {
      this.taskDetail = await taskDescribe(this.taskDetail.task_id)
    },
    closeDetail() {
      this.detailDialogVisible = false
    },
    closeInstances() {
      this.instancesDialogVisible = false
    },
    instancesDetail(task) {
      this.taskDetail = task
      this.instancesDialogVisible = true
      this.getInstances()
    },
    async getInstances() {
      this.instanceLoading = true
      const res = await taskInstances(this.taskDetail.task_id, '', this.instancesQuery.page_number, this.instancesQuery.page_size)
      this.instances = _.get(res, 'instance_list', [])
      this.instanceTotal = _.get(res, 'pager.total', 0)
      this.instanceLoading = false
    },
    async loadMore() {
      if (this.clusterOptions.length === this.clusterQuery.total) {
        return
      }
      this.clusterQuery.page_number++
      const res = await clusterDescribeAll('', '', '', '', '', this.clusterQuery.page_number, this.clusterQuery.page_size)
      this.clusterOptions = _.concat(this.clusterOptions, _.get(res, 'cluster_list', []).map(i => ({
        value: i.cluster_name,
        label: i.cluster_name
      })))
      this.clusterQuery.total = _.get(res, 'total', 0)
    },
    getPercent(success, total) {
      if (total === 0) {
        return 0
      }
      const percent = Math.round(success / total) * 100
      return percent > 100 ? 100 : percent
    },
    clipboardSuccess() {
      this.$message.success('已复制到剪切板')
    },
    exportExcel() {
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['IP', '状态', '开始时间', '耗时(秒)']
        const filterVal = ['ip_inner', 'status', 'create_at', 'startup_time']
        const data = this.formatJson(filterVal)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'execution-detail'
        })
      })
    },
    formatJson(filterVal) {
      return this.instances.map(v => filterVal.map((j) => {
        if (j === 'status') {
          return formatInstanceStatuses(_.get(v, j, ''))
        }
        return _.get(v, j, '')
      }))
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
      padding: 20px 0;
      box-shadow: 4px 4px 5px rgba(0, 0, 0, .08);
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
        margin-right: 20px;
      }
    }
    .content {
      margin-top: 20px;
      background-color: #ffffff;
      padding: 20px;
      box-shadow: 4px 4px 5px rgba(0, 0, 0, .08);
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
  .detail-container {
    .title {
      font-weight: bolder;
      font-size: 20px;
      hr {
        margin-bottom: 20px;
      }
    }
    .detail-content {
      padding: 10px 0;
      .detail-label {
        color: rgb(181, 181, 184);
      }
      .detail-value {
        height: 46px;
      }
    }
    .detail-button {
      display: flex;
      justify-content: center;
    }
  }
  .task-action-container {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    .task-action-svg {
      height: 18px;
      width: 18px;
    }
  }
</style>

<style>
  .el-tooltip__popper {
    max-width: 400px;
    line-height: 180%;
  }
</style>
