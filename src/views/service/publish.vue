<template>
  <div class="container">
    <div class="header">
      <div class="status-container">
        <span class="status" :style="{backgroundColor: statusColor}">
          {{ taskStatus | parseDeployTaskStatus }}
        </span>
        <span class="serial-number">
          流水号：001243
        </span>
        <div class="rollback" @click="rollback">
          回滚
        </div>
      </div>
      <div class="detail">
        <el-row>
          <el-col :span="8">
            <span class="title">服务: </span>
            <span class="value">{{ service.service_name }}</span>
          </el-col>
          <el-col :span="8">
            <span class="title">集群: </span>
            <span class="value">{{ service.bridgx_cluster_name }}</span>
          </el-col>
          <el-col :span="8">
            <span class="title">发布方式: </span>
            <span class="value">全量发布</span>
          </el-col>
        </el-row>
        <el-row style="margin-top: 10px">
          <el-col :span="8">
            <span class="title">发布人: </span>
            <span class="value">{{ operator }}</span>
          </el-col>
          <el-col :span="16">
            <span class="title">部署产物: </span>
            <span class="value">{{ service.deploy_file_url }}</span>
          </el-col>
          <!--          <el-col :span="8">-->
          <!--            <span class="title">发布时间: </span>-->
          <!--            <span class="value">Cluster_HW_BJ</span>-->
          <!--          </el-col>-->
        </el-row>
      </div>
    </div>
    <div class="content">
      <div class="pipeline">
        <div v-for="(i, idx) in steps" :key="idx" style="display: flex; flex-direction: row">
          <div class="step">
            <div>{{ i.title }}</div>
            <div class="status">
              <span v-if="i.status === '成功'" style="color: #67C23A"><i class="el-icon-success" />{{ i.status }}</span>
              <span v-else-if="i.status === '进行中' || i.status === '回滚中'" style="color: #409EFF"><i class="el-icon-loading" />进行中</span>
              <span v-else-if="i.status === '失败'" style="color: #F56C6C"><i class="el-icon-error" />{{ i.status }}</span>
              <span v-else-if="i.status === '已创建'" style="color: #E6A23C"><i class="el-icon-s-opportunity" />待执行</span>
            </div>
          </div>
          <svg v-show="idx !== 4" class="transfer-arrowhead">
            <use xlink:href="#icon-arrow-right" />
          </svg>
        </div>
      </div>
    </div>
    <el-dialog :visible.sync="rollbackVisible" title="回滚" width="30%">
      <el-form label-width="100px">
        <el-form-item label="回滚集群">
          {{ rollbackForm.cluster }}
        </el-form-item>
        <el-form-item label="回滚产物" required>
          <el-input v-model="rollbackForm.download_file_url" size="medium" />
        </el-form-item>
        <el-form-item label="回滚方式">
          <el-radio v-model="rollbackForm.type" label="oneByOne">全量回滚</el-radio>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="medium" @click="rollbackVisible = false">取消</el-button>
        <el-button size="medium" type="primary" :disabled="checkRollback" @click="doRollback">回滚</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { deployTaskDetail, serviceDeploy, taskInfo } from '@/api/service'
// import { clusterInstanceStat } from '@/api/cluster'

export default {
  name: 'Publish',
  data() {
    return {
      service: {},
      operator: '',
      steps: [{
        title: '机器初始化脚本',
        status: '已创建',
        include: [
          'DEPLOY_BEFORE_DOWNLOAD_INIT',
          'DEPLOY_BEFORE_DOWNLOAD_SUCC',
          'DEPLOY_BEFORE_DOWNLOAD_FAIL'
        ]
      }, {
        title: '下载编译包',
        status: '已创建',
        include: [
          'DEPLOY_DOWNLOAD_INIT',
          'DEPLOY_DOWNLOAD_SUCC',
          'DEPLOY_DOWNLOAD_FAIL'
        ]
      }, {
        title: '部署环境初始化脚本',
        status: '已创建',
        include: [
          'DEPLOY_BEFORE_DEPLOY_INIT',
          'DEPLOY_BEFORE_DEPLOY_SUCC',
          'DEPLOY_BEFORE_DEPLOY_FAIL'
        ]
      }, {
        title: '程序部署',
        status: '已创建',
        include: [
          'DEPLOY_DEPLOY_INIT',
          'DEPLOY_DEPLOY_SUCC',
          'DEPLOY_DEPLOY_FAIL'
        ]
      }, {
        title: '服务启动配置',
        status: '已创建',
        include: [
          'DEPLOY_AFTER_DEPLOY_INIT',
          'DEPLOY_AFTER_DEPLOY_SUCC',
          'DEPLOY_AFTER_DEPLOY_FAIL'
        ]
      }],
      taskStatus: '',
      rollbackVisible: false,
      rollbackForm: {
        cluster: '',
        download_file_url: '',
        type: 'oneByOne',
        count: 0
      },
      interval: null
    }
  },
  computed: {
    checkRollback() {
      return this.rollbackVisible.download_file_url === ''
    },
    statusColor() {
      switch (this.taskStatus) {
        case 'INIT':
          return '#B8741A'
        case 'RUNNING':
          return '#409EFF'
        case 'ROLLING_BACK':
          return '#409EFF'
        case 'FAIL':
          return '#F56C6C'
        default:
          return '#67C23A'
      }
    }
  },
  mounted() {
    this.loadService()
    this.loadTask()
    this.interval = setInterval(this.loadTask, 5000)
  },
  beforeDestroy() {
    clearInterval(this.interval)
  },
  methods: {
    async loadService() {
      this.service = await deployTaskDetail(this.$route.params.service_cluster_id, this.$route.params.id)
    },
    async loadTask() {
      const res = await taskInfo(this.$route.params.id)
      this.operator = res.task_info.operator
      this.taskStatus = res.task_info.task_status
      this.handleSteps(res.task_info.task_step, res.task_info.task_status_desc)
    },
    handleSteps(step, status) {
      const steps = [...this.steps]
      for (let i = 0; i < steps.length; i++) {
        steps[i].include.includes(step)
        if (steps[i].include.includes(step)) {
          steps[i].status = status
          break
        }
        steps[i].status = '成功'
      }
      this.steps = steps
    },
    rollback() {
      this.rollbackVisible = true
      this.rollbackForm.cluster = this.service.bridgx_cluster_name
    },
    async doRollback() {
      // const ins = await clusterInstanceStat(this.service.bridgx_cluster_name)
      const res = await serviceDeploy(this.$route.params.service_cluster_id, '', 'manual', this.rollbackForm.download_file_url, true)
      if (res.code === 200) {
        this.$message.success('已提交')
        this.$router.push({
          name: 'publishService',
          params: {
            id: res.data.task_id,
            service_cluster_id: this.$route.params.service_cluster_id
          }
        })
      } else {
        this.$message.error('回滚失败')
        this.rollbackVisible = false
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
      .status-container {
        height: 30px;
        .status {
          border-radius: 5px;
          background-color: #B8741A;
          padding: 3px 5px;
          font-size: 14px;
          color: white;
        }
        .serial-number {
          margin-left: 20px;
          font-weight: bolder;
          font-size: 16px;
        }
      }
      .rollback {
        float: right;
        cursor: pointer;
        font-size: 14px;
        background-color: red;
        color: white;
        padding: 5px 20px;
        font-weight: bolder;
        border-radius: 6px;
      }
      .detail {
        margin-top: 20px;
        .title {
          color: rgb(170, 170,170);
        }
      }
    }
    .content {
      margin-top: 20px;
      background-color: #ffffff;
      padding: 20px;
      box-shadow: 4px 4px 5px rgba(0, 0, 0, 0.08);
      .pipeline {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
      }
      .step {
        display: flex;
        flex-direction: column;
        width: 200px;
        padding: 15px;
        border-radius: 5px;
        border: solid 1px black;
        margin-right: 10px;
      }
      .status {
        margin-top: 10px;
        font-size: 14px;
      }
    }
    .transfer-arrowhead {
      width: 40px;
      height: 70px;
    }
  }
</style>
