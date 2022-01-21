<template>
  <div>
    <el-card>
      <el-tabs v-model="activeName">
        <el-tab-pane label="基础信息" name="info" class="base_info">
          <el-row class="base_title">
            <el-col :span="3" class="info-label">基础信息</el-col>
          </el-row>
          <el-row>
            <el-col :span="3" class="info-label">ID</el-col>
            <el-col :span="9" class="info-content">{{ cluster.id }}</el-col>
            <el-col :span="3" class="info-label">集群名称</el-col>
            <el-col :span="9" class="info-content">{{ cluster.name }}</el-col>
          </el-row>
          <el-row>
            <el-col :span="3" class="info-label">云厂商</el-col>
            <el-col :span="9" class="info-content">{{ cluster.provider | filterCloudProvider }}</el-col>
            <el-col :span="3" class="info-label">云厂商账户</el-col>
            <el-col :span="9" class="info-content">{{ cluster.account_key || '空' }}</el-col>
          </el-row>
          <el-row>
            <el-col :span="3" class="info-label">算力类型</el-col>
            <el-col :span="9" class="info-content">{{ cluster.extend_config.cpu_type }}</el-col>
            <el-col :span="3" class="info-label">付费方式</el-col>
            <el-col :span="9" class="info-content">{{ cluster.charge_config.charge_type | parsePaidType }}</el-col>
          </el-row>
          <el-row>
            <el-col :span="3" class="info-label">可用地域</el-col>
            <el-col :span="9" class="info-content">{{ cluster.region_id }}</el-col>
            <el-col :span="3" class="info-label">可用区</el-col>
            <el-col :span="9" class="info-content">{{ cluster.zone_id }}</el-col>
          </el-row>
          <el-row>
            <el-col :span="3" class="info-label">登录用户名</el-col>
            <el-col :span="9" class="info-content">{{ cluster.username }}</el-col>
            <el-col :span="3" class="info-label">登录密码</el-col>
            <el-col :span="9" class="info-content">{{ cluster.password }}</el-col>
          </el-row>
          <el-row>
            <el-col :span="3" class="info-label">集群使用方</el-col>
            <el-col :span="9" class="info-content">{{ cluster.usage }}</el-col>
            <el-col :span="3" class="info-label">集群描述</el-col>
            <el-col :span="9" class="info-content">{{ cluster.desc }}</el-col>
          </el-row>
          <el-row class="base_title">
            <el-col :span="3" class="info-label">机器配置</el-col>
          </el-row>
          <el-row>
            <el-col :span="3" class="info-label">集群机型</el-col>
            <el-col :span="9" class="info-content">{{ cluster.instance_type }}</el-col>
            <el-col :span="3" class="info-label">操作系统镜像</el-col>
            <el-col :span="9" class="info-content">{{ cluster.image_config.name }}</el-col>
          </el-row>
          <el-row>
            <el-col :span="3" class="info-label">CPU(核)</el-col>
            <el-col :span="9" class="info-content">{{ cluster.extend_config.core }}</el-col>
            <el-col :span="3" class="info-label">内存(G)</el-col>
            <el-col :span="9" class="info-content">{{ cluster.extend_config.memory }}</el-col>
          </el-row>
          <el-row>
            <el-col :span="3" class="info-label">系统盘种类</el-col>
            <el-col :span="9" class="info-content">{{ cluster.storage_config.disks.system_disk.category }}</el-col>
            <el-col :span="3" class="info-label">系统盘大小(G)</el-col>
            <el-col :span="9" class="info-content">{{ cluster.storage_config.disks.system_disk.size }}</el-col>
          </el-row>
          <el-row>
            <el-col :span="3" class="info-label">数据盘(块)</el-col>
            <el-col :span="9" class="info-content">
              <el-tooltip placement="top" effect="light">
                <div slot="content">
                  <el-table size="mini" :data="cluster.storage_config.disks.data_disk">
                    <el-table-column label="序号" align="center" width="60">
                      <template slot-scope="scope">{{ scope.$index + 1 }}</template>
                    </el-table-column>
                    <el-table-column label="数据盘类型" align="center" width="150">
                      <template slot-scope="{ row }">{{ row.category }}</template>
                    </el-table-column>
                    <el-table-column label="数据盘大小(G)" prop="size" align="center" width="100" />
                  </el-table>
                </div>
                <span class="pointer-text">{{ cluster.storage_config.disks.data_disk.length }}</span>
              </el-tooltip>
            </el-col>
            <el-col :span="3" class="info-label">数据盘总大小(G)</el-col>
            <el-col :span="9" class="info-content">
              <el-tooltip placement="top" effect="light">
                <div slot="content">
                  <el-table size="mini" :data="cluster.storage_config.disks.data_disk">
                    <el-table-column label="序号" align="center" width="60">
                      <template slot-scope="scope">{{ scope.$index + 1 }}</template>
                    </el-table-column>
                    <el-table-column label="数据盘类型" align="center" width="150">
                      <template slot-scope="{ row }">{{ row.category }}</template>
                    </el-table-column>
                    <el-table-column label="数据盘大小(G)" prop="size" align="center" width="100" />
                  </el-table>
                </div>
                <span class="pointer-text">{{ dataDiskTotalSize }}</span>
              </el-tooltip>
            </el-col>
          </el-row>
          <el-row class="base_title">
            <el-col :span="3" class="info-label">网络配置</el-col>
          </el-row>
          <el-row>
            <el-col :span="3" class="info-label">网络类型</el-col>
            <el-col :span="9" class="info-content">VPC专有网络</el-col>
            <el-col :span="3" class="info-label">VPC</el-col>
            <el-col :span="9" class="info-content">
              <el-tooltip placement="top" effect="light">
                <div slot="content">
                  <div class="tooltip-detail">
                    <div><span>VPC名称:</span>{{ vpc.VpcName }}</div>
                    <div><span>VPC ID:</span>{{ vpc.VpcId }}</div>
                    <div><span>网段:</span>{{ vpc.CidrBlock }}</div>
                    <div><span>创建时间:</span>{{ vpc.CreateAt | formatMomentZone('YYYY-MM-DD HH:mm:ss') }}</div>
                  </div>
                </div>
                <span class="pointer-text">{{ vpc.VpcName }}</span>
              </el-tooltip>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="3" class="info-label">子网</el-col>
            <el-col :span="9" class="info-content">
              <el-tooltip placement="top" effect="light">
                <div slot="content">
                  <div class="tooltip-detail">
                    <div><span>子网名称:</span>{{ subnet.SwitchName }}</div>
                    <div><span>子网ID:</span>{{ subnet.SwitchId }}</div>
                    <div><span>网段:</span>{{ subnet.CidrBlock }}</div>
                    <div><span>创建时间:</span>{{ subnet.CreateAt | formatMomentZone('YYYY-MM-DD HH:mm:ss') }}</div>
                  </div>
                </div>
                <span class="pointer-text">{{ subnet.SwitchName }}</span>
              </el-tooltip>
            </el-col>
            <el-col :span="3" class="info-label">安全组</el-col>
            <el-col :span="9" class="info-content">
              <el-tooltip placement="top" effect="light">
                <div slot="content">
                  <div class="tooltip-detail">
                    <div><span>安全组ID:</span>{{ securityGroup.security_group_id }}</div>
                    <div><span>安全组名称:</span>{{ securityGroup.security_group_name }}</div>
                    <div class="tooltip-detail-border">
                      <div v-for="(rule, idx) in securityGroup.rules" :key="idx">
                        <section><span>传输协议:</span>{{ rule.protocol }}</section>
                        <section><span>端口范围:</span>{{ rule.port_range }}</section>
                        <section><span>规则方向:</span>{{ rule.direction }}</section>
                      </div>
                    </div>
                  </div>
                </div>
                <span class="pointer-text">{{ securityGroup.security_group_name }}</span>
              </el-tooltip>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="3" class="info-label">是否公网访问</el-col>
            <el-col :span="9" class="info-content">{{ networkSwitch ? '是' : '否' }}</el-col>
            <el-col v-show="networkSwitch" :span="3" class="info-label">IP类型</el-col>
            <el-col v-show="networkSwitch" :span="9" class="info-content">{{ cluster.network_config.internet_ip_type }}</el-col>
          </el-row>
          <el-row v-show="networkSwitch">
            <el-col :span="3" class="info-label">付费方式</el-col>
            <el-col :span="9" class="info-content">{{ cluster.network_config.internet_charge_type | parseNetworkPaidType }}</el-col>
            <el-col :span="3" class="info-label">带宽(M)</el-col>
            <el-col :span="9" class="info-content">{{ cluster.network_config.internet_max_bandwidth_out }}</el-col>
          </el-row>
        </el-tab-pane>
        <el-tab-pane label="机器列表" name="instance">
          <div style="margin-bottom: 20px; float: right">
            <el-button size="medium" type="primary" :loading="downloading" @click="handleDownload">导出Excel</el-button>
          </div>
          <el-table :data="instanceList" border>
            <el-table-column align="center" label="状态">
              <template slot-scope="{row}">{{ row.status | formatInstanceStatuses }}</template>
            </el-table-column>
            <el-table-column align="center" prop="instance_id" label="机器名" />
            <el-table-column align="center" label="IP">
              <template slot-scope="{row}">
                <div v-if="row.ip_inner !== ''">
                  {{ row.ip_inner }}(内网)
                </div>
                <div v-if="row.ip_outer !== ''">
                  {{ row.ip_outer }}(公网)
                </div>
              </template>
            </el-table-column>
            <el-table-column align="center" label="机型">
              <template slot-scope="{row}">{{ row.instance_type }}</template>
            </el-table-column>
            <el-table-column label="所属云厂商">
              <template slot-scope="{row}">
                {{ row.provider | filterCloudProvider }}
              </template>
            </el-table-column>
            <el-table-column label="付费方式">
              <template slot-scope="{row}">
                {{ row.charge_type | parsePaidType }}
              </template>
            </el-table-column>
            <el-table-column align="center" label="登录名">
              <template slot-scope="{row}">
                <el-tooltip effect="dark" content="点击复制" placement="bottom">
                  <span v-clipboard:copy="row.login_name" v-clipboard:success="clipboardSuccess" style="cursor: pointer">{{ row.login_name }}</span>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column align="center" label="密码">
              <template slot-scope="{row}">
                <el-tooltip effect="dark" content="点击复制" placement="bottom">
                  <span v-clipboard:copy="row.login_password" v-clipboard:success="clipboardSuccess" style="cursor: pointer">{{ row.login_password }}</span>
                </el-tooltip>
              </template>
            </el-table-column>
          </el-table>
          <pagination v-show="instanceTotal>0" :total="instanceTotal" :page.sync="instanceListQuery.page_number" :limit.sync="instanceListQuery.page_size" @pagination="fetchData" />
        </el-tab-pane>
        <el-tab-pane label="扩缩容历史" name="el">
          <el-table v-loading="historyLoading" :data="history" size="medium" border highlight-current-row>
            <el-table-column label="执行状态" align="center">
              <template slot-scope="{row}">
                <span v-if="row.task_status === 'FAILED'" style="display: inline-block; padding: 2px 5px; background-color: red; color: white; border-radius: 10px">失败</span>
                <span v-else> {{ row.task_status | parseTaskStatusRoughly }}</span>
              </template>
            </el-table-column>
            <el-table-column label="流水号" align="center">
              <template slot-scope="{row}">
                {{ row.task_id }}
              </template>
            </el-table-column>
            <el-table-column label="执行时间" align="center">
              <template slot-scope="{ row }">
                {{ row.create_at | formatMomentZone('YYYY-MM-DD HH:mm:ss') }}
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
            <el-table-column label="执行方" align="center" prop="create_by" />
            <el-table-column label="集群机器数变动" align="center">
              <template slot-scope="{row}">
                {{ row.before_instance_count }} --> {{ row.after_instance_count }}
              </template>
            </el-table-column>
            <el-table-column label="耗时" align="center">
              <template slot-scope="{ row }">
                {{ row.execute_time | parseMin }}
              </template>
            </el-table-column>
          </el-table>
          <pagination v-show="historyQuery.total>0" :total="historyQuery.total" :page.sync="historyQuery.page_number" :limit.sync="historyQuery.page_size" @pagination="fetchHistory" />
        </el-tab-pane>
        <el-tab-pane label="变更历史" name="log">变更历史</el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
import _ from 'lodash'
import Pagination from '@/components/Pagination'
import { instanceDescribeAll } from '@/api/instance'
import { filterStatuses } from '@/config/instance'
import clipboard from '@/directive/clipboard/index'
import { clusterDescribe } from '@/api/cluster'
import { taskDescribeAll } from '@/api/task'
import { vpcInfo, subnetInfo, securityGroupInfo } from '@/api/cloud'

export default {
  name: 'Detail',
  directives: {
    clipboard
  },
  components: { Pagination },
  data() {
    return {
      instanceList: [],
      activeName: 'info',
      instanceListQuery: {
        page_size: 10,
        page_number: 1
      },
      instanceTotal: 0,
      downloading: false,
      filterStatuses,
      cluster: {
        charge_config: {},
        extend_config: {},
        image_config: {},
        storage_config: {
          disks: {
            system_disk: {},
            data_disk: []
          }
        },
        network_config: {}
      },
      networkSwitch: false,
      history: [],
      historyQuery: {
        total: 0,
        page_size: 10,
        page_number: 1
      },
      historyLoading: false,
      dataDiskTotalSize: 0,
      vpc: {},
      subnet: {},
      securityGroup: {}
    }
  },
  mounted() {
    this.fetchData()
  },
  methods: {
    async fetchData() {
      if (this.$route.params.name !== '') {
        const res = await instanceDescribeAll('', '', '', '', this.$route.params.name, filterStatuses, this.instanceListQuery.page_number, this.instanceListQuery.page_size)
        this.instanceList = _.get(res, 'instance_list', []) || []
        this.instanceTotal = _.get(res, 'pager.total', 0)
        this.cluster = await clusterDescribe(this.$route.params.name)
        this.dataDiskTotalSize = _.sum(this.cluster.storage_config.disks.data_disk.map(i => i.size))
        this.networkSwitch = this.cluster.network_config.internet_charge_type !== ''
        await this.fetchHistory()
        await this.loadCloud()
      }
    },
    async loadCloud() {
      this.vpc = await vpcInfo(this.cluster.network_config.vpc)
      console.log(this.vpc)
      this.subnet = await subnetInfo(this.cluster.network_config.vpc, this.cluster.network_config.subnet_id)
      console.log(this.subnet)
      this.securityGroup = await securityGroupInfo(this.cluster.network_config.vpc, this.cluster.network_config.security_group, this.cluster.provider, this.cluster.region_id)
      console.log(this.securityGroup)
    },
    async fetchHistory() {
      this.historyLoading = true
      const res = await taskDescribeAll('', this.$route.params.name, '', this.historyQuery.page_number, this.historyQuery.page_size)
      this.history = res.task_list
      this.historyQuery = {
        total: _.get(res, 'pager.total', 0),
        page_size: _.get(res, 'pager.page_size', 10),
        page_number: _.get(res, 'pager.page_number', 1)
      }
      this.historyLoading = false
    },
    clipboardSuccess() {
      this.$message.success('复制成功')
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['机器名', '内网IP', '公网IP', '机型', '状态', '登录名', '密码']
        const filterVal = ['instance_id', 'ip_inner', 'ip_outer', 'instance_type', 'status']
        const data = this.formatJson(filterVal)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'instance-list'
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal) {
      return this.instanceList.map(v => filterVal.map(j => _.get(v, j, '')))
    }
  }
}
</script>

<style lang="less" scoped>
.info-title {
  font-size: 20px;
  padding: 10px;
}
.info-label {
  color: #7f7f7f;
  display: flex;
  flex-direction: row-reverse;
}
.info-content {
  color: #333333;
  padding-left: 20px;
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

.base_info {
  .info-label,
  .info-content {
    padding: 10px;
  }
}

.base_title {
  line-height: 30px;
  font-size: 20px;
  font-weight: bolder;

  .info-label {
    color: #8080e1;
  }
}
.pointer-text {
  color: blue;
  cursor: pointer;
}
.tooltip-detail {
  span {
    color: #8c939d;
    display: inline-block;
    width: 80px;
    padding-right: 10px;
    text-align: right
  }
  .tooltip-detail-border {
    margin-top: 10px;
    div {
      border-top: 2px solid #e3e3e5;
    }
    div:last-child {
      border-bottom: 2px solid #e3e3e5;
    }
  }
}
</style>
