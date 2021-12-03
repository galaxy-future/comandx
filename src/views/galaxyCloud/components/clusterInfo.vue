<template>
  <div class="cluster-info-container">
    <div class="cluster-info-header">
      <span class="cluster-info-status">{{ cluster.status }}</span>
      <span class="cluster-info-name">{{ cluster.cluster_name }}</span>
      <el-row :gutter="60" style="padding-top: 20px">
        <el-col :span="8">
          <el-row>
            <el-col :span="5"><span class="cluster-info-label">CPU</span></el-col>
            <el-col :span="3"><span class="cluster-info-percent">{{ cluster.cpuPercent | formatPercent(2) }}</span></el-col>
            <el-col :span="16"><span class="cluster-info-occupancy">{{ (cluster.all_cpu_cores - cluster.free_cpu_cores) | formatPrecision(2) }}</span> / {{ cluster.all_cpu_cores | formatPrecision(2) }}<span class="cluster-info-label" style="margin-left: 10px">核</span></el-col>
          </el-row>
        </el-col>
        <el-col :span="8">
          <el-row>
            <el-col :span="5"><span class="cluster-info-label">MEM</span></el-col>
            <el-col :span="3"><span class="cluster-info-percent">{{ cluster.memPercent | formatPercent(2) }}</span></el-col>
            <el-col :span="16"><span class="cluster-info-occupancy">{{ (cluster.all_memory_gi - cluster.free_memory_gi) | formatPrecision(2) }}</span> / {{ cluster.all_memory_gi | formatPrecision(2) }}<span class="cluster-info-label" style="margin-left: 10px">G</span></el-col>
          </el-row>
        </el-col>
        <el-col :span="8">
          <el-row>
            <el-col :span="5"><span class="cluster-info-label">DISK</span></el-col>
            <el-col :span="3"><span class="cluster-info-percent">{{ cluster.diskPercent | formatPercent(2) }}</span></el-col>
            <el-col :span="16"><span class="cluster-info-occupancy">{{ (cluster.all_disk_gi - cluster.free_disk_gi) | formatPrecision(2) }}</span> / {{ cluster.all_disk_gi | formatPrecision(2) }}<span class="cluster-info-label" style="margin-left: 10px">T</span></el-col>
          </el-row>
        </el-col>
      </el-row>
      <el-row :gutter="60" style="padding-top: 20px">
        <el-col :span="8">
          <el-row>
            <el-col :span="5"><span class="cluster-info-label">创建人</span></el-col>
            <el-col :span="19"><span>{{ cluster.created_user }}</span></el-col>
          </el-row>
        </el-col>
        <el-col :span="8">
          <el-row>
            <el-col :span="5"><span class="cluster-info-label">创建时间</span></el-col>
            <el-col :span="19"><span>{{ cluster.created_time }}</span></el-col>
          </el-row>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
import { clusterSummary } from '@/api/galaxyCloud'

export default {
  name: 'ClusterInfo',
  data() {
    return {
      cluster: {}
    }
  },
  mounted() {
    this.fetchData()
  },
  methods: {
    async fetchData() {
      if (!_.isNumber(+this.$route.params.clusterId) || +this.$route.params.clusterId < 1) {
        this.illegalClusterId()
        return
      }
      const res = await clusterSummary(this.$route.params.clusterId)
      if (res.status !== 'success') {
        this.illegalClusterId()
        return
      }
      this.cluster = res.cluster
      this.cluster.cpuPercent = (this.cluster.all_cpu_cores - this.cluster.free_cpu_cores) / this.cluster.all_cpu_cores
      this.cluster.memPercent = (this.cluster.all_memory_gi - this.cluster.free_memory_gi) / this.cluster.all_memory_gi
      this.cluster.diskPercent = (this.cluster.all_disk_gi - this.cluster.free_disk_gi) / this.cluster.all_disk_gi
    },
    illegalClusterId() {
      this.$message.error('非法的集群ID')
      this.$router.push({ name: 'galaxyCloudClusterList' })
    }
  }
}
</script>

<style lang="less" scoped>
  .cluster-info-container {
    background-color: white;
    margin: 10px;
    padding: 10px 20px;
    height: 150px;
    .cluster-info-status {
      display: inline-block;
      font-size: 16px;
      padding: 5px;
      color: white;
      background: #B8741A;
      border-radius: 5px;
      margin-top: 10px;
    }
    .cluster-info-name {
      font-size: 20px;
      margin-left: 10px;
    }
    .cluster-info-label {
      color: #AAAEBD;
    }
  }
  .cluster-info-percent {
    color: blue;
  }
  .cluster-info-occupancy {
    color: #B8741A
  }
</style>
