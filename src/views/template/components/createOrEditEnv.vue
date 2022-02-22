<template>
  <div class="form">
    <div class="form-container">
      <el-row>
        <el-col :span="5"><div class="center-text"><span class="is-required" style="color: #FF4C4C;">*</span>环境名称</div></el-col>
        <el-col :span="19">
          <el-input
            v-model="form.env_name"
            size="medium"
            placeholder="请输入环境名称"
            maxlength="20"
            style="width: 80%"
          />
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="5"><div style="height: 16px" /></el-col>
        <el-col :span="19">
          <div class="note" :class="{ 'text-red': !nameValidate }">
            支持英文、数字，限制20字符
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="form-container">
      <el-row>
        <el-col :span="5"><div class="center-text"><span class="is-required" style="color: #FF4C4C;">*</span>环境类型</div></el-col>
        <el-col :span="19">
          <el-select v-model="form.env_type" size="medium">
            <el-option v-for="(type, idx) in types" :key="idx" :value="type.value" :label="type.value" />
          </el-select>
        </el-col>
      </el-row>
    </div>
    <div class="form-container">
      <el-row>
        <el-col :span="5"><div class="center-text"><span class="is-required" style="color: #FF4C4C;">*</span>算力资源</div></el-col>
        <el-col :span="19">
          <div style="height: 36px; display: flex; align-items: center; color: #F56C6C">
            建议同一环境使用相同配置的算力资源
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="5"><div style="height: 16px" /></el-col>
        <el-col :span="19">
          <el-button size="mini" type="primary" @click="addComputedResource">添加算力</el-button>
        </el-col>
      </el-row>
      <el-row style="margin-top: 10px">
        <el-col :span="5"><div style="height: 16px" /></el-col>
        <el-col :span="19">
          <el-table :data="form.computing_resources" size="mini" border>
            <el-table-column align="center" label="序号" width="50">
              <template slot-scope="scope">
                {{ scope.$index + 1 }}
              </template>
            </el-table-column>
            <el-table-column align="center" label="算力类型">
              <template slot-scope="{ row }">
                <el-select v-model="row.computing_type" size="mini">
                  <el-option v-for="(type, idx) in computingTypes" :key="idx" :value="type.value" :label="type.label" />
                </el-select>
              </template>
            </el-table-column>
            <el-table-column align="center" label="集群">
              <template slot-scope="{ row }">
                <el-select v-model="row.bridgx_cluster" v-load-more="loadMore" size="mini">
                  <el-option v-for="(cluster, idx) in clusters" :key="idx" :value="cluster.cluster_name" :label="cluster.cluster_name" />
                </el-select>
              </template>
            </el-table-column>
            <el-table-column align="center" label="集群信息" width="160">
              <template slot-scope="{ row }">
                {{ getClusterInfo(row.bridgx_cluster) }}
              </template>
            </el-table-column>
            <el-table-column align="center" label="操作">
              <template slot-scope="scope">
                <el-button size="mini" type="text" @click="delComputedResource(scope.$index)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
    </div>
    <div class="form-container">
      <el-row>
        <el-col :span="5"><div class="center-text"><span class="is-required" style="color: #FF4C4C;">*</span>访问域名/端口</div></el-col>
        <el-col :span="19">
          <el-row style="width: 80%">
            <el-col :span="17">
              <el-input v-model="form.domain" size="medium" placeholder="请输入访问域名" />
            </el-col>
            <el-col :span="1" style="height: 36px; display: flex; justify-content: center; align-items: center">
              /
            </el-col>
            <el-col :span="6">
              <el-input v-model="form.port" size="medium" placeholder="服务端口" />
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </div>
    <div class="form-container">
      <el-row>
        <el-col :span="5"><div class="center-text"><span class="is-required" style="color: #FF4C4C;">*</span>健康检测</div></el-col>
        <el-col :span="19">
          <div style="height: 36px; display: flex; align-items: center">
            <el-radio v-model="healthCheckSwitch" size="medium" :label="false">标准配置</el-radio>
            <el-radio v-model="healthCheckSwitch" size="medium" :label="true">高级配置</el-radio>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="5"><div style="height: 36px" /></el-col>
        <el-col :span="19">
          <el-row class="advanced-container">
            <el-col :span="4" class="advanced-title">
              检测方式
            </el-col>
            <el-col :span="20" style="padding: 5px">
              <el-radio v-model="form.health_check.mode" label="HttpGet" />
            </el-col>
          </el-row>
          <el-row style="border-style: solid; border-color: #b6b5b5; border-width: 0 1px 1px 1px">
            <el-col :span="4" class="advanced-title">
              Path:
            </el-col>
            <el-col :span="10" style="border-right: 1px solid #b6b5b5">
              <el-input v-model="form.health_check.path" size="mini" />
            </el-col>
            <el-col :span="4" class="advanced-title">
              Port:
            </el-col>
            <el-col :span="6">
              <el-input v-model="form.health_check.port" size="mini" />
            </el-col>
          </el-row>
          <div v-if="healthCheckSwitch">
            <el-row :gutter="20" style="margin-top: 15px">
              <el-col :span="12">
                <div class="advanced-container">
                  <div class="advanced-title" style="width: 25rem;">
                    服务初始化时间(单位:秒)
                  </div>
                  <el-input v-model="form.health_check.init_time" size="mini" />
                </div>
              </el-col>
              <el-col :span="12">
                <div class="advanced-container">
                  <div class="advanced-title" style="width: 25rem;">
                    超时时间时间(单位:秒)
                  </div>
                  <el-input v-model="form.health_check.timeout_time" size="mini" />
                </div>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <div class="note note-text">
                  健康检查初始化前的时间设置，既实例启动需要的时间
                </div>
              </el-col>
              <el-col :span="12">
                <div class="note note-text">
                  健康检查超时时间: 默认1s，最小1s
                </div>
              </el-col>
            </el-row>
            <el-row :gutter="20" style="margin-top: 10px">
              <el-col :span="12">
                <div class="advanced-container">
                  <div class="advanced-title" style="width: 10rem;">
                    允许失败次数
                  </div>
                  <el-input v-model="form.health_check.unhealthy_threshold" size="mini" />
                </div>
              </el-col>
              <el-col :span="12">
                <div class="advanced-container">
                  <div class="advanced-title" style="width: 6rem;">
                    周期频率
                  </div>
                  <el-input v-model="form.health_check.check_period" size="mini" />
                </div>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <div class="note note-text">
                  失败多少次之后任务当前实例启动失败: 默认3次，最少1次
                </div>
              </el-col>
              <el-col :span="12">
                <div class="note note-text">
                  每次健康检查的时间间隔; 默认10s，最小1s
                </div>
              </el-col>
            </el-row>
            <el-row :gutter="20" style="margin-top: 10px">
              <el-col :span="12">
                <div class="advanced-container">
                  <div class="advanced-title" style="width: 10rem;">
                    成功次数
                  </div>
                  <el-input v-model="form.health_check.health_threshold" size="mini" />
                </div>
              </el-col>
              <el-col :span="12" />
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <div class="note note-text">
                  成功多少次后认为当前实例启动成功，默认1次，最少1次
                </div>
              </el-col>
              <el-col :span="12" />
            </el-row>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="buttons">
      <el-button type="primary" size="medium" @click="createEnv">保存</el-button>
      <el-button size="medium" @click="cancel">取消</el-button>
    </div>
  </div>
</template>

<script>

import { clusterDescribeAll } from '@/api/cluster'
import _ from 'lodash'
import loadMore from '@/directive/el-select-load-more'
import { filterCloudProvider, parsePaidType } from '@/filters'
import { createEnv, serviceDetail } from '@/api/service'

export default {
  name: 'CreateEnv',
  directives: {
    loadMore
  },
  props: {
    serviceName: {
      type: String,
      require: true,
      default: ''
    }
  },
  data() {
    return {
      form: {
        'service_id': 0,
        'env_name': '',
        'env_type': 'PRODUCT',
        'domain': '',
        'port': '',
        'health_check': {
          'mode': 'HttpGet',
          'path': '',
          'port': '',
          'init_time': 0,
          'timeout_time': 1,
          'health_threshold': 1,
          'unhealthy_threshold': 1,
          'check_period': 1
        },
        'computing_resources': [{
          'computing_type': 'CLOUD_CLUSTER',
          'bridgx_cluster': ''
        }]
      },
      healthCheckSwitch: false,
      types: [{
        value: 'PRODUCT',
        label: '生产环境'
      }, {
        value: 'PRE_ONLINE',
        label: '拟真环境'
      }, {
        value: 'TEST',
        label: '测试环境'
      }, {
        value: 'PRESS',
        label: '压测环境'
      }, {
        value: 'DEVELOP',
        label: '开发环境'
      }],
      computingTypes: [{
        value: 'CLOUD_CLUSTER',
        label: '云服务器集群'
      }],
      clusters: [],
      clusterQuery: {
        page_number: 1,
        page_size: 50,
        total: 0
      }
    }
  },
  computed: {
    nameValidate() {
      return true
    }
  },
  mounted() {
    this.fetchData()
  },
  methods: {
    async fetchData() {
      const res = await clusterDescribeAll('', '', '', '', 'standard', this.clusterQuery.page_number, this.clusterQuery.page_size)
      this.clusters = _.get(res, 'cluster_list', [])
      this.clusterQuery.total = _.get(res, 'pager.total', 0)
      const service = await serviceDetail(this.serviceName)
      this.form.service_id = service.service_id
    },
    async loadMore() {
      if (this.clusters.length === this.clusterQuery.total) {
        return
      }
      this.clusterQuery.page_number++
      const res = await clusterDescribeAll('', '', '', '', 'standard', this.clusterQuery.page_number, this.clusterQuery.page_size)
      this.clusters = _.concat(this.clusters, ..._.get(res, 'cluster_list', []))
      this.clusterQuery.total = _.get(res, 'pager.total', 0)
    },
    getClusterInfo(cluster_name) {
      const cluster = this.clusters.find(i => i.cluster_name === cluster_name)
      return cluster ? `${cluster.instance_type.replace(/\(.*?\)/g, '')}/${filterCloudProvider(cluster.provider)}/${parsePaidType(cluster.charge_type)}` : ''
    },
    delComputedResource(idx) {
      this.form.computing_resources = this.form.computing_resources.filter((_, i) => i !== idx)
    },
    addComputedResource() {
      this.form.computing_resources.push({
        'computing_type': 'CLOUD_CLUSTER',
        'bridgx_cluster': ''
      })
    },
    async createEnv() {
      this.form.port = +this.form.port
      this.form.health_check = {
        ...this.form.health_check,
        port: +this.form.health_check.port,
        'init_time': +this.form.health_check.init_time,
        'timeout_time': +this.form.health_check.timeout_time,
        'health_threshold': +this.form.health_check.health_threshold,
        'unhealthy_threshold': +this.form.health_check.unhealthy_threshold,
        'check_period': +this.form.health_check.check_period
      }
      const res = await createEnv({
        'running_env_info': this.form
      })
      if (res.code === 200) {
        this.$message.success('创建成功')
        this.$emit('gotoList')
      } else {
        this.$message.error('创建失败')
      }
    },
    cancel() {
      this.$emit('gotoList')
    }
  }
}
</script>

<style lang="less" scoped>
  .form {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .form-container {
      margin-bottom: 20px;
      display: flex;
      flex-direction: column;
      width: 60%;
    }
    .center-text {
      font-size: 16px;
      font-weight: bolder;
      height: 36px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .deploy-mode {
      display: flex;
      height: 36px;
      align-items: center;
    }
    .note {
      padding-top: 5px;
      color: rgb(170, 170, 170);
    }
    .note-text {
      font-size: 12px;
    }
    .buttons {
      display: flex;
      flex-direction: row;
      justify-content: center;
    }
    .text-red {
      color: red !important;
    }
    .advanced-container {
      width: 100%;
      border: 1px solid #b6b5b5;
      display: flex;
      flex-direction: row;
    }
    .advanced-title {
      height: 28px;
      display: flex;
      align-items: center;
      padding: 5px;
      border-right: 1px solid #b6b5b5;
      background-color: #dedddd
    }
  }
</style>
