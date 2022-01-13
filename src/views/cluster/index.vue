<template>
  <div class="container">
    <div class="header">
      <div class="search">
        <div class="search-item">
          <span class="label">集群名</span>
          <el-input v-model="search.cluster_name" size="medium" placeholder="输入集群名称搜索" clearable style="width: 200px" @change="fetchData" @clear="fetchData" />
        </div>
        <div class="search-item">
          <span class="label">云厂商</span>
          <el-select v-model="search.provider" size="medium" @change="fetchData">
            <el-option v-for="p in providers" :key="p.value" :label="p.label" :value="p.value" />
          </el-select>
        </div>
        <div class="search-item">
          <span class="label">Access Key</span>
          <el-select v-model="search.ak" v-load-more="loadMore" size="medium" @change="fetchData">
            <el-option v-for="(p, idx) in accounts" :key="idx" :label="p.account_name" :value="p.account" />
          </el-select>
        </div>
      </div>
      <div class="buttons">
        <el-button size="medium" type="primary" @click="fetchData">查询</el-button>
        <el-button size="medium" @click="resetSearch">重置</el-button>
      </div>
    </div>
    <div class="content">
      <div class="buttons">
        <el-button size="medium" type="primary" @click="handleCreate">+创建集群</el-button>
        <el-button size="medium" :disabled="selectClusters.length !== 1" @click="edit">编辑</el-button>
        <el-button size="medium" :disabled="selectClusters.length < 1" @click="handleDelete">删除</el-button>
      </div>
      <div class="table">
        <el-table
          v-loading="listLoading"
          :data="list"
          border
          fit
          highlight-current-row
          size="medium"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55" />
          <el-table-column label="ID" prop="cluster_id" align="center" />
          <el-table-column label="集群名称" min-width="100px" align="center">
            <template slot-scope="{row}">
              <el-button size="medium" type="text" @click="gotoInfo(row.cluster_name)">{{ row.cluster_name }}</el-button>
            </template>
          </el-table-column>
          <el-table-column label="在线机器数" prop="instance_count" align="center" />
          <el-table-column label="集群机型" prop="instance_type" align="center" min-width="160px" />
          <el-table-column label="使用方" align="center">
            <template slot-scope="{ row }">
              {{ row.usage | parseUsage }}
            </template>
          </el-table-column>
          <el-table-column label="云厂商" width="150px" align="center">
            <template slot-scope="{row}">
              {{ row.provider | filterCloudProvider }}
            </template>
          </el-table-column>
          <el-table-column label="付费方式" align="center">
            <template slot-scope="{row}">
              {{ row.charge_type | parsePaidType }}
            </template>
          </el-table-column>
          <el-table-column label="云账号Key" min-width="160px" align="center">
            <template slot-scope="{row}">
              <span>{{ row.account }}</span>
            </template>
          </el-table-column>
          <el-table-column label="最后编辑人" prop="update_by" align="center" />
          <el-table-column label="最后编辑时间" class-name="status-col" width="160" align="center">
            <template slot-scope="{row}">
              <span>
                {{ row.update_at | formatMomentZone('YYYY-MM-DD HH:mm:ss') }}
              </span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="{row}">
              <el-button type="text" @click="transfer(row)">扩缩容</el-button>
            </template>
          </el-table-column>
        </el-table>
        <pagination v-show="total>0" :total="total" :page.sync="listQuery.page_number" :limit.sync="listQuery.page_size" @pagination="fetchData" />
      </div>
    </div>
  </div>
</template>

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
        width: 200px;
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
</style>

<script>
import { clusterDescribeAll, clusterDelete } from '@/api/cluster'
import { cloudAccountList } from '@/api/cloud'
import { cloudProviders } from '@/config/cloud'
import Pagination from '@/components/Pagination'
import loadMore from '@/directive/el-select-load-more'
import _ from 'lodash'

export default {
  name: 'Cluster',
  components: { Pagination },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  directives: {
    loadMore
  },
  data() {
    return {
      cloudProviders,
      providers: [{
        value: '',
        label: '全部'
      }, ...cloudProviders],
      accounts: [],
      list: null,
      total: 0,
      listLoading: true,
      search: {
        cluster_name: '',
        provider: '',
        ak: ''
      },
      listQuery: {
        page_number: 1,
        page_size: 10
      },
      selectClusters: [],
      dialogFormVisible: false,
      createDialogVisible: false,
      step: 0,
      clusterDetail: {
        storage_config: {
          disks: {
            system_disk: {
              category: '',
              size: 0
            },
            data_disk: [{
              category: '',
              size: 0
            }]
          }
        },
        network_config: {}
      },
      accountQuery: {
        page_number: 1,
        page_size: 50
      }
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    async fetchData() {
      this.listLoading = true
      const cRes = await cloudAccountList('', '', '', this.accountQuery.page_number, this.accountQuery.page_size)
      this.accounts = [{
        account: '',
        account_name: '全部'
      }, ..._.get(cRes, 'account_list', [])]
      const res = await clusterDescribeAll(this.search.cluster_name, this.search.provider, this.search.ak, '', 'standard', this.listQuery.page_number, this.listQuery.page_size)
      this.list = _.get(res, 'cluster_list', [])
      this.total = res.pager.total
      this.listLoading = false
    },
    resetSearch() {
      this.search = {
        clusterName: '',
        ak: '',
        provider: ''
      }
      this.fetchData()
    },
    handleSelectionChange(val) {
      this.selectClusters = val
    },
    async showDetail(row) {
    },
    edit() {
      this.$router.push({ path: `/cluster/edit/${this.selectClusters[0].cluster_name}` })
    },
    handleFilter() {
      this.listQuery.page_number = 1
      this.fetchData()
    },
    handleModifyStatus(row, status) {
      this.$message({
        message: '操作Success',
        type: 'success'
      })
      row.status = status
    },
    handleCreate() {
      this.$router.push({ name: 'clusterCreate' })
    },
    gotoInfo(name) {
      this.$router.push({ name: 'clusterInfo', params: { name }})
    },
    transfer(cluster) {
      this.$router.push({ name: 'createOnceTask', query: { cluster: cluster.cluster_name } })
    },
    async handleDelete() {
      try {
        await this.$confirm('确定删除吗?', '警告', {
          confirmButtonText: '删除',
          cancelButtonText: '取消',
          type: 'warning'
        })
        const res = await clusterDelete(this.selectClusters.map(i => i.cluster_id))
        if (res.code === 200) {
          this.$message.success('删除成功')
          await this.fetchData()
        }
      } catch (e) {
        // do nothing
      }
    },
    async loadMore() {
      this.accountQuery.page_number++
      const res = await cloudAccountList('', '', this.accountQuery.page_number, this.accountQuery.page_size)
      this.accounts = _.concat(this.accounts, ..._.get(res, 'account_list', []))
    }
  }
}
</script>
