<template>
  <div class="container">
    <div class="header">
      <div class="title">
        {{ orgName }}
        <i v-show="name === 'root'" class="el-icon-edit-outline" style="color: #00B7FF; cursor: pointer" @click="showEdit" />
      </div>
      <div class="desc">
        <span style="color: #8c939d">账号:</span>  <span style="margin-left: 10px">{{ name }}</span>
        <span style="color: #8c939d; margin-left: 200px">创建时间：</span><span style="margin-left: 10px">{{ userCreateTime }}</span>
      </div>
    </div>
    <div class="content">
      <div style="font-size: 16px; font-weight: bolder; margin-bottom: 20px">子账号</div>
      <div v-if="userType === 'ADMIN'" class="buttons">
        <el-button size="medium" type="primary" @click="handleCreate">+创建子账号</el-button>
        <el-button v-show="name === 'root'" size="medium" :disabled="selectUsers.length < 1" @click="editUsersRight">修改权限</el-button>
        <el-button size="medium" :disabled="selectUsers.length < 1" @click="batchDisable">禁用</el-button>
        <el-button size="medium" :disabled="selectUsers.length < 1" @click="batchEnable">启用</el-button>
      </div>
      <div class="table">
        <el-table ref="userTable" v-loading="loading" :data="list" size="medium" border @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55" align="center" :selectable="tableSelectAble" />
          <el-table-column label="ID" prop="user_id" align="center" />
          <el-table-column label="用户名" prop="user_name" align="center" />
          <el-table-column label="角色" align="center">
            <template slot-scope="{ row }">
              {{ row.user_type | formatUserType }}
            </template>
          </el-table-column>
          <el-table-column label="创建人" prop="create_by" align="center" />
          <el-table-column label="创建时间" prop="create_at" align="center" />
          <el-table-column label="账户状态" align="center">
            <template slot-scope="{ row }">
              <el-switch
                v-model="row.status"
                active-color="#13ce66"
                inactive-color="#ff4949"
                size="mini"
                :disabled="getHandleStatusDisabled(row)"
                @change="handleStatus(row)"
              />{{ row.user_status | parseStatus }}
            </template>
          </el-table-column>
        </el-table>
        <pagination v-show="total>0" :total="total" :page.sync="listQuery.page_number" :limit.sync="listQuery.page_size" @pagination="fetchData" />
      </div>
    </div>
    <el-dialog :visible.sync="createVisible" title="添加子账号" width="40%">
      <el-row>
        <el-col :span="8"><div class="center-text"><div class="asterisk">*</div>用户名</div></el-col>
        <el-col :span="16">
          <el-input v-model="userForm.username" placeholder="请输入用户名" style="width: 80%" size="medium" />
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8"><div style="height: 16px" /></el-col>
        <el-col :span="16">
          <div class="note" :class="{ 'text-red': !usernameValidate }">
            仅支持英文、数字，限制32个字符
          </div>
        </el-col>
      </el-row>
      <el-row style="margin-top: 10px">
        <el-col :span="8"><div class="center-text"><div class="asterisk">*</div>密码</div></el-col>
        <el-col :span="16">
          <el-input v-model="userForm.pass" placeholder="请输入密码" style="width: 80%" size="medium" show-password />
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8"><div style="height: 16px" /></el-col>
        <el-col :span="16">
          <div class="note" :class="{ 'text-red': !passwordValidate }">
            仅支持英文、数字，限制6到32个字符
          </div>
        </el-col>
      </el-row>
      <el-row style="margin-top: 10px">
        <el-col :span="8"><div class="center-text"><div class="asterisk">*</div>确认密码</div></el-col>
        <el-col :span="16">
          <el-input v-model="userForm.checkPass" placeholder="请确认密码" style="width: 80%" size="medium" show-password />
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8"><div style="height: 16px" /></el-col>
        <el-col :span="16">
          <div v-show="checkPasswordValidate" class="note text-red">
            两次密码不一致
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <div class="center-text"><div class="asterisk">*</div>分配角色</div>
        </el-col>
        <el-col :span="16">
          <div style="height: 36px; display: flex; flex-direction: row; align-items: center">
            <el-radio v-model="userForm.userType" label="COMMON">普通用户</el-radio>
            <i class="el-icon-info" style="color: green; font-size: 16px; margin-left: 2px" />
            <span class="note-text">无管理云账户和创建新用户的权限</span>
          </div>
        </el-col>
      </el-row>
      <el-row v-show="name === 'root'" :span="16">
        <el-col :span="8"><div style="height: 16px" /></el-col>
        <el-col :span="16">
          <div style="height: 16px; display: flex; flex-direction: row; align-items: center">
            <el-radio v-model="userForm.userType" label="ADMIN">管理员</el-radio>
            <i class="el-icon-info" style="color: green; font-size: 16px; margin-left: 15px" />
            <span class="note-text">拥有创建普通用户、管理云账户的权限</span>
          </div>
        </el-col>
      </el-row>
      <el-row class="submit-button">
        <el-button size="medium" type="primary" :disabled="disabled" @click="submitForm">提交</el-button>
        <el-button size="medium" @click="cancel">取消</el-button>
      </el-row>
    </el-dialog>
    <el-dialog :visible.sync="orgNameEditVisible" title="修改组织名称" width="40%">
      <el-input v-model="editOrgName" size="medium" />
      <span slot="footer" class="dialog-footer">
        <el-button @click="orgNameEditVisible = false">取 消</el-button>
        <el-button type="primary" :disabled="orgNameDisabled" @click="editOrg">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog :visible.sync="editUsersRightVisible" title="修改用户权限" width="40%">
      <el-row>
        <el-col :span="6">
          <div class="edit-users">
            变更账号:
          </div>
        </el-col>
        <el-col :span="14">
<!--          <div style="font-size: 16px; display: flex; align-items: center; max-height: 100px; overflow-y: scroll; padding-top: 16px">-->
<!--            {{ selectUsers.map(i => i.user_name).join(',') }}-->
<!--          </div>-->
          <el-input v-model="selectUsers.map(i => i.user_name).join(',')" type="textarea" :rows="3" />
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <div class="center-text">分配角色: </div>
        </el-col>
        <el-col :span="18">
          <div style="height: 36px; display: flex; flex-direction: row; align-items: center">
            <el-radio v-model="editUserType" label="COMMON">普通用户</el-radio>
            <i class="el-icon-info" style="color: green; font-size: 16px; margin-left: 2px" />
            <span class="note-text">无管理云账户和创建新用户的权限</span>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6"><div style="height: 16px" /></el-col>
        <el-col :span="18">
          <div style="height: 16px; display: flex; flex-direction: row; align-items: center">
            <el-radio v-model="editUserType" label="ADMIN">管理员</el-radio>
            <i class="el-icon-info" style="color: green; font-size: 16px; margin-left: 15px" />
            <span class="note-text">拥有创建普通用户、管理云账户的权限</span>
          </div>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editUsersRightVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserRightSubmit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { userList, createUser, userEnable, getOrg, editOrg, modifyUserType, getInfo } from '@/api/user'
import { validInputCount, validInputEnglishAndNumberCount } from '@/utils/validate'
import Pagination from '@/components/Pagination'
import { mapGetters } from 'vuex'
import _ from 'lodash'
import { getToken } from '@/utils/auth'
export default {
  name: 'Index',
  components: { Pagination },
  filters: {
    parseStatus(status) {
      return status === 'enable' ? '启用' : '禁用'
    }
  },
  data() {
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
        checkPass: '',
        userType: 'COMMON'
      },
      orgName: '',
      editOrgName: '',
      orgNameEditVisible: false,
      selectUsers: [],
      dialogTitle: '',
      editUsersRightVisible: false,
      editUserType: 'COMMON',
      userCreateTime: ''
    }
  },
  computed: {
    ...mapGetters([
      'name',
      'userType',
      'orgId'
    ]),
    orgNameDisabled() {
      return validInputCount(this.editOrgName) > 128
    },
    disabled() {
      return this.userForm.username === '' || this.userForm.pass === '' || this.userForm.checkPass === '' ||
          !this.usernameValidate || !this.passwordValidate || this.checkPasswordValidate
    },
    // editUserRightDisabled() {
    //   if (this.selectUsers.length === 0) {
    //     return true
    //   }
    //   const res = _.uniq(this.selectUsers.map(i => i.user_type))
    //   return res.length !== 1
    // },
    usernameValidate() {
      if (this.userForm.username === '') {
        return true
      }
      const { type, count } = validInputEnglishAndNumberCount(this.userForm.username)
      return type && count <= 32
    },
    passwordValidate() {
      if (this.userForm.pass === '') {
        return true
      }
      const { type, count } = validInputEnglishAndNumberCount(this.userForm.pass)
      return type && count <= 32 && count >= 6
    },
    checkPasswordValidate() {
      return this.userForm.checkPass !== '' && this.userForm.pass !== this.userForm.checkPass
    }
  },
  mounted() {
    this.fetchData()
  },
  methods: {
    handleSelectionChange(val) {
      this.selectUsers = val
    },
    tableSelectAble(row) {
      if (this.name === 'root') {
        return true
      }
      if (this.userType === 'ADMIN') {
        return row.user_type !== 'ADMIN'
      }
      return false
    },
    async fetchData() {
      this.loading = true
      await this.loadOrg()
      const userInfo = await getInfo(getToken())
      this.userCreateTime = _.get(userInfo, 'data.create_at')
      const res = await userList(this.listQuery.page_number, this.listQuery.page_size)
      this.list = _.get(res, 'user_list', []).map(i => ({
        ...i,
        status: i.user_status === 'enable'
      }))
      this.total = _.get(res, 'pager.total', 0)
      this.loading = false
    },
    async loadOrg() {
      const org = await getOrg(this.orgId)
      this.orgName = org.org_name
    },
    showEdit() {
      this.editOrgName = this.orgName
      this.orgNameEditVisible = true
    },
    async editOrg() {
      const res = await editOrg(this.orgId, this.editOrgName)
      if (res.code === 200) {
        this.$message.success('修改成功')
      } else {
        this.$message.error('修改失败')
      }
      await this.loadOrg()
      this.orgNameEditVisible = false
    },
    async handleStatus(row) {
      const action = row.status ? 'enable' : 'disable'
      const res = await userEnable([row.user_name], action)
      if (res.code === 200) {
        this.$message.success('变更成功')
      }
      await this.fetchData()
    },
    handleCreate() {
      this.createVisible = true
    },
    async batchEnable() {
      const res = await userEnable(this.selectUsers.map(i => i.user_name), 'enable')
      if (res.code === 200) {
        this.$message.success('启用成功')
      }
      await this.fetchData()
    },
    async batchDisable() {
      const res = await userEnable(this.selectUsers.map(i => i.user_name), 'disable')
      if (res.code === 200) {
        this.$message.success('禁用成功')
      }
      await this.fetchData()
    },
    editUsersRight() {
      this.editUsersRightVisible = true
    },
    async editUserRightSubmit() {
      const res = await modifyUserType(this.selectUsers.map(i => +i.user_id), this.editUserType)
      if (res.code === 200) {
        this.$message.success('变更成功')
        await this.fetchData()
      } else {
        this.$message.error('变更失败')
      }
      this.editUsersRightVisible = false
    },
    async submitForm() {
      const res = await createUser(this.userForm.username, this.userForm.pass, this.userForm.userType)
      if (res.code === 200) {
        this.userForm = {
          username: '',
          pass: '',
          checkPass: ''
        }
        await this.fetchData()
        this.createVisible = false
        this.$message.success('创建成功')
      } else {
        this.$message.error(res.msg)
      }
    },
    cancel() {
      this.userForm = {
        username: '',
        pass: '',
        checkPass: ''
      }
      this.createVisible = false
    },
    getHandleStatusDisabled(user) {
      if (this.name === 'root') {
        return false
      }
      if (this.userType === 'COMMON') {
        return true
      }
      if (user.user_type === 'ADMIN') {
        return true
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
          margin-right: 10px;
        }
      }
      .table {
        margin-top: 10px;
      }
    }
  }
  .submit-button {
    margin-top: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .edit-users {
    font-size: 16px;
    height: 46px;
    display: flex;
    padding-right: 30px;
    justify-content: flex-end;
    align-items: flex-start;
  }
  .center-text {
    font-size: 16px;
    height: 36px;
    display: flex;
    padding-right: 30px;
    justify-content: flex-end;
    align-items: center;
  }
  .asterisk {
    display: flex;
    align-items: center;
    padding-right: 5px;
    color: #f4516c;
  }
  .text-red {
    color: red!important;
  }
  .note-text {
    font-size: 13px;
    color: rgb(170, 170,170);
  }
  .note {
    padding-top: 5px;
    font-size: 13px;
    color: rgb(170, 170,170);
  }
</style>
