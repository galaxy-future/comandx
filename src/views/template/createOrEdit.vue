<template>
  <div class="cluster-container">
    <div class="step-container">
      <el-steps :active="step" finish-status="success">
        <el-step title="基础信息" />
        <el-step :title="stepTwoName" />
        <el-step :title="stepThreeName" />
        <el-step :title="stepFourName" />
      </el-steps>
      <div style="padding-top: 10px">
        <div v-if="step === 0" class="form">
          <div class="form-container">
            <el-row>
              <el-col :span="5"><div class="center-text"><span class="is-required" style="color: #FF4C4C;">*</span>模板名称</div></el-col>
              <el-col :span="19">
                <el-input
                  v-model="form.tmpl_info.tmpl_name"
                  size="medium"
                  placeholder="请输入模板名称"
                  maxlength="20"
                  style="width: 80%"
                />
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="5"><div style="height: 16px" /></el-col>
              <el-col
                :span="19"
              ><div class="note" :class="{ 'text-red': !tmplNameValidate }">
                支持中文、英文、数字，限制20字符
              </div>
              </el-col>
            </el-row>
          </div>
          <div class="form-container">
            <el-row>
              <el-col :span="5">
                <div class="center-text"><span class="is-required" style="color: #FF4C4C;">*</span>部署方式</div>
              </el-col>
              <el-col :span="19">
                <div class="deploy-mode">
                  <el-radio v-model="deploy_mode" label="instance" :disabled="instanceDisabled">云服务器部署</el-radio>
                  <i class="el-icon-warning" style="color: #B8741A; font-size: 14px" />
                  <span style="color: rgb(170, 170, 170); font-size: 14px">拉取镜像仓库中的编辑镜像，然后将集群容器化后部署</span>
                </div>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="5">
                <div style="height: 36px" />
              </el-col>
              <el-col :span="19">
                <div class="deploy-mode">
                  <el-radio v-model="deploy_mode" label="container" :disabled="containerDisabled">容器镜像部署</el-radio>
                  <i class="el-icon-warning" style="color: #B8741A; font-size: 14px" />
                  <span style="color: rgb(170, 170, 170); font-size: 14px">拉取编译制品库中的编译包，然后在集群机器上部署</span>
                </div>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="5">
                <div style="height: 36px" />
              </el-col>
              <el-col :span="19">
                <div class="deploy-mode">
                  <el-radio v-model="deploy_mode" label="k8s" disabled>K8s部署</el-radio>
                  <i class="el-icon-warning" style="color: #B8741A; font-size: 14px; margin-left: 32px" />
                  <span style="color: rgb(170, 170, 170); font-size: 14px">选择“K8s集群”模块切分出的实例组Pod，部署镜像</span>
                </div>
              </el-col>
            </el-row>
          </div>
          <div class="form-container">
            <el-row>
              <el-col
                :span="5"
              ><div class="center-text"><span class="is-required" style="color: #FF4C4C;">*</span>关联集群</div></el-col>
              <el-col :span="19">
                <el-select v-model="form.tmpl_info.bridgx_clusname" size="medium" placeholder="请选择规则对应的集群" style="width: 80%">
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
              <el-col :span="5"><div class="center-text">模板描述</div></el-col>
              <el-col :span="19">
                <el-input
                  v-model="form.tmpl_info.describe"
                  type="textarea"
                  :rows="3"
                  size="medium"
                  placeholder="请输入模板描述, 限制32字符(一个汉字占两字符)"
                  style="width: 80%"
                />
                <div v-show="templateDescNumUltraLimit" class="note text-red">
                  限制32字符(一个汉字占两字符)
                </div>
              </el-col>
            </el-row>
          </div>
        </div>
        <div v-if="step === 1" class="form">
          <div v-if="deploy_mode === 'container'" class="form-container">
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
          <div v-else style="width: 100%" class="form">
            <div class="form-container">
              <el-row>
                <el-col :span="5"><div class="center-text"><span class="is-required" style="color: #FF4C4C;">*</span>产物仓库路径</div></el-col>
                <el-col :span="19">
                  <el-input v-model="deploy_info.repo_path" size="medium" placeholder="请输入产物仓库路径" style="width: 80%" />
                </el-col>
              </el-row>
            </div>
            <div class="form-container">
              <el-row>
                <el-col :span="5"><div class="center-text">路径访问账户</div></el-col>
                <el-col :span="19">
                  <el-input v-model="deploy_info.repo_user" size="medium" placeholder="请输入路径访问账户" style="width: 80%" />
                </el-col>
              </el-row>
            </div>
            <div class="form-container">
              <el-row>
                <el-col :span="5"><div class="center-text">路径访问密码</div></el-col>
                <el-col :span="19">
                  <el-input v-model="deploy_info.repo_password" size="medium" placeholder="请输入路径访问密码" style="width: 80%" show-password />
                </el-col>
              </el-row>
            </div>
            <div class="form-container">
              <el-row>
                <el-col :span="5"><div class="center-text"><span class="is-required" style="color: #FF4C4C;">*</span>高级设置</div></el-col>
                <el-col :span="19" style="height: 36px; display: flex; align-items: center">
                  <el-switch v-model="compilerAdvance" active-color="#13ce66" inactive-color="#ff4949" />
                </el-col>
              </el-row>
            </div>
            <div v-show="compilerAdvance" class="form-container">
              <el-row>
                <el-col :span="5"><div class="center-text">机器初始化脚本</div></el-col>
                <el-col :span="19" style="height: 36px; display: flex; align-items: center">
                  <i class="el-icon-warning" style="color: #B8741A; font-size: 16px" />
                  <span>可添加机器环境初始化执行脚本，如安装程序组件等，</span><span style="color: red">在下载编译包前执行</span>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="5"><div style="height: 36px" /></el-col>
                <el-col :span="19">
                  <el-input v-model="deploy_info.before_download_cmd" size="medium" type="textarea" :rows="3" style="width: 80%" placeholder="可输入脚本" />
                </el-col>
              </el-row>
            </div>
          </div>
        </div>
        <div v-if="step === 2" class="form">
          <div v-if="deploy_mode === 'container'" style="width: 100%;" class="form">
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
                <el-col :span="5"><div class="center-text"><span class="is-required" style="color: #FF4C4C;">*</span>镜像仓库地址</div></el-col>
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
                <el-col :span="5"><div class="center-text"><span class="is-required" style="color: #FF4C4C;">*</span>用户名</div></el-col>
                <el-col :span="19">
                  <el-input
                    v-model="form.service_env.account"
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
                <el-col :span="5"><div class="center-text"><span class="is-required" style="color: #FF4C4C;">*</span>登录密码</div></el-col>
                <el-col :span="19">
                  <el-input
                    v-model="form.service_env.password"
                    size="medium"
                    placeholder="请输入密码"
                    maxlength="100"
                    type="password"
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
                <el-col :span="5"><div class="center-text"><span class="is-required" style="color: #FF4C4C;">*</span>服务端口</div></el-col>
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
                <el-col :span="5"><div class="center-text"><span class="is-required" style="color: #FF4C4C;">*</span>服务启动命令</div></el-col>
                <el-col :span="19">
                  <el-input
                    v-model="form.service_env.cmd"
                    size="medium"
                    placeholder="请输入服务启动命令"
                    maxlength="500"
                    show-word-limit
                  />
                </el-col>
              </el-row>
            </div>
          </div>
          <div v-else style="width: 100%" class="form">
            <div class="form-container">
              <el-row>
                <el-col :span="5"><div class="center-text"><span class="is-required" style="color: #FF4C4C;">*</span>程序安装目录</div></el-col>
                <el-col :span="19">
                  <el-input v-model="deploy_info.deploy_file_path" size="medium" placeholder="请输入安装目录地址" style="width: 80%" />
                </el-col>
              </el-row>
            </div>
            <div class="form-container">
              <el-row>
                <el-col :span="5"><div class="center-text"><span class="is-required" style="color: #FF4C4C;">*</span>文件名</div></el-col>
                <el-col :span="19">
                  <el-input v-model="deploy_info.deploy_file_name" size="medium" placeholder="请输入文件名" style="width: 80%" />
                </el-col>
              </el-row>
            </div>
            <div class="form-container">
              <el-row>
                <el-col :span="5"><div class="center-text"><span class="is-required" style="color: #FF4C4C;">*</span>高级设置</div></el-col>
                <el-col :span="19" style="height: 36px; display: flex; align-items: center">
                  <el-switch v-model="publishAdvance" active-color="#13ce66" inactive-color="#ff4949" />
                </el-col>
              </el-row>
            </div>
            <div class="form-container">
              <el-row style="margin-bottom: 10px">
                <el-col :span="5"><div class="center-text">环境变量</div></el-col>
                <el-col :span="19">
                  <el-button size="medium" type="primary" @click="addVariable">添加变量</el-button>
                </el-col>
              </el-row>
              <el-row v-for="(val, idx) in env_variables" :key="idx" style="margin-top: 5px">
                <el-col :span="5"><div style="height: 20px" /></el-col>
                <el-col :span="19" style="display: flex; flex-direction: row">
                  <el-input v-model="val.key" style="flex-basis: 40%">
                    <template slot="prepend">Key</template>
                  </el-input>
                  <el-input v-model="val.val" style="flex-basis: 40%; margin-left: 10px">
                    <template slot="prepend">Value</template>
                  </el-input>
                  <svg
                    class="svg"
                    style="cursor:pointer;width:30px;height:30px;margin-top:5px;"
                    @click="delVar(idx)"
                  >
                    <use xlink:href="#icon-ashbin" />
                  </svg>
                </el-col>
              </el-row>
            </div>
            <div v-show="publishAdvance" class="form-container">
              <el-row>
                <el-col :span="5">
                  <div class="center-text">部署初始化脚本</div>
                </el-col>
                <el-col :span="19" style="height: 36px; display: flex; align-items: center">
                  <i class="el-icon-warning" style="color: #B8741A; font-size: 16px" />
                  <span>可添加机器环境初始化执行脚本，如安装程序组件等，</span><span style="color: red">在安装程序前执行</span>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="5"><div style="height: 36px" /></el-col>
                <el-col :span="19">
                  <el-input v-model="deploy_info.before_deploy_cmd" size="medium" type="textarea" :rows="3" style="width: 80%" placeholder="可输入脚本" />
                </el-col>
              </el-row>
            </div>
          </div>
        </div>
        <div v-if="step === 3" class="form">
          <div v-if="deploy_mode === 'container'" style="width: 100%" class="form">
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
                <el-col :span="5"><div class="center-text"><span class="is-required" style="color: #FF4C4C;">*</span>SLB ID</div></el-col>
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
          <div v-else style="width: 100%" class="form">
            <div class="form-container">
              <el-row>
                <el-col :span="5"><div class="center-text"><span class="is-required" style="color: #FF4C4C;">*</span>服务启动命令</div></el-col>
                <el-col :span="19">
                  <el-input v-model="deploy_info.deploy_cmd" size="medium" type="textarea" :rows="3" style="width: 80%" placeholder="请输入服务启动命令" />
                </el-col>
              </el-row>
            </div>
            <div class="form-container">
              <el-row>
                <el-col :span="5"><div class="center-text"><span class="is-required" style="color: #FF4C4C;">*</span>高级设置</div></el-col>
                <el-col :span="19" style="height: 36px; display: flex; align-items: center">
                  <el-switch v-model="startAdvance" active-color="#13ce66" inactive-color="#ff4949" />
                </el-col>
              </el-row>
            </div>
            <div v-show="startAdvance" class="form-container">
              <el-row>
                <el-col :span="5"><div class="center-text">执行脚本</div></el-col>
                <el-col :span="19" style="height: 36px; display: flex; align-items: center">
                  <i class="el-icon-warning" style="color: #B8741A; font-size: 16px" />
                  <span>可添加在服务启动前需要执行的脚本，如配置负载均衡等，</span><span style="color: red">在服务启动前执行</span>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="5"><div style="height: 36px" /></el-col>
                <el-col :span="19">
                  <el-input v-model="deploy_info.after_deploy_cmd" size="medium" type="textarea" :rows="3" style="width: 80%" placeholder="可输入脚本" />
                </el-col>
              </el-row>
            </div>
          </div>
        </div>
      </div>
      <div class="buttons">
        <div class="step-buttons">
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
            :disabled="templateDescNumUltraLimit"
            @click="next"
          >下一步</el-button>
        </div>
        <div class="submit-buttons">
          <el-button
            type="primary"
            style="margin-top: 12px"
            size="medium"
            @click="submit"
          >完成</el-button>
          <el-button
            style="margin-top: 12px"
            size="medium"
            type="info"
            plain
            @click="cancel"
          >取消</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  templateCreate, getBridgXClusterList, getTemplateInfo, templateUpdate
} from '@/api/service'
import { validInput, validInputCount } from '@/utils/validate'

export default {
  name: 'Create',
  data() {
    return {
      deploy_mode: 'container',
      deploy_info: {
        strategy: 'RollingUpdate',
        in_place: true,
        max_surge: 0,
        repo_path: '',
        repo_user: '',
        repo_password: '',
        before_download_cmd: '',
        executable_path: '',
        deploy_file_path: '',
        deploy_file_name: '',
        env_variables: [],
        before_deploy_cmd: '',
        deploy_cmd: '',
        after_deploy_cmd: ''
      },
      env_variables: [{
        key: '',
        val: ''
      }],
      compilerAdvance: false,
      publishAdvance: false,
      startAdvance: false,
      form: {
        service_name: '',
        tmpl_info: {
          tmpl_name: '',
          describe: '',
          service_cluster_id: '',
          bridgx_clusname: '',
          deploy_mode: ''
        },
        base_env: {
          is_container: true
        },
        service_env: {
          image_storage_type: 'acr',
          image_url: '',
          port: '',
          cmd: '',
          account: '',
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
  computed: {
    tmplNameValidate() {
      if (this.form.tmpl_info.tmpl_name === '') {
        return true
      }
      const res = validInput(this.form.tmpl_info.tmpl_name)
      return res.type && res.count <= 20
    },
    templateDescNumUltraLimit() {
      return this.step === 0 && validInputCount(this.form.tmpl_info.describe) > 32
    },
    stepTwoName() {
      if (this.deploy_mode === 'instance') {
        return '下载编译包'
      }
      return '环境初始化'
    },
    stepThreeName() {
      if (this.deploy_mode === 'instance') {
        return '发布程序'
      }
      return '镜像部署'
    },
    stepFourName() {
      if (this.deploy_mode === 'instance') {
        return '服务启动'
      }
      return '流量接入'
    },
    containerDisabled() {
      return this.$route.query.type === 'deploy'
    },
    instanceDisabled() {
      return this.$route.query.type === 'expand'
    }
  },
  created() {
    this.step = 0
    this.loadData()
    this.deploy_mode = this.$route.query.type === 'deploy' ? 'instance' : 'container'
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
        if (!this.tmplNameValidate) {
          this.$message.warning('模板名称不合规')
          return false
        }
        if (this.templateDescNumUltraLimit) {
          this.$message.warning('模板描述字符超限')
          return false
        }
      }
      if (this.step === 1 && this.deploy_mode === 'instance') {
        if (this.deploy_info.repo_path === '') {
          this.$message.warning('请输入产物仓库路径')
          return false
        }
      }
      if (this.step === 2) {
        if (this.deploy_mode === 'container') {
          if (this.form.service_env.image_url === '') {
            this.$message.warning('请输入镜像仓库地址')
            return false
          }
          if (this.form.service_env.account === '') {
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
        if (this.deploy_mode === 'instance') {
          if (this.deploy_info.deploy_file_path === '') {
            this.$message.warning('请输入安装目录地址')
            return false
          }
          if (this.deploy_info.deploy_file_name === '') {
            this.$message.warning('请输入安装文件名')
            return false
          }
        }
      }
      if (this.step === 3) {
        if (this.deploy_mode === 'container') {
          if (this.form.mount.mount_value === '') {
            this.$message.warning('请输入ID名称')
            return false
          }
        }
        if (this.deploy_mode === 'instance') {
          if (this.deploy_info.deploy_cmd === '') {
            this.$message.warning('请输入服务启动命令')
            return false
          }
        }
      }
      return true
    },
    loadData() {
      if (this.$route.name === 'templateCreate') {
        this.form.service_name = this.$route.params.service_name
        this.form.tmpl_info.service_cluster_id = this.$route.params.service_cluster_id
        if (this.form.service_name === '' || this.form.tmpl_info.service_cluster_id === '') {
          this.$message.error('路由参数错误')
        }
      } else {
        this.form.tmpl_expand_id = this.$route.params.tmpl_expand_id
        this.loadTemplateInfo()
      }
      this.loadBridgXCluster()
    },
    async loadTemplateInfo() {
      const params = {
        tmpl_expand_id: this.form.tmpl_expand_id
      }
      const res = await getTemplateInfo(params)
      this.form.tmpl_info = res.tmpl_info || this.form.tmpl_info
      this.form.base_env = res.base_env || this.form.base_env
      this.form.service_env = res.service_env || this.form.service_env
      this.form.mount = res.mount || this.form.mount
      this.form.service_name = this.$route.params.service_name
      this.deploy_mode = res.tmpl_info.deploy_mode
      this.deploy_info = {
        ...res.deploy_info
      }
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
      this.form.tmpl_info.service_cluster_id = Number(this.form.tmpl_info.service_cluster_id)
      this.form.service_env.port = Number(this.form.service_env.port)
      this.form.tmpl_info.deploy_mode = this.deploy_mode
      const form = {
        ...this.form,
        deploy_info: {
          ...this.deploy_info,
          env_variables: this.env_variables
        }
      }
      if (this.$route.name === 'templateEdit') {
        form.tmpl_expand_id = Number(this.$route.params.tmpl_expand_id)
        const res = await templateUpdate(form)
        if (res.data.code === 200) {
          this.$message.success('编辑成功')
          this.$router.push({ path: `/service/${this.form.service_name}/${this.form.tmpl_info.service_cluster_id}/template` })
        } else {
          this.$message.error('编辑失败')
        }
      }
      if (this.$route.name === 'templateCreate') {
        const res = await templateCreate(form)
        if (res.data.code === 200) {
          this.$message.success('创建成功')
          this.$router.push({ path: `/service/${this.form.service_name}/${this.form.tmpl_info.service_cluster_id}/template` })
        } else {
          this.$message.error('创建失败')
        }
      }
    },
    cancel() {
      this.$router.push({ path: `/service/${this.form.service_name}/${this.form.tmpl_info.service_cluster_id}/template` })
    },
    addVariable() {
      this.env_variables = [...this.env_variables, {
        key: '',
        val: ''
      }]
    },
    delVar(idx) {
      this.env_variables.splice(idx, 1)
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
  .deploy-mode {
    display: flex;
    height: 36px;
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
  .text-red {
    color: red !important;
  }
}
</style>
