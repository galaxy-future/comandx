<template>
  <div class="cluster-container">
    <div class="step-container">
      <el-steps :active="step" finish-status="success">
        <el-step title="模板定义" />
        <el-step title="环境初始化" />
        <el-step title="镜像部署" />
        <el-step title="流量接入" />
      </el-steps>
      <div style="padding-top: 10px">
        <div v-if="step === 0" class="form">
          <div class="form-container">
            <el-row>
              <el-col :span="5"><div class="center-text">服务名称</div></el-col>
              <el-col :span="19">
                <div
                  style="line-height: 36px"
                >{{ form.service_name }}</div>
              </el-col>
            </el-row>
          </div>
          <div class="form-container">
            <el-row>
              <el-col
                :span="5"
              ><div class="center-text">关联模板</div></el-col>
              <el-col :span="19">
                <el-select v-model="form.tmpl_info.bridgx_clusname" size="medium" placeholder="请选择">
                  <el-option
                    v-for="item in bridgXCluster"
                    :key="item.cluster_id"
                    :label="item.cluster_name"
                    :value="item.cluster_name"
                  />
                </el-select>
              </el-col>
            </el-row>
          </div>
          <div class="form-container">
            <el-row>
              <el-col :span="5"><div class="center-text">模板名称</div></el-col>
              <el-col :span="19">
                <el-input
                  v-model="form.tmpl_info.tmpl_name"
                  size="medium"
                  placeholder="请输入模板名称"
                  maxlength="20"
                  show-word-limit
                />
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="5"><div style="height: 16px" /></el-col>
              <el-col
                :span="19"
              ><div class="note">
                支持中文、英文、数字，限制20字符
              </div></el-col>
            </el-row>
          </div>
          <div class="form-container">
            <el-row>
              <el-col :span="5"><div class="center-text">模板描述</div></el-col>
              <el-col :span="19">
                <el-input
                  v-model="form.tmpl_info.describe"
                  type="textarea"
                  :rows="3"
                  size="medium"
                  placeholder="请输入模板描述"
                  maxlength="500"
                  show-word-limit
                />
              </el-col>
            </el-row>
          </div>
        </div>
        <div v-if="step === 1" class="form">
          <div class="form-container">
            <el-row>
              <el-col :span="5"><div class="center-text">容器化</div></el-col>
              <el-col :span="19">
                <div style="line-height:36px">
                  <el-switch
                    v-model="form.base_env.is_container"
                    active-color="#13ce66"
                    inactive-color="#ff4949"
                  />
                  {{ form.base_env.is_container? "启用" : "关闭" }}
                </div>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="5"><div style="height: 16px" /></el-col>
              <el-col
                :span="19"
              >
                <div class="note"><i class="el-icon-warning" />
                  将服务器初始化为容器
                </div></el-col>
            </el-row>
          </div>
        </div>
        <div v-if="step === 2" class="form">
          <div class="form-container">
            <el-row>
              <el-col
                :span="5"
              ><div class="center-text">镜像仓库类型</div></el-col>
              <el-col :span="19">
                <el-radio-group v-model="form.service_env.image_storage_type">
                  <el-radio-button label="acr">阿里云ACR</el-radio-button>
                  <el-radio-button label="ims" disabled>华为云IMS</el-radio-button>
                  <el-radio-button label="other" disabled>其他</el-radio-button>
                </el-radio-group>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="5"><div style="height: 16px" /></el-col>
              <el-col
                :span="19"
              ><div class="note">
                如自建镜像仓库或使用其他镜像仓库，请检查该仓库和云厂服务器的连通性
              </div></el-col>
            </el-row>
          </div>
          <div class="form-container">
            <el-row>
              <el-col :span="5"><div class="center-text">镜像仓库地址</div></el-col>
              <el-col :span="19">
                <el-input
                  v-model="form.service_env.image_url"
                  size="medium"
                  placeholder="请输入镜像仓库地址"
                  maxlength="500"
                  show-word-limit
                />
              </el-col>
            </el-row>
          </div>

          <div class="form-container">
            <el-row>
              <el-col :span="5"><div style="height: 16px" /></el-col>
              <el-col
                :span="19"
              ><div class="note">
                在拉取私有镜像或者上传镜像前，需要docker login输入您的凭证信息，请设置用户名和密码作为访问凭证
              </div></el-col>
            </el-row>
          </div>

          <div class="form-container">
            <el-row>
              <el-col :span="5"><div class="center-text">用户名</div></el-col>
              <el-col :span="19">
                <el-input
                  v-model="form.service_env.accout"
                  size="medium"
                  placeholder="请输入阿里云用户名"
                  maxlength="100"
                  show-word-limit
                />
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="5"><div style="height: 16px" /></el-col>
              <el-col
                :span="19"
              >
                <div class="note"><i class="el-icon-warning" />
                  Docker客户端登录时使用的用户名为阿里云账户全名
                </div></el-col>
            </el-row>
          </div>

          <div class="form-container">
            <el-row>
              <el-col :span="5"><div class="center-text">登录密码</div></el-col>
              <el-col :span="19">
                <el-input
                  v-model="form.service_env.password"
                  size="medium"
                  placeholder="请输入密码"
                  maxlength="100"
                  show-word-limit
                />
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="5"><div style="height: 16px" /></el-col>
              <el-col
                :span="19"
              >
                <div class="note"><i class="el-icon-warning" />
                  请提供镜像仓库的登录密码
                </div></el-col>
            </el-row>
          </div>

          <div class="form-container">
            <el-row>
              <el-col :span="5"><div class="center-text">服务端口</div></el-col>
              <el-col :span="19">
                <el-input
                  v-model="form.service_env.port"
                  size="medium"
                  placeholder="请输入服务端口"
                  maxlength="10"
                  show-word-limit
                />
              </el-col>
            </el-row>
          </div>
          <div class="form-container">
            <el-row>
              <el-col :span="5"><div class="center-text">服务启动命令</div></el-col>
              <el-col :span="19">
                <el-input
                  v-model="form.service_env.cmd"
                  type="textarea"
                  :rows="5"
                  size="medium"
                  placeholder="请输入服务启动命令"
                  maxlength="500"
                  show-word-limit
                />
              </el-col>
            </el-row>
          </div>
        </div>
        <div v-if="step === 3" class="form">
          <div class="form-container" style="margin-bottom: 50px">
            <el-row>
              <el-col :span="5"><div class="center-text">流量接入方式</div></el-col>
              <el-col :span="19">
                <el-radio-group v-model="form.mount.mount_type">
                  <el-radio-button label="SLB" name="SLB" />
                  <el-radio-button label="Nginx" name="Nginx" disabled />
                  <el-radio-button label="ELB" name="ELB" disabled />
                </el-radio-group>
              </el-col>
            </el-row>
          </div>
          <div class="form-container">
            <el-row>
              <el-col :span="5"><div class="center-text">SLB ID</div></el-col>
              <el-col :span="19">
                <el-input
                  v-model="form.mount.mount_value"
                  size="medium"
                  placeholder="请输入ID名称"
                  maxlength="100"
                  show-word-limit
                />
              </el-col>
            </el-row>
          </div>
        </div>
      </div>
      <div class="buttons">
        <div class="step-buttons"><el-button
                                    v-if="step !== 0"
                                    type="primary"
                                    style="margin-top: 12px"
                                    size="medium"
                                    @click="previous"
                                  >上一步</el-button>
          <el-button
            v-if="step !== 3"
            type="primary"
            style="margin-top: 12px"
            size="medium"
            @click="next"
          >下一步</el-button></div>
        <div class="submit-buttons"><el-button
                                      type="primary"
                                      style="margin-top: 12px"
                                      size="medium"
                                      @click="submit"
                                    >完成</el-button>
          <el-button
            style="margin-top: 12px"
            size="medium"
            type="info"
            @click="cancel"
          >取消</el-button></div>

      </div>
    </div>

  </div>
</template>

<script>
import {
  templateCreate, getBridgXClusterList
} from '@/api/service'

export default {
  name: 'Create',
  data() {
    return {
      form: {
        service_name: '',
        tmpl_info: {
          tmpl_name: '',
          describe: '',
          service_cluster_id: '',
          bridgx_clusname: ''
        },
        base_env: {
          is_container: true
        },
        service_env: {
          image_storage_type: 'acr',
          image_url: '',
          port: '',
          cmd: '',
          accout: '',
          password: ''
        },
        mount: {
          mount_type: 'SLB',
          mount_value: ''
        },
        end_step: 'tmpl_info'
      },
      step: 0,
      bridgXCluster: []
    }
  },
  created() {
    this.step = 0
    this.loadData()
  },
  methods: {
    previous() {
      if (this.step-- < 0) this.step = 0
    },
    next() {
      if (!this.validate()) {
        return
      }
      if (this.step++ > 3) this.step = 0
    },
    validate() {
      if (this.step === 0) {
        if (this.form.tmpl_info.bridgx_clusname === '') {
          this.$message.warning('请选择关联模板')
          return false
        }
        if (this.form.tmpl_info.tmpl_name === '') {
          this.$message.warning('请输入模板名称')
          return false
        }
      }
      if (this.step === 2) {
        if (this.form.service_env.image_url === '') {
          this.$message.warning('请输入镜像仓库地址')
          return false
        }
        if (this.form.service_env.accout === '') {
          this.$message.warning('请输入阿里云用户名')
          return false
        }
        if (this.form.service_env.password === '') {
          this.$message.warning('请输入密码')
          return false
        }
        if (this.form.service_env.port === '') {
          this.$message.warning('请输入服务端口')
          return false
        }
        if (this.form.service_env.cmd === '') {
          this.$message.warning('请输入服务启动命令')
          return false
        }
      }
      if (this.step === 3) {
        if (this.form.mount.mount_value === '') {
          this.$message.warning('请输入ID名称')
          return false
        }
      }
      return true
    },
    loadData() {
      this.form.service_name = this.$route.params.service_name
      this.form.tmpl_info.service_cluster_id = this.$route.params.service_cluster_id
      this.loadBridgXCluster()
    },
    async loadBridgXCluster() {
      const params = {
        page_number: 1,
        page_size: 50
      }
      const res = await getBridgXClusterList(params)
      this.bridgXCluster = res.cluster_list
    },
    async submit() {
      if (!this.validate()) {
        return
      }
      if (this.step === 0) {
        this.form.end_step = 'tmpl_info'
        this.form.tmpl_info.service_cluster_id = Number(this.form.tmpl_info.service_cluster_id)
      }
      if (this.step === 1) {
        this.form.end_step = 'base_env'
      }
      if (this.step === 2) {
        this.form.end_step = 'service_env'
        this.form.service_env.port = Number(this.form.service_env.port)
      }
      if (this.step === 3) {
        this.form.end_step = 'mount'
      }

      const res = await templateCreate(this.form)
      if (res.data.code === 200) {
        this.$message.success('创建成功')
        this.$router.push({ name: 'serviceList' })
      }
      this.$router.push({ name: 'serviceList' })
    },
    cancel() {
      this.$router.push({ name: 'serviceList' })
    }
  }
}
</script>

<style lang="less" scoped>
.cluster-container {
  position: absolute;
  width: 100%;
  height: 100%;
  padding: 10px 10px 0 10px;
  background-color: rgb(240, 242, 245);
  .step-container {
    box-shadow: 4px 4px 5px rgba(0, 0, 0, 0.08);
    background-color: #ffffff;
    padding: 20px;
  }
  .buttons {
    display: grid;
      .step-buttons {
        grid-column-start: 1;
        grid-row-start: 1;
        justify-self:center;
      }
      .submit-buttons {
        grid-column-start: 1;
        grid-row-start: 1;
        justify-self: right;
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
  .note {
    padding-top: 5px;
    color: rgb(170, 170, 170);
  }
  .buttons {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
  }
}
</style>
