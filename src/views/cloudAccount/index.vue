<style lang="less">
 .cloud-account-dialog {
   .el-dialog__footer {
     text-align: center;
   }
 }
</style>
<template>
  <div class="container">
    <div class="header">
      <div class="search">
        <div class="search-item">
          <span class="label">账户名</span>
          <el-input v-model="search.name" size="medium" placeholder="输入账户名搜索" clearable style="width: 200px" @change="fetchData" />
        </div>
        <div class="search-item">
          <span class="label">云厂商</span>
          <el-select v-model="search.provider" size="medium" @change="fetchData">
            <el-option v-for="p in providers" :key="p.value" :label="p.label" :value="p.value" />
          </el-select>
        </div>
        <div class="search-item">
          <span class="label">账户信息</span>
          <el-input v-model="search.account" size="medium" placeholder="输入账户信息搜索" clearable style="width: 200px" @change="fetchData" />
        </div>
      </div>
      <div class="buttons">
        <el-button size="medium" type="primary" @click="fetchData">查询</el-button>
        <el-button size="medium" @click="resetSearch">重置</el-button>
      </div>
    </div>
    <div class="content">
      <div class="buttons">
        <el-button size="medium" type="primary" @click="addAccount">+添加云账户</el-button>
        <el-button size="medium" :disabled="selectAccounts.length !== 1" @click="editAccount">编辑</el-button>
        <el-button size="medium" :disabled="selectAccounts.length < 1" @click="deleteAccounts">删除</el-button>
      </div>
      <div class="table">
        <el-table v-loading="loading" :data="accounts" border @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55" align="center" />
          <el-table-column label="账户名" prop="account_name" align="center" />
          <el-table-column label="云厂商" align="center">
            <template slot-scope="{row}">
              {{ row.provider | filterCloudProvider }}
            </template>
          </el-table-column>
          <el-table-column label="创建人" prop="create_by" align="center" />
          <el-table-column label="创建时间" align="center">
            <template slot-scope="{row}">
              {{ row.create_at | formatMomentZone('YYYY-MM-DD HH:mm:ss') }}
            </template>
          </el-table-column>
          <el-table-column label="账户信息" prop="account" align="center">
            <template slot-scope="{ row }">
              {{ obscureAk(row.account) }}
              <el-button type="text" @click="showDetail(row)">查看</el-button>
            </template>
          </el-table-column>
        </el-table>
        <pagination v-show="total>0" :total="total" :page.sync="listQuery.page_number" :limit.sync="listQuery.page_size" @pagination="fetchData" />
      </div>
    </div>
    <el-dialog :visible.sync="addVisible" title="添加账户" width="40%">
      <div class="form">
        <div class="form-container">
          <el-row>
            <el-col :span="8"><div class="center-text">账户描述 </div></el-col>
            <el-col :span="16">
              <el-input v-model="addForm.account_name" size="medium" placeholder="请填写账户名" maxlength="10" show-word-limit />
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8"><div style="height: 16px" /></el-col>
            <el-col :span="16"><div class="note">支持中文英文数字，限制10字符</div></el-col>
          </el-row>
        </div>
        <div class="form-container">
          <el-row>
            <el-col :span="8"><div class="center-text">云厂商 </div></el-col>
            <el-col :span="16">
              <el-select v-model="addForm.provider" size="medium" style="width: 100%">
                <el-option v-for="p in cloudProviders" :key="p.value" :value="p.value" :label="p.label" />
              </el-select>
            </el-col>
          </el-row>
        </div>
        <div class="form-container">
          <el-row>
            <el-col :span="8"><div class="center-text">{{ keyLabel }} </div></el-col>
            <el-col :span="14">
              <el-input v-model="addForm.key" size="medium" :placeholder="'请输入'+keyLabel" />
            </el-col>
            <el-col :span="2"><el-button type="text" size="medium" style="margin-left: 5px" @click="gotoRam">获取</el-button></el-col>
          </el-row>
        </div>
        <div class="form-container">
          <el-row>
            <el-col :span="8"><div class="center-text">{{ secretLabel }} </div></el-col>
            <el-col :span="16">
              <el-input v-model="addForm.secret" size="medium" :placeholder="'请输入'+secretLabel" />
            </el-col>
          </el-row>
        </div>
        <div class="form-alarm">
          <label>注意</label>
          <span class="form-alarm-content">
            请认真核对AK/SK信息填写是否正确，同时确认AK/SK 关联的云厂商账户已经完成<strong @click="gotoAuthc">实名认证</strong>，否则将无法进行扩缩容云服务器操作
          </span>
        </div>
        <div class="form-container">
          <div class="buttons">
            <el-button size="medium" type="info" @click="cancelAdd">取消</el-button>
            <el-button size="medium" type="primary" @click="submitAdd">保存</el-button>
          </div>
        </div>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="editVisible" title="修改账户名称" width="40%">
      <div class="form">
        <div class="form-container">
          <el-row>
            <el-col :span="6"><div class="center-text">账户名 </div></el-col>
            <el-col :span="18">
              <el-input v-model="editItem.account_name" size="medium" placeholder="请填写账户名" maxlength="10" show-word-limit />
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6"><div style="height: 16px" /></el-col>
            <el-col :span="18"><div class="note">支持中文英文数字，限制10字符</div></el-col>
          </el-row>
        </div>
        <div class="form-container">
          <div class="buttons">
            <el-button size="medium" type="info" @click="cancelEdit">取消</el-button>
            <el-button size="medium" type="primary" @click="submitEdit">保存</el-button>
          </div>
        </div>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="showDetailVisible" custom-class="cloud-account-dialog" title="账户信息" width="40%">
      <el-row style="font-weight: bolder; font-size: 16px">
        <el-col :span="8" style="display: flex; justify-content: center;">
          {{ aksk[account.provider].key }}
        </el-col>
        <el-col :span="12">
          {{ account.account }}
        </el-col>
        <el-col :span="4">
          <span
            v-clipboard:copy="account.account"
            v-clipboard:success="clipboardSuccess"
            style="display: inline-block; margin-left: 10px;cursor: pointer; font-size: 16px; color: #A8AAA9"
          >
            复制
          </span>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button size="mediun" type="primary" @click="showDetailVisible = false">关 闭</el-button>
      </span>
    </el-dialog>
    <el-dialog :visible.sync="detailLoginVisible" title="输入密码" width="40%" @close="clearPassword">
      <div class="form">
        <div class="form-container">
          <div>
            <span style="background-color: #F1F2F2; color: #A7A9A8; font-size: 16px; display: inline-block; padding: 2px 5px">
              提示： 输入密码查看AK
            </span>
          </div>
        </div>
        <div class="form-container">
          <div style="display: flex; flex-direction: row">
            <div class="center-text" style="justify-content: flex-start; width: 100px">用户名: </div>
            <div style="height: 36px; display: flex; align-items: center; font-size: 16px">{{ name }}</div>
          </div>
        </div>
        <div class="form-container">
          <div style="display: flex; flex-direction: row">
            <div class="center-text" style="justify-content: flex-start; width: 100px">密码: </div>
            <el-input v-model="password" autocomplete="off" style="width: 80%" show-password />
          </div>
        </div>
        <div class="form-container">
          <div class="buttons">
            <el-button size="medium" type="info" @click="detailLoginVisible = false">取消</el-button>
            <el-button size="medium" type="primary" @click="detailLogin">确认</el-button>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import _ from 'lodash'
import { cloudProviders, aksk, ramUrl } from '@/config/cloud'
import { mapGetters } from 'vuex'
import { cloudAccountList, cloudAccountEdit, cloudAccountAdd, cloudAccountDelete } from '@/api/cloud'
import { login } from '@/api/user'
import Pagination from '@/components/Pagination'
import clipboard from '@/directive/clipboard/index'

export default {
  name: 'Index',
  components: { Pagination },
  directives: {
    clipboard
  },
  data() {
    return {
      cloudProviders,
      aksk,
      loading: false,
      editVisible: false,
      addVisible: false,
      detailLoginVisible: false,
      showDetailVisible: false,
      account: {
        provider: 'AlibabaCloud'
      },
      accounts: [],
      providers: [{
        value: '',
        label: '全部'
      }, ...cloudProviders],
      search: {
        name: '',
        provider: '',
        account: ''
      },
      listQuery: {
        page_number: 1,
        page_size: 10
      },
      total: 0,
      addForm: {
        account_name: '',
        provider: 'AlibabaCloud',
        key: '',
        secret: ''
      },
      editItem: {
        account_name: ''
      },
      selectAccounts: [],
      password: ''
    }
  },
  computed: {
    keyLabel() {
      return _.get(aksk, `${this.addForm.provider}.key`, 'key')
    },
    secretLabel() {
      return _.get(aksk, `${this.addForm.provider}.secret`, 'secret')
    },
    ...mapGetters([
      'name'
    ])
  },
  mounted() {
    this.fetchData()
  },
  methods: {
    async fetchData() {
      this.loading = true
      const res = await cloudAccountList(this.search.name, this.search.provider, this.search.account, this.listQuery.page_number, this.listQuery.page_size)
      this.total = _.get(res, 'pager.total', 0)
      this.accounts = _.get(res, 'account_list', [])
      this.loading = false
    },
    resetSearch() {
      this.search = {
        name: '',
        provider: ''
      }
      this.fetchData()
    },
    handleSelectionChange(val) {
      this.selectAccounts = val
    },
    addAccount() {
      this.addVisible = true
    },
    cancelAdd() {
      this.addVisible = false
    },
    async submitAdd() {
      try {
        const res = await cloudAccountAdd(this.addForm.account_name, this.addForm.provider, (this.addForm.key).trim(), (this.addForm.secret).trim())
        if (res.code === 200) {
          this.$message.success('添加成功')
          this.addForm = {
            account_name: '',
            provider: 'AlibabaCloud',
            key: '',
            secret: ''
          }
        }
      } catch (e) {
        this.$message.error('该云厂商账户的AK/SK 不存在！！ 请登录云厂商平台检查该账户是否有效')
      }
      this.addVisible = false
      await this.fetchData()
    },
    cancelEdit() {
      this.editVisible = false
    },
    async submitEdit() {
      try {
        const res = await cloudAccountEdit(this.editItem.id, this.editItem.account_name)
        if (res.code === 200) {
          this.$message.success('修改成功')
        }
      } catch (e) {
        this.$message.error('修改失败')
      }
      this.editVisible = false
      await this.fetchData()
    },
    editAccount() {
      this.editItem = this.selectAccounts[0]
      this.editVisible = true
    },
    async deleteAccounts() {
      try {
        await this.$confirm('该操作将影响云厂商账号关联的所有云服务器相关操作, 确定要删除吗?', '警告', {
          confirmButtonText: '删除',
          cancelButtonText: '取消',
          type: 'warning'
        })
        const res = await cloudAccountDelete(this.selectAccounts.map(i => i.id))
        if (res.code === 200) {
          this.$message.success('删除成功')
        }
        await this.fetchData()
      } catch (e) {
        // do nothing
      }
    },
    gotoRam() {
      const url = _.get(ramUrl, this.addForm.provider, '')
      if (!_.isEmpty(url)) {
        window.open(url)
      } else {
        this.$message.error('请选择云厂商')
      }
    },
    gotoAuthc() {
      const map = {
        AlibabaCloud: 'https://account.console.aliyun.com/v2/#/authc/home',
        HuaweiCloud: 'https://account.huaweicloud.com/usercenter/?region=cn-north-4#/accountindex/realNameAuth',
        TencentCloud: 'https://console.cloud.tencent.com/developer/auth'
      }
      window.open(_.get(map, this.addForm.provider))
    },
    showDetail(row) {
      this.account = row
      this.detailLoginVisible = true
    },
    async detailLogin() {
      const res = await login({
        username: this.name.trim(),
        password: this.password
      })
      if (res.code === 200) {
        this.$store.commit('user/SET_TOKEN', res.data)
        this.showDetailVisible = true
      } else {
        this.$message.error('密码错误')
      }
      this.detailLoginVisible = false
    },
    obscureAk(str) {
      return `${str.slice(0, 4)}******${str.slice(-4)}`
    },
    clipboardSuccess() {
      this.$message.success('已复制到剪切板')
    },
    clearPassword() {
      this.password = ''
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
  .form {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .form-container {
      margin-bottom: 20px;
      display: flex;
      flex-direction: column;
      width: 80%;
    }
    .center-text {
      font-size: 16px;
      font-weight: bolder;
      height: 36px;
      display: flex;
      justify-content: flex-end;
      padding-right: 35px;
      align-items: center;
    }
    .note {
      padding-top: 5px;
      color: rgb(170, 170,170);
    }
    .buttons {
      margin-top: 20px;
      display: flex;
      flex-direction: row;
      justify-content:flex-end;
    }
    .form-alarm {
      background-color: #eaeaea;
      padding: 5px;
      display: flex;
      flex-direction: column;
      label {
        color: #f4516c;
      }
      .form-alarm-content {
        padding: 20px;
        strong {
          cursor: pointer;
          color: #0061e0;
          text-decoration: underline;
        }
      }
    }
  }
</style>
