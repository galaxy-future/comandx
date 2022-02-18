<template>
  <div class="container">
    <el-tabs v-model="activeTab" class="content">
      <el-tab-pane label="zadig" name="zadig">
        <div class="buttons">
          <el-button size="medium" type="primary" :disabled="accounts.length > 0" @click="addZadig">
            +添加账户
          </el-button>
          <el-button size="medium" type="danger" :disabled="selectAccounts.length < 1" @click="deleteZadig">
            删除账户
          </el-button>
        </div>
        <div class="table">
          <el-table :data="accounts" size="medium" border @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55" align="center" />
            <el-table-column label="ID" prop="id" align="center" />
            <el-table-column label="Admin账户" prop="account" align="center" />
            <el-table-column label="创建人" prop="create_by" align="center" />
            <el-table-column label="创建时间" align="center">
              <template slot-scope="{ row }">
                {{ row.create_at | formatServiceMoment('YYYY-MM-DD HH:mm:ss') }}
              </template>
            </el-table-column>
          </el-table>
          <pagination v-show="query.total>0" :total="query.total" :page-sizes="[10,20,50]" :page.sync="query.page_num" :limit.sync="query.page_size" @pagination="fetchData" />
        </div>
      </el-tab-pane>
    </el-tabs>
    <el-dialog :visible.sync="addZadigVis" title="添加账户" width="30%">
      <el-form label-width="80px">
        <el-form-item label="访问域名" required>
          <div style="display: flex; flex-direction: row">
            <el-select v-model="protocol" size="medium" style="width: 180px" placeholder="请选择协议">
              <el-option v-for="(p, idx) in protocols" :key="idx" :label="p" :value="p" />
            </el-select>
            <el-input v-model="hostPort" size="medium" placeholder="请输入访问地址，例如127.0.0.1:80" style="margin-left: 10px" />
          </div>
        </el-form-item>
        <el-form-item label="账户名" required>
          <el-input v-model="addZadigForm.username" size="medium" />
        </el-form-item>
        <el-form-item label="密码" required>
          <el-input v-model="addZadigForm.password" size="medium" show-password />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addZadigVis = false">取消</el-button>
        <el-button type="primary" :disabled="addZadigDisabled" @click="submitAddZadig">保存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { createIntegration, integrationList, deleteIntegration } from '@/api/service'
import Pagination from '@/components/Pagination'
import _ from 'lodash'

export default {
  name: 'List',
  components: { Pagination },
  data() {
    return {
      activeTab: 'zadig',
      accounts: [],
      addZadigVis: false,
      protocol: '',
      hostPort: '',
      protocols: ['http', 'https', 'ftp', 'file'],
      addZadigForm: {
        domain: '',
        username: '',
        password: ''
      },
      query: {
        page_num: 1,
        page_size: 20,
        total: 0
      },
      selectAccounts: []
    }
  },
  computed: {
    addZadigDisabled() {
      return this.protocol === '' ||
          this.hostPort === '' ||
          !this.hostPortIsLegal ||
          this.addZadigForm.username === '' ||
          this.addZadigForm.password === ''
    },
    hostPortIsLegal() {
      return /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\:([0-9]|[1-9]\d{1,3}|[1-5]\d{4}|6[0-5]{2}[0-3][0-5])$/.test(this.hostPort) ||
          /(www\.)?(([A-Za-z0-9-~]+)\.)+([A-Za-z0-9-~\/])+$/.test(this.hostPort)
    }
  },
  mounted() {
    this.fetchData()
  },
  methods: {
    async fetchData() {
      const res = await integrationList(this.activeTab, this.query.page_num, this.query.page_size)
      this.accounts = _.get(res, 'integration_list', [])
      this.query.total = _.get(res, 'pager.total', 0)
    },
    addZadig() {
      this.addZadigVis = true
    },
    async deleteZadig() {
      try {
        await this.$confirm('确定删除吗?', '警告', {
          confirmButtonText: '删除',
          cancelButtonText: '取消',
          type: 'warning'
        })
        const res = await deleteIntegration(this.selectAccounts.map(i => i.id))
        if (res.code === 200) {
          this.$message.success('删除成功')
          await this.fetchData()
        } else {
          this.$message.error('删除失败')
        }
      } catch (e) {
        // nothing
      }
    },
    async submitAddZadig() {
      const res = await createIntegration(`${this.protocol}://${this.hostPort}`, this.addZadigForm.username, this.addZadigForm.password, this.activeTab)
      if (res.code === 200) {
        this.$message.success('创建成功')
      } else {
        this.$message.error('创建失败')
      }
      await this.fetchData()
      this.addZadigVis = false
    },
    handleSelectionChange(val) {
      this.selectAccounts = val
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
    .content {
      width: 100%;
      height: 98%;
      overflow-y: scroll;
      background-color: #ffffff;
      padding: 20px;
      box-shadow: 4px 4px 5px rgba(0, 0, 0, .08);
      .buttons {
      }
      .table {
        margin-top: 10px;
      }
    }
  }
</style>
