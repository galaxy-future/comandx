<template>
  <div class="container">
    <el-row :gutter="20">
      <el-col :span="4" class="title">
        <span class="asterisk">*</span> 星云集群名
      </el-col>
      <el-col :span="20">
        <el-input v-model="cluster_name" size="medium" style="width: 30%" placeholder="请输入集群名" />
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="4"><div style="height: 16px" /></el-col>
      <el-col :span="20">
        <div class="note">支持中文英文数字，限制20字符</div>
      </el-col>
    </el-row>
    <el-row :gutter="20" style="margin-top: 20px">
      <el-col :span="4" class="title">
        <span class="asterisk">*</span> 配置集群机器
      </el-col>
      <el-col :span="20" class="radio">
        <el-radio v-model="configType" label="quick">快捷配置</el-radio>
        <el-radio v-model="configType" label="advanced" disabled>高级配置</el-radio>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="4"><div style="height: 16px" /></el-col>
      <el-col :span="20"><div><i class="el-icon-info" style="color: green" /><span style="display: inline-block; margin-left: 5px">搭建Kubernates集群机器配置可参考</span>
        <span style="color: blue; cursor: pointer" @click="goto('https://help.aliyun.com/document_detail/98886.html#title-084-lfh-8go')">《ECS选型》</span></div></el-col>
    </el-row>
    <el-row :gutter="20" style="height: calc(98% - 203px)">
      <el-col :span="4"><div style="height: 16px" /></el-col>
      <el-col :span="20" style="height: 100%">
        <div class="transfer-container">
          <div class="transfer-item">
            <div class="transfer-title">
              <div style="margin: 20px 0  0 20px">
                <span class="transfer-step">第一步： </span><span>选择集群</span>
              </div>
              <div class="transfer-note">
                建议选择机器配置不低于8核16G的集群
              </div>
            </div>
            <div class="transfer-content">
              <el-input v-model="search" size="medium" placeholder="搜索集群名称或IP" @change="searchCluster" />
              <div class="transfer-cluster-container">
                <div v-for="(item, idx) in clusters" :key="idx" class="transfer-cluster">
                  <span class="transfer-cluster-provider">{{ item.cloud_type | filterCloudProvider }}</span>
                  <span class="transfer-cluster-name">{{ item.cluster_name }}</span>
                  <div class="transfer-check-box">
                    <el-checkbox v-model="item.checked" @change="chooseCluster(item)" />
                  </div>
                </div>
              </div>
              <div class="transfer-footer-container">
                <el-pagination
                  small
                  layout="prev, pager, next"
                  style="float: right"
                  :total="query.total"
                  :current-page.sync="query.page_number"
                  hide-on-single-page
                  @current-change="fetchData"
                />
              </div>
            </div>
          </div>
          <svg class="transfer-arrowhead">
            <use xlink:href="#icon-arrow-right" />
          </svg>
          <div class="transfer-item">
            <div class="transfer-title">
              <div style="margin: 20px 0  23px 20px">
                <span class="transfer-step">第二步： </span><span>选择配置方案</span>
              </div>
            </div>
            <div class="transfer-content">
              <div class="transfer-cluster-nodes">
                <div v-show="selectCluster.checked">
                  <div class="transfer-cluster-header">
                    <span class="transfer-cluster-provider" @click="showNodes">{{ selectCluster.cloud_type | filterCloudProvider }}</span>
                    <svg class="transfer-cluster-node-svg" @click="showNodes">
                      <use xlink:href="#icon-file-open" />
                    </svg>
                    <span class="transfer-cluster-name" @click="showNodes">{{ selectCluster.cluster_name }}</span>
                  </div>
                  <div v-show="selectCluster.nodesShow">
                    <ul class="node-tree">
                      <li v-for="(node, idx) in selectCluster.nodes" :key="idx">
                        <div class="transfer-cluster-node">
                          <svg class="transfer-cluster-node-svg">
                            <use xlink:href="#icon-cluster-node" />
                          </svg>
                          <span style="display:inline-block; margin-left: 15px">{{ node }}</span>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div class="transfer-footer-container">
                <div class="transfer-footer-node">
                  提示：搭建星云集群需满足机器数最低配置，您可以更换集群或向已选中集群增加机器
                </div>
                <el-row style="margin-top: 10px">
                  <el-col :span="1">
                    <el-radio v-model="clusterConfigType" label="standalone" :disabled="standaloneDisabled"> {{ radio }} </el-radio>
                  </el-col>
                  <el-col :span="23">
                    <div>
                      单点配置 (至少1台机器)
                    </div>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="1"><div style="height: 16px" /></el-col>
                  <el-col :span="23"><div class="note">仅可用于产品体验试用，不可用于生产</div></el-col>
                </el-row>
                <el-row style="margin-top: 10px">
                  <el-col :span="1">
                    <el-radio v-model="clusterConfigType" label="HA" :disabled="highAvailabilityDisabled"> {{ radio }} </el-radio>
                  </el-col>
                  <el-col :span="23">
                    <div>
                      高可用配置 (至少5台机器)
                    </div>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="1"><div style="height: 16px" /></el-col>
                  <el-col :span="23"><div class="note">如业务高可用诉求较强，建议使用该配置</div></el-col>
                </el-row>
              </div>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
    <div class="footer">
      <el-button size="medium" type="primary" :disabled.sync="submitDisabled" style="z-index: 999" @click="submit">开始创建</el-button>
      <el-button size="medium" style="z-index: 999" @click="cancel">取消</el-button>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
import { clusterAvailable, clusterCreate } from '@/api/galaxyCloud'
import { isIPv4 } from '@/utils'

export default {
  name: 'CreateCluster',
  data() {
    return {
      configType: 'quick',
      clusters: [],
      query: {
        page_number: 1,
        page_size: 10,
        total: 0
      },
      selectCluster: {
        cloud_type: '',
        cluster_name: '',
        nodes: [],
        nodesShow: true
      },
      clusterConfigType: '',
      radio: '',
      search: '',
      cluster_name: ''
    }
  },
  computed: {
    submitDisabled() {
      return _.isEmpty(this.cluster_name) || _.isEmpty(this.clusterConfigType) || _.isEmpty(this.selectCluster.cluster_name) || _.isEmpty(this.selectCluster.nodes)
    },
    standaloneDisabled() {
      return _.get(this.selectCluster, 'nodes.length', 0) <= 0
    },
    highAvailabilityDisabled() {
      return _.get(this.selectCluster, 'nodes.length', 0) < 5
    }
  },
  mounted() {
    this.fetchData()
  },
  methods: {
    async fetchData() {
      const res = await clusterAvailable(this.query.page_number, this.query.page_size, '', '')
      this.clusters = _.get(res, 'clusters', []).map(i => ({ ...i, checked: false }))
      this.query = {
        page_number: _.get(res, 'page_number', 1),
        page_size: _.get(res, 'page_size', 10),
        total: _.get(res, 'total', 0)
      }
    },
    async searchCluster() {
      const isIp = isIPv4(this.search)
      const res = await clusterAvailable(1, 10, isIp ? this.search : '', isIp ? '' : this.search)
      this.clusters = _.get(res, 'clusters', []).map(i => ({ ...i, checked: false }))
      this.query = {
        page_number: _.get(res, 'page_number', 1),
        page_size: _.get(res, 'page_size', 10),
        total: _.get(res, 'total', 0)
      }
    },
    chooseCluster(cluster) {
      this.selectCluster = { ...cluster, nodesShow: true }
      this.clusterConfigType = ''
      this.clusters = this.clusters.map((i) => {
        if (i.cluster_name !== cluster.cluster_name) {
          i.checked = false
        }
        return i
      })
    },
    showNodes() {
      this.selectCluster.nodesShow = !this.selectCluster.nodesShow
    },
    goto(url) {
      window.open(url)
    },
    async submit() {
      const res = await clusterCreate(this.cluster_name, this.selectCluster.cluster_name, this.clusterConfigType)
      if (res.status === 'success') {
        this.$message.success('创建成功')
        this.$router.push({ name: 'galaxyCloudClusterList' })
      } else {
        this.$message.error('创建失败')
      }
    },
    cancel() {
      this.$router.push({ name: 'galaxyCloudClusterList' })
    }
  }
}
</script>

<style lang="less" scoped>
  .container {
    position: absolute;
    margin: 10px;
    padding: 10px;
    box-shadow: 5px 5px 5px #b0afaf;
    height: 98%;
    width: calc(~"100% - 20px");
    background-color: white;
    .asterisk {
      display: inline-block;
      padding-right: 5px;
      color: #f4516c;
    }
    .title {
      display: flex;
      height: 36px;
      flex-direction: row;
      justify-content: flex-end;
      align-items: center;
    }
    .radio {
      height: 36px;
      display: flex;
      align-items: center;
    }
    .note {
      padding-top: 5px;
      font-size: 14px;
      color: rgb(170, 170,170);
    }
  }
  .footer {
    display: flex;
    justify-content: center;
  }
  .transfer-container {
    padding: 10px 0;
    display: flex;
    flex-direction: row;
    align-items: center;
    height: 100%;
    .transfer-item {
      height: 100%;
      border: 1px solid #d5d4d4;
      border-radius: 5px;
      display: flex;
      flex-basis: 40%;
      flex-direction: column;
      .transfer-title {
        box-shadow: 0 5px 5px #b0afaf;
        .transfer-step {
          font-weight: bolder;
          color: black;
        }
        .transfer-note {
          margin: 5px 0 5px 20px;
          font-size: 12px;
          color: #D9001B;
        }
      }
      .transfer-content {
        padding: 20px 10px;
        height: 100%;
        .transfer-cluster {
          padding: 10px 30px 0 5px;
          .transfer-check-box {
            float: right;
          }
        }
        .transfer-cluster-container {
          height: calc(~"100% - 230px");
          overflow-y: scroll;
        }
        .transfer-cluster-nodes {
          height: calc(~"100% - 194px");
          border: 1px solid #d5d4d4;
          border-radius: 5px;
          padding: 10px;
          overflow-y: scroll;
          .transfer-cluster-header {
            display: flex;
            flex-direction: row;
            align-items: center;
          }
        }
        .transfer-footer-container {
          height: 160px;
          padding: 10px;
          .transfer-footer-node {
            color: #D9001B;
          }
        }
        .transfer-cluster-provider {
          background-color: #00B7FF;
          display: inline-block;
          padding: 5px;
          color: white;
          border-radius: 5px;
        }
        .transfer-cluster-name {
          margin-left: 5px;
        }
      }
    }
    .transfer-arrowhead {
      width: 60px;
    }
  }
  .transfer-cluster-node {
    height: 40px;
    display: flex;
    align-items: center;
  }
  .transfer-cluster-node-svg {
    margin-left: 5px;
    height: 28px;
    width: 28px;
  }
  ul.node-tree, ul.node-tree ul {
    margin: 0;
    padding: 0 0 0 5.4em;
  }
  ul.node-tree li {
    list-style: none;
    position: relative;
    padding-left: .8rem;
  }

  ul.node-tree li:before {
    position: absolute;
    content: '';
    top: -0.01em;
    left: -0.7em;
    width: 1.5em;
    height: 1.315em;
    border-style: none none dashed dashed;
    border-width: 0.2em;
    border-color: #B8741A;
  }

  ul.node-tree li:not(:last-child):after {
    position: absolute;
    content: '';
    top: 0.7em;
    left: -0.7em;
    bottom: 0;
    border-style: none none none dashed;
    border-width: 0.2em;
    border-color: #B8741A;
  }
</style>
