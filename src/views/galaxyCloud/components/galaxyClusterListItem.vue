<template>
  <div class="galaxy-cluster-item">
    <div class="galaxy-cluster-name">
      <div class="name"><span>{{ cluster.cluster_name }}</span></div>
      <div>
        <span class="status">{{ cluster.status }}</span>
      </div>
    </div>
    <div class="galaxy-cluster-divider" />
    <div class="galaxy-cluster-occupancy">
      <el-row class="row">
        <el-col :span="6" class="center">
          CPU
        </el-col>
        <el-col :span="6" class="center">
          <span class="percent">{{ cluster.cpuPercent | formatPercent(0) }}</span>
        </el-col>
        <el-col :span="6" class="center">
          <span class="occupancy">{{ (cluster.all_cpu_cores - cluster.free_cpu_cores) | formatPrecision(2) }}</span><span class="division">/</span>{{ cluster.all_cpu_cores | formatPrecision(2) }}
        </el-col>
        <el-col :span="6">
          <span class="unit">核</span>
        </el-col>
      </el-row>
      <el-row class="row">
        <el-col :span="6" class="center">
          MEM
        </el-col>
        <el-col :span="6" class="center">
          <span class="percent">{{ cluster.memPercent | formatPercent(0) }}</span>
        </el-col>
        <el-col :span="6" class="center">
          <span class="occupancy">{{ (cluster.all_memory_gi - cluster.free_memory_gi) | formatPrecision(2) }}</span><span class="division">/</span>{{ (cluster.all_memory_gi) | formatPrecision(2) }}
        </el-col>
        <el-col :span="6">
          <span class="unit">G</span>
        </el-col>
      </el-row>
      <el-row class="row">
        <el-col :span="6" class="center">
          DISK
        </el-col>
        <el-col :span="6" class="center">
          <span class="percent">{{ cluster.diskPercent | formatPercent(0) }}</span>
        </el-col>
        <el-col :span="6" class="center">
          <span class="occupancy">{{ (cluster.all_disk_gi - cluster.free_disk_gi) | formatPrecision(2) }}</span><span class="division">/</span>{{ cluster.all_disk_gi | formatPrecision(2) }}
        </el-col>
        <el-col :span="6">
          <span class="unit">T</span>
        </el-col>
      </el-row>
    </div>
    <div class="galaxy-cluster-divider" />
    <div class="galaxy-cluster-machine" @click="routeTo('galaxyCloudClusterNodeList', cluster.cluster_id)">
      <svg class="galaxy-cluster-svg">
        <use xlink:href="#icon-server" />
      </svg>
      <div style="width: 100%; padding-left: 10px">
        <el-row>
          <el-col :span="12" class="center">master</el-col>
          <el-col :span="12" class="center"><span class="num">{{ cluster.master_count }}</span> <span class="unit">台</span></el-col>
        </el-row>
        <el-row>
          <el-col :span="12" class="center">worker</el-col>
          <el-col :span="12" class="center"><span class="num">{{ cluster.work_count }}</span> <span class="unit">台</span></el-col>
        </el-row>
      </div>
    </div>
    <div class="galaxy-cluster-divider" />
    <div class="galaxy-cluster-instance" @click="routeTo('galaxyCloudClusterPodList', cluster.cluster_id)">
      <svg class="galaxy-cluster-svg">
        <use xlink:href="#icon-gcluster" />
      </svg>
      <div class="label">
        实例
      </div>
      <div class="value">
        {{ cluster.pod_count }}
      </div>
    </div>
    <div class="galaxy-cluster-divider" />
    <div class="galaxy-cluster-delete">
      <svg class="svg" style="cursor: pointer" @click="showWarning">
        <use xlink:href="#icon-ashbin" />
      </svg>
    </div>
    <el-dialog :visible.sync="warningVisible" width="30%">
      <div slot="title" class="warning-title">
        警告！！
      </div>
      <div style="text-indent:2rem;color: black">
        删除星云集群会清除所有实例及部署的服务，集群内的公有云服务器也将在当天24点释放
      </div>
      <div style="text-indent:2rem;margin-top: 1.5rem;color: black">
        确定要删除星云集群吗？？
      </div>
      <div slot="footer" class="warning-footer">
        <div style="color: #D9001B" @click="deleteGCluster(cluster.cluster_id)">删除</div>
        <div @click="cancel">取消</div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { clusterDelete } from '@/api/galaxyCloud'

export default {
  name: 'GalaxyClusterListItem',
  props: {
    item: {
      type: Object,
      require: true,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      cluster: {},
      warningVisible: false
    }
  },
  mounted() {
    this.generateData()
  },
  methods: {
    generateData() {
      this.cluster = { ...this.item }
      this.cluster.cpuPercent = (this.cluster.all_cpu_cores - this.cluster.free_cpu_cores) / this.cluster.all_cpu_cores
      this.cluster.memPercent = (this.cluster.all_memory_gi - this.cluster.free_memory_gi) / this.cluster.all_memory_gi
      this.cluster.diskPercent = (this.cluster.all_disk_gi - this.cluster.free_disk_gi) / this.cluster.all_disk_gi
    },
    routeTo(name, clusterId) {
      this.$router.push({ name, params: { clusterId }})
    },
    showWarning() {
      this.warningVisible = true
    },
    async deleteGCluster(id) {
      const res = await clusterDelete(id)
      if (res.status === 'success') {
        this.$message.success('删除成功')
      } else {
        this.$message.error('删除失败')
      }
      this.$emit('reload')
      this.warningVisible = false
    },
    cancel() {
      this.warningVisible = false
    }
  }
}
</script>

<style>
  .el-dialog__footer {
    padding: 0;
  }
</style>
<style lang="less" scoped>
  .galaxy-cluster-item {
    border: 1px solid #b0b6be;
    border-radius: 8px;
    height: 90px;
    box-shadow: 5px 5px 5px #b0afaf;
    display: flex;
    flex-direction: row;
    margin-bottom: 10px;
    .galaxy-cluster-name {
      flex-basis: 15%;
      display: flex;
      flex-direction: column;
      padding: 20px;
      .name {
        font-size: 16px;
        height: 18px;
        span {
          white-space: nowrap;
        }
      }
      .status {
        display: inline-block;
        font-size: 12px;
        padding: 5px;
        color: white;
        background: rgb(184, 116, 26);
        border-radius: 5px;
        margin-top: 10px;
      }
    }
    .galaxy-cluster-occupancy {
      flex-basis: 30%;
      padding: 10px 20px;
      .row {
        height: 33%;
        display: flex;
        align-items: center;
      }
      .percent {
        color: #3100FF;
      }
      .occupancy {
        color: #B8741A;
      }
      .division {
        display: inline-block;
        padding: 0 5px;
      }
    }
    .galaxy-cluster-machine {
      display: flex;
      flex-basis: 30%;
      flex-direction: row;
      align-items: center;
      padding: 10px 20px;
      cursor: pointer;
      .num {
        color: blue;
      }
    }
    .galaxy-cluster-instance {
      display: flex;
      flex-basis: 25%;
      flex-direction: row;
      align-items: center;
      padding: 10px 20px;
      cursor: pointer;
      .label {
        color: #AAAEBD;
        flex-basis: 40%;
        height: 100%;
        padding-top: 35px;
        padding-left: 20px;
      }
      .value {
        color: #1AFA45;
        font-size: 50px;
        font-weight: bolder;
        flex-basis: 60%;
      }
    }
    .galaxy-cluster-delete {
      display: flex;
      align-items: center;
      padding: 5px;
      .svg {
        height: 30px;
        width: 30px;
      }
    }
    .galaxy-cluster-svg {
      height: 60px;
      width: 60px;
    }
    .galaxy-cluster-divider {
      width: 1px;
      background-color: #80FFFF;
      margin: 5px 0;
    }
    .center {
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .unit {
      color: #AAAEBD;
    }
  }
  .warning-title {
    color: #D9001B;
    font-weight: bolder;
  }
  .warning-footer {
    display: flex;
    flex-direction: row;
    div {
      display: flex;
      flex-basis: 50%;
      justify-content: center;
      align-items: center;
      border: 1px solid black;
      padding: 10px 0;
      cursor: pointer;
    }
  }
</style>
