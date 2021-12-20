<template>
  <div class="container">
    <cluster-info />
    <div class="cluster-nodes">
      <div class="cluster-nodes-header">
        <div class="cluster-nodes-search">
          <div class="label" style="margin-left: 15px">IP</div>
          <el-input v-model="search.node_ip" size="medium" style="width: 200px" placeholder="输入IP搜索" clearable @blur="fetchData" />
          <div class="label">所属集群</div>
          <div class="content">
            <el-select v-model="search.cluster_name" v-load-more="loadMore" size="medium" @change="fetchData">
              <el-option value="" label="全部" />
              <el-option v-for="(c, idx) in clusterOptions" :key="idx" :value="c.cluster_name" :label="c.cluster_name" />
            </el-select>
          </div>
          <div class="label">机器作用</div>
          <el-select v-model="search.role" size="medium" @change="fetchData">
            <el-option v-for="(role, idx) in rolesOption" :key="idx" :value="role.value" :label="role.label" />
          </el-select>
        </div>
        <div class="cluster-nodes-button">
          <el-button size="medium" type="primary" @click="fetchData">查询</el-button>
          <el-button size="medium" style="margin-right: 10px" @click="reset">重置</el-button>
        </div>
      </div>
      <div class="cluster-nodes-list">
        <el-table v-loading="loading" :data="nodes" border style="margin: 10px; width: calc(100% - 30px)">
          <el-table-column label="运行状态" align="center">
            <template slot-scope="{ row }">
              <span v-if="row.status === 'Ready'" class="cluster-nodes-status common">{{ row.status | generateNodeStatus }}</span>
              <span v-else class="cluster-nodes-status error">{{ row.status | generateNodeStatus }}</span>
            </template>
          </el-table-column>
          <el-table-column label="IP" prop="ip_address" align="center" />
          <el-table-column label="机器名称" prop="host_name" align="center" min-width="150px" />
          <el-table-column label="所属集群" align="center">
            <template slot-scope="{ row }">
              <span class="cluster-nodes-ip" @click="transformToCluster('clusterInfo', row.cluster_name)">{{ row.cluster_name }}</span>
            </template>
          </el-table-column>
          <el-table-column label="机型" align="center">
            <template slot-scope="{ row }">
              <span>{{ row.all_cpu_cores | formatPrecision(2) }}核/{{ row.all_memory_gi | formatPrecision(2) }}G/{{ row.all_disk_gi | formatStorage }}</span>
              <span v-if="row.machine_type !== ''" style="display: inline-block; margin-left: 5px">({{ row.machine_type }})</span>
            </template>
          </el-table-column>
          <el-table-column label="承载实例" align="center">
            <template slot-scope="{ row }">
              <span class="cluster-nodes-pod-count" @click="transformToPods('galaxyCloudClusterPodList', row.ip_address)">{{ row.pod_count }}</span>
            </template>
          </el-table-column>
          <el-table-column label="剩余资源" align="center">
            <template slot-scope="{ row }">
              <span>{{ row.free_cpu_cores | formatPrecision(2) }}核</span>/<span>{{ row.free_memory_gi | formatPrecision(2) }}G</span>/{{ row.free_disk_gi | formatStorage }}
            </template>
          </el-table-column>
          <el-table-column label="所属云厂商" align="center">
            <template slot-scope="{ row }">
              {{ row.cloud_provider | filterCloudProvider }}
            </template>
          </el-table-column>
          <el-table-column label="机器作用" align="center">
            <template slot-scope="{ row }">
              {{ row.role }}
            </template>
          </el-table-column>
        </el-table>
        <pagination v-show="nodeQuery.total>0" :total="nodeQuery.total" :page.sync="nodeQuery.page_number" :limit.sync="nodeQuery.page_size" @pagination="fetchData" />
      </div>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
import { rolesOption } from '@/config/galaxyCloud'
import { clusterAvailable, clusterNodes } from '@/api/galaxyCloud'
import clusterInfo from '@/views/galaxyCloud/components/clusterInfo'
import Pagination from '@/components/Pagination'
import loadMore from '@/directive/el-select-load-more'

export default {
  name: 'ClusterMachine',
  components: {
    clusterInfo,
    Pagination
  },
  directives: {
    loadMore
  },
  data() {
    return {
      loading: false,
      search: {
        node_ip: '',
        cluster_name: '',
        role: ''
      },
      rolesOption,
      clusterQuery: {
        page_number: 1,
        page_size: 50,
        total: 0
      },
      clusterOptions: [],
      nodeQuery: {
        page_number: 1,
        page_size: 10,
        total: 0
      },
      nodes: [],
      interval: null
    }
  },
  mounted() {
    if (+this.$route.params.clusterId < 1) {
      this.$message.error('clusterId不合法!')
      this.$router.push({ name: 'galaxyCloudClusterList' })
      return
    }
    this.fetchData()
    this.interval = setInterval(this.fetchData, 15000)
    this.loadCluster()
  },
  beforeDestroy() {
    clearInterval(this.interval)
  },
  methods: {
    async fetchData() {
      this.loading = true
      const res = await clusterNodes(this.$route.params.clusterId, this.nodeQuery.page_number, this.nodeQuery.page_size, this.search.node_ip, this.search.cluster_name, this.search.role)
      this.nodes = _.get(res, 'nodes', [])
      this.nodeQuery = {
        page_number: _.get(res, 'page_number', 1),
        page_size: _.get(res, 'page_size', 10),
        total: _.get(res, 'total', 0)
      }
      this.loading = false
    },
    async loadCluster() {
      const res = await clusterAvailable(this.clusterQuery.page_number, this.clusterQuery.page_size, '', '')
      this.clusterOptions = _.get(res, 'clusters', [])
    },
    async loadMore() {
      this.clusterQuery.page_number++
      const res = await clusterAvailable(this.clusterQuery.page_number, this.clusterQuery.page_size, '', '')
      this.clusterOptions = _.concat(this.clusterOptions, ..._.get(res, 'clusters', []))
    },
    transformToPods(name, ip) {
      this.$router.push({ name, params: { clusterId: this.$route.params.clusterId, nodeIp: ip }})
    },
    transformToCluster(name, clusterName) {
      this.$router.push({ name, params: { name: clusterName }})
    },
    reset() {
      this.search = {
        node_ip: '',
        cluster_name: '',
        role: ''
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
  .cluster-nodes {
    box-shadow: 4px 4px 5px rgba(0, 0, 0, .08);
    background-color: white;
    margin: 10px;
    height: calc(~"98% - 150px");
    .cluster-nodes-header {
      display: flex;
      flex-direction: row;
      padding: 10px;
      .cluster-nodes-search {
        display: flex;
        flex-direction: row;
        flex: 1;
        align-items: center;
        .label {
          margin: 0 15px 0 30px;
        }
      }
      .cluster-nodes-list {
        width: 100%;
        height: calc(~"100% - 80px");
      }
    }
  }
  .cluster-nodes-status {
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
  .cluster-nodes-pod-count {
    color: blue;
    cursor: pointer;
    text-decoration: underline;
  }
</style>
