<template>
  <div class="container">
    <div class="header">
      <div class="search">
        <div class="search-item">
          <span class="label">机器名</span>
          <el-input v-model="search.id" size="medium" placeholder="输入机器名搜索" clearable style="width: 200px" @change="getList" />
        </div>
        <div class="search-item">
          <span class="label">IP</span>
          <el-input v-model="search.ip" size="medium" placeholder="输入IP搜索" clearable style="width: 200px" @change="getList" />
        </div>
        <div class="search-item">
          <span class="label">云厂商</span>
          <el-select v-model="search.provider" size="medium">
            <el-option v-for="p in providers" :key="p.value" :label="p.label" :value="p.value" />
          </el-select>
        </div>
      </div>
      <div class="buttons">
        <el-button size="medium" type="primary" @click="getList">查询</el-button>
        <el-button size="medium" @click="resetSearch">重置</el-button>
      </div>
    </div>
    <div class="content">
      <el-table
        v-loading="listLoading"
        size="medium"
        :data="list"
        border
        fit
        highlight-current-row
        style="width: 100%;"
      >
        <el-table-column align="center" label="机器名">
          <template slot-scope="{row}"><el-button type="text" @click="handleDetail(row)">{{ row.instance_id }}</el-button></template>
        </el-table-column>
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
        <el-table-column align="center" label="云厂商">
          <template slot-scope="{row}">{{ row.provider | filterCloudProvider }}</template>
        </el-table-column>
        <el-table-column align="center" label="所属集群">
          <template slot-scope="{row}">{{ row.cluster_name }}</template>
        </el-table-column>
        <el-table-column align="center" label="机型">
          <template slot-scope="{row}">{{ row.instance_type }}</template>
        </el-table-column>
        <el-table-column label="算力类型" prop="computing_power_type" align="center" />
        <el-table-column align="center" label="状态">
          <template slot-scope="{row}">{{ row.status | formatInstanceStatuses }}</template>
        </el-table-column>
      </el-table>
      <pagination v-show="total>0" :total="total" :page-sizes="[10,20,50]" :page.sync="listQuery.page_number" :limit.sync="listQuery.page_size" @pagination="getList" />
    </div>
    <el-dialog title="机器详情" :visible.sync="dialogFormVisible">
      <detail :detail="detail" />
    </el-dialog>
  </div>
</template>

<script>

import { cloudProviders } from '@/config/cloud'
import { filterStatuses } from '@/config/instance'
import waves from '@/directive/waves'
import { instanceDetail, instanceDescribeAll } from '@/api/instance'

import Pagination from '@/components/Pagination'
import Detail from '@/views/instance/detail'
import _ from 'lodash'

export default {
  name: 'Instance',
  components: { Pagination, Detail },
  directives: { waves },
  data() {
    return {
      search: {
        id: '',
        ip: '',
        provider: ''
      },
      providers: [{
        label: '全部',
        value: ''
      }, ...cloudProviders],
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page_number: 1,
        page_size: 10
      },
      detail: {
        create_at: null,
        instance_id: '',
        provider: '',
        region_id: '',
        image_id: '',
        instance_type: '',
        storage_config: {
          system_disk_type: '',
          system_disk_size: 0,
          data_disk_type: '',
          data_disk_size: 0,
          data_disk_num: 0
        },
        network_config: {
          vpc_name: '',
          subnet_id_name: '',
          security_group_name: ''
        },
        ip_outer: '',
        ip_inner: ''
      },
      dialogFormVisible: false,
      filterStatuses
    }
  },
  created() {
    this.getList()
  },
  methods: {
    resetSearch() {
      this.search = {
        id: '',
        ip: '',
        provider: ''
      }
    },
    async getList() {
      this.listLoading = true
      const res = await instanceDescribeAll('', this.search.id, this.search.ip, this.search.provider, '', filterStatuses, this.listQuery.page_number, this.listQuery.page_size)
      this.list = _.get(res, 'instance_list', [])
      this.total = _.get(res, 'pager.total', 0)
      this.listLoading = false
    },
    async handleDetail(row) {
      this.detail = await instanceDetail(row.instance_id)
      this.dialogFormVisible = true
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
