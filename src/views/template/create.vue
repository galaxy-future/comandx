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
                <div>{{ form.service_name }}</div>
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
            <!-- <el-row>
              <el-col :span="5"><div style="height: 16px" /></el-col>
              <el-col :span="19"
                ><div class="note">
                  支持中文、英文、数字，限制500字符
                </div></el-col
              >
            </el-row> -->
          </div>
        </div>
        <div v-if="step === 1" class="form">
          <div class="form-container">
            <el-row>
              <el-col :span="5"><div class="center-text">容器化</div></el-col>
              <el-col :span="19">
                <div class="center-text">
                  <el-switch
                    v-model="form.base_env.is_container"
                    active-color="#13ce66"
                    inactive-color="#ff4949"
                  />
                  {{ form.base_env.is_container? "启用" : "关闭" }}
                </div>
              </el-col>
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
                  <el-radio-button label="ims">华为云IMS</el-radio-button>
                  <el-radio-button label="other">其他</el-radio-button>
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
              <el-col :span="5"><div class="center-text">镜像仓库路径</div></el-col>
              <el-col :span="19">
                <el-input
                  v-model="form.service_env.image_url"
                  size="medium"
                  placeholder="请输入镜像仓库路径"
                  maxlength="500"
                  show-word-limit
                />
              </el-col>
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
              <el-col :span="5"><div class="center-text">镜像启动命令</div></el-col>
              <el-col :span="19">
                <el-input
                  v-model="form.service_env.cmd"
                  size="medium"
                  placeholder="请输入镜像启动命令"
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
                  <el-radio-button label="Nginx" name="Nginx" />
                  <el-radio-button label="SLB" name="SLB" />
                  <el-radio-button label="ELB" name="ELB" />
                </el-radio-group>
              </el-col>
            </el-row>
          </div>
          <div class="form-container">
            <el-row>
              <el-col :span="5"><div class="center-text"> ID</div></el-col>
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
        <el-button
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
        >下一步</el-button>
        <el-button
          style="margin-top: 12px"
          size="medium"
          @click="submit"
        >完成</el-button>
        <el-button
          style="margin-top: 12px"
          size="medium"
          type="info"
          @click="cancel"
        >取消</el-button>
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
          cmd: ''
        },
        mount: {
          mount_type: 'Nginx',
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
      if (this.step++ > 3) this.step = 0
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
      if (this.step === 0) {
        this.form.end_step = 'tmpl_info'
      }
      if (this.step === 1) {
        this.form.end_step = 'base_env'
      }
      if (this.step === 2) {
        this.form.end_step = 'service_env'
      }
      if (this.step === 3) {
        this.form.end_step = 'mount'
      }
      this.form.tmpl_info.service_cluster_id = Number(this.form.tmpl_info.service_cluster_id)
      this.form.service_env.port = Number(this.form.service_env.port)
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
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
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
