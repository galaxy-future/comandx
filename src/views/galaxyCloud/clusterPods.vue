<template>
  <div class="container">
    <cluster-info />
    <div class="cluster-pods">
      <div class="cluster-pods-header">
        <div class="cluster-pods-search">
          <div class="label" style="margin-left: 15px">Pod IP</div>
          <el-input v-model="search.node_ip" size="medium" style="width: 200px" placeholder="输入IP搜索" clearable @blur="fetchData" />
          <div class="label">宿主机IP</div>
          <el-input v-model="search.pod_ip" size="medium" style="width: 200px" placeholder="输入IP搜索" clearable @blur="fetchData" />
        </div>
        <div class="cluster-pods-button">
          <el-button size="medium" type="primary" @click="fetchData">查询</el-button>
          <el-button size="medium" @click="reset">重置</el-button>
        </div>
      </div>
      <div class="cluster-pods-list">
        <el-table v-loading="loading" :data="pods" border style="margin: 10px; width: calc(100% - 30px)">
          <el-table-column label="运行状态" align="center">
            <template slot-scope="{ row }">
              <span v-if="row.status === 'Running'" class="cluster-pods-status common">{{ row.status }}</span>
              <span v-else class="cluster-pods-status error">{{ row.status }}</span>
            </template>
          </el-table-column>
          <el-table-column label="Pod name" align="center" prop="pod_name" />
          <el-table-column label="Pod IP" align="center" prop="pod_ip" />
          <el-table-column label="配置" align="center">
            <template slot-scope="{ row }">
              {{ row.allocated_cpu_cores }}核/{{ row.allocated_memory_gi | formatStorage }}/{{ row.allocated_disk_gi | formatStorage }}
            </template>
          </el-table-column>
          <el-table-column label="所属实例组" align="center" prop="group_name" />
          <el-table-column label="宿主机IP" align="center" prop="node_ip" />
          <el-table-column label="运行时间" align="center" prop="running_time" />
          <el-table-column label="操作" align="center">
            <template slot-scope="{ row }">
              <el-button size="medium" type="text" @click="restart(row)">重启</el-button>
            </template>
          </el-table-column>
        </el-table>
        <pagination v-show="query.total>0" :total="query.total" :page.sync="query.page_number" :limit.sync="query.page_size" @pagination="fetchData" />
      </div>
    </div>
  </div>
</template>

<script>
import clusterInfo from '@/views/galaxyCloud/components/clusterInfo'
import Pagination from '@/components/Pagination'
import { clusterPods, podRestart } from '@/api/galaxyCloud'
import _ from 'lodash'
import { isIPv4 } from '@/utils'

export default {
  name: 'ClusterPods',
  components: {
    clusterInfo,
    Pagination
  },
  data() {
    return {
      loading: false,
      search: {
        node_ip: '',
        pod_ip: ''
      },
      query: {
        page_number: 1,
        page_size: 10,
        total: 0
      },
      pods: []
    }
  },
  mounted() {
    if (!_.isNumber(this.$route.params.clusterId || this.$route.params.clusterId < 1)) {
      this.$message.error('clusterId不合法!')
      this.$router.push({ name: 'galaxyCloudClusterList' })
      return
    }
    if (isIPv4(this.$route.params.nodeIp)) {
      this.search.node_ip = this.$route.params.nodeIp
    }
    this.fetchData()
  },
  methods: {
    async fetchData() {
      this.loading = true
      const res = await clusterPods(this.$route.params.clusterId, this.query.page_number, this.query.page_size, this.search.node_ip, this.search.pod_ip)
      this.pods = _.get(res, 'pods', [])
      this.query = {
        page_number: _.get(res, 'page_number', 1),
        page_size: _.get(res, 'page_size', 10),
        total: _.get(res, 'total', 0)
      }
      this.loading = false
    },
    async restart(pod) {
      console.log(pod)
      const res = await podRestart(this.$route.params.clusterId, pod.pod_name)
      if (res.status === 'success') {
        this.$message.success('操作成功')
      } else {
        this.$message.error('操作失败')
      }
      await this.fetchData()
    },
    reset() {
      this.search = {
        node_ip: '',
        pod_ip: ''
      }
    }
  }
}
</script>

<style lang="less" scoped>
  .container {
    position: absolute;
    height: 98%;
    width: calc(~"100% - 20px");
  }
  .cluster-pods {
    background-color: white;
    margin: 10px;
    height: calc(~"98% - 150px");
    .cluster-pods-header {
      display: flex;
      flex-direction: row;
      padding: 10px;
      .cluster-pods-search {
        display: flex;
        flex-direction: row;
        flex: 1;
        align-items: center;
        .label {
          margin: 0 15px 0 30px;
        }
        .cluster-pods-button {
          width: 200px;
        }
      }
      .cluster-pods-list {
        width: 100%;
        height: calc(~"100% - 80px");
      }
    }
  }
  .cluster-pods-status {
    color: white;
    padding: 2px 10px;
    border-radius: 5px;
  }
  .common {
    background-color: #B8741A;
  }
  .error {
    background-color: #DC143C;
  }
</style>
