<template>
  <div class="container">
    <div class="header">
      <div class="title">星汉未来</div>
      <div class="desc">
        <span style="color: #8c939d">账号:</span>  <span style="margin-left: 10px">{{name}}</span>
        <span style="color: #8c939d; margin-left: 200px">创建时间：</span> <span style="margin-left: 10px">2021-11-04 12:00:00</span>
      </div>
    </div>
    <div class="content">
      <div style="font-size: 16px; font-weight: bolder; margin-bottom: 20px">子账号</div>
      <div class="buttons">
        <el-button size="medium" type="primary" @click="handleCreate">+创建子账号</el-button>
        <el-button size="medium" :disabled="selectUsers.length < 1" @click="batchDisable" v-if="userType === 'ADMIN'">禁用</el-button>
        <el-button size="medium" :disabled="selectUsers.length < 1" @click="batchEnable" v-if="userType === 'ADMIN'">启用</el-button>
      </div>
      <div class="table">
        <el-table v-loading="loading" :data="list" size="medium" border @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55" align="center" />
          <el-table-column label="ID" prop="user_id" align="center" />
          <el-table-column label="用户名" prop="user_name" align="center" />
          <el-table-column label="创建人" prop="create_by" align="center" />
          <el-table-column label="创建时间" prop="create_at" align="center" />
          <el-table-column label="账户状态" align="center">
            <template slot-scope="{ row }">
              <el-switch
                v-model="row.status"
                active-color="#13ce66"
                inactive-color="#ff4949"
                size="mini"
                :disabled="userType !== 'ADMIN'"
                @change="handleStatus(row)"
              />{{ row.user_status | parseStatus }}
            </template>
          </el-table-column>
        </el-table>
        <pagination v-show="total>0" :total="total" :page.sync="listQuery.page_number" :limit.sync="listQuery.page_size" @pagination="fetchData" />
      </div>
    </div>
    <el-dialog :visible.sync="createVisible" title="添加子账号">
      <el-form ref="userForm" :model="userForm" status-icon :rules="rules" label-width="100px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="userForm.username" />
        </el-form-item>
        <el-form-item label="密码" prop="pass">
          <el-input v-model="userForm.pass" type="password" autocomplete="off" show-password />
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPass">
          <el-input v-model="userForm.checkPass" type="password" autocomplete="off" show-password />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :disabled="userForm.checkPass !== userForm.pass || userForm.username === ''" @click="submitForm('userForm')">提交</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { userList, createRamUser, ramUserEnable } from '@/api/user'
import Pagination from '@/components/Pagination'
import { mapGetters } from 'vuex'
import _ from 'lodash'
export default {
  name: 'Index',
  components: { Pagination },
  filters: {
    parseStatus(status) {
      return status === 'enable' ? '启用' : '禁用'
    }
  },
  data() {
    const validateName = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入用户名'))
      }
    }
    const validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        if (this.userForm.checkPass !== '') {
          this.$refs.userForm.validateField('checkPass')
        }
        callback()
      }
    }
    const validatePassAgain = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.userForm.pass) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      list: [],
      listQuery: {
        page_number: 1,
        page_size: 10
      },
      total: 0,
      createVisible: false,
      loading: false,
      userForm: {
        username: '',
        pass: '',
        checkPass: ''
      },
      rules: {
        username: [
          { validator: validateName, message: '请输入用户名', trigger: 'blur' }
        ],
        pass: [
          { validator: validatePass, trigger: 'blur' }
        ],
        checkPass: [
          { validator: validatePassAgain, trigger: 'blur' }
        ]
      },
      selectUsers: []
    }
  },
  computed: {
    ...mapGetters([
      'name',
      'userType'
    ])
  },
  mounted() {
    this.fetchData()
  },
  methods: {
    handleSelectionChange(val) {
      this.selectUsers = val
    },
    async fetchData() {
      this.loading = true
      const res = await userList(this.listQuery.page_number, this.listQuery.page_size)
      this.list = _.get(res, 'user_list', []).map(i => ({
        ...i,
        status: i.user_status === 'enable'
      }))
      this.total = _.get(res, 'pager.total', 0)
      this.loading = false
    },
    async handleStatus(row) {
      const action = row.status ? 'enable' : 'disable'
      const res = await ramUserEnable([row.user_name], action)
      if (res.code === 200) {
        this.$message.success('变更成功')
      }
      await this.fetchData()
    },
    handleCreate() {
      this.createVisible = true
    },
    async batchEnable() {
      const res = await ramUserEnable(this.selectUsers.map(i => i.user_name), 'enable')
      if (res.code === 200) {
        this.$message.success('启用成功')
      }
      await this.fetchData()
    },
    async batchDisable() {
      const res = await ramUserEnable(this.selectUsers.map(i => i.user_name), 'disable')
      if (res.code === 200) {
        this.$message.success('禁用成功')
      }
      await this.fetchData()
    },
    async submitForm() {
      const res = await createRamUser(this.userForm.username, this.userForm.pass)
      if (res.code === 200) {
        this.$message.success('创建成功')
        this.userForm = {
          username: '',
          pass: '',
          checkPass: ''
        }
        this.createVisible = false
        await this.fetchData()
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
      box-shadow: 4px 4px 5px rgba(0, 0, 0, .08);
      display: flex;
      flex-direction: column;
      .title {
        font-size: 25px;
        font-weight: bolder;
      }
      .desc {
        margin-top: 15px;
        display: flex;
        flex-direction: row;
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
