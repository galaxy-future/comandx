<template>
  <div class="service-container">
    <el-form
      ref="form"
      v-model="form"
      class="form"
      label-position="right"
      size="medium"
      label-width="140px"
      :rules="rules"
      :model="form"
    >
      <el-form-item label="服务名称" prop="service_info.service_name">
        <el-input
          v-model="form.service_info.service_name"
          size="medium"
          placeholder="请输入服务名称"
          style="width: 400px"
        />
        <div class="note">支持中文、英文、数字，限制32字符</div>
      </el-form-item>
      <el-form-item label="服务描述" prop="service_info.description">
        <el-input
          v-model="form.service_info.description"
          type="textarea"
          :rows="3"
          size="medium"
          placeholder="请输入服务描述"
          style="width: 400px"
        />
      </el-form-item>
      <el-form-item label="服务类型" prop="service_info.language">
        <el-select
          v-model="form.service_info.language"
          placeholder="请选择服务类型"
          style="width: 400px"
        >
          <el-option
            v-for="item in languageMap"
            :key="item.key"
            :label="item.label"
            :value="item.key"
          />
        </el-select>
      </el-form-item>
      <!-- <el-form-item label="绑定扩容模板">
        <el-select
          v-model="form.service_info.tmpl_expand_id"
          placeholder="请选择扩容模板"
          style="width: 400px"
        >
          <el-option
            v-for="item in templateList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
        <el-button
          type="primary"
          @click="createTemplate"
          size="small"
          style="margin-left: 20px"
          >创建扩容模板</el-button
        >
      </el-form-item> -->

      <el-form-item label="自动扩缩容">
        <el-switch
          v-model="form.auto_decision"
          active-color="#13ce66"
          inactive-color="#ff4949"
          active-value="on"
          inactive-value="off"
        />
      </el-form-item>

      <el-form-item
        v-if="form.auto_decision === 'on'"
        label="规则名称"
        prop="decision_rule.rule_name"
      >
        <el-input
          v-model="form.decision_rule.rule_name"
          size="medium"
          placeholder="请输入规则名称"
          style="width: 400px"
        />
        <div class="note">支持中文、英文、数字，限制20字符</div>
      </el-form-item>

      <el-form-item
        v-if="form.auto_decision === 'on'"
        label="单机QPS"
        prop="decision_rule.metric_value"
      >
        <el-input
          v-model="form.decision_rule.metric_value"
          size="medium"
          placeholder="请输入QPS值"
          style="width: 400px"
        />
      </el-form-item>

      <el-form-item
        v-if="form.auto_decision === 'on'"
        label="冗余度"
        prop="decision_rule.redundancy"
      >
        <el-input
          v-model="form.decision_rule.redundancy"
          size="medium"
          placeholder="请输入冗余度"
          style="width: 400px"
        />
        <div class="note">
          例：承载流量需100台服务器，冗余度100%表示自动变更为200台
        </div>
      </el-form-item>

      <el-form-item
        v-if="form.auto_decision === 'on'"
        label="扩容步长"
        prop="decision_rule.expand_size"
      >
        <el-input
          v-model="form.decision_rule.expand_size"
          size="medium"
          placeholder="请输入扩容步长"
          style="width: 400px"
        />
        <div class="note">
          例：承载流量需100台服务器，扩容步幅10%表示每批次增加10台
        </div>
      </el-form-item>

      <div style="display: flex; justify-content: right">
        <el-button type="primary" @click="submit">保存</el-button>
        <el-button
          type="cancel"
          style="margin-left: 20px"
          @click="cancel"
        >取消</el-button>
      </div>
    </el-form>

    <el-dialog
      title="服务创建成功"
      :visible="tipDialogVisible"
      width="20%"
      @close="cancel"
    >
      <div style="text-align:center">
        <svg-icon
          icon-class="right"
          style="
            width: 150px;
            height: 150px;
          "
        />
      </div>
      <div style="text-align:center">
        <span>{{ seconds }}</span>s后自动跳转
        <el-button
          type="text"
          @click="goTemplateCreate()"
        >创建扩缩容流程</el-button>
      </div>
      <div style="text-align:center">
        <el-button type="text" style="color:#ccc" @click="goServiceList()">返回服务列表</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { languages } from '@/config/service'
import { getTemplateList, serviceCreate } from '@/api/service'
import createPng from '@/assets/create.png'
import _ from 'lodash'
export default {
  name: 'ServiceCreate',
  data() {
    return {
      createPng: createPng,
      form: {
        service_info: {
          service_name: '',
          language: 'Go',
          description: ''
        },
        auto_decision: 'off',
        decision_rule: {
          rule_name: '',
          metric_value: '',
          metric_name: 'inst_qps',
          redundancy: '',
          expand_size: ''
        }
      },
      languageMap: languages,
      templateList: [],
      tipDialogVisible: false,
      serviceName: '',
      serviceClusterId: '',
      timer: '',
      seconds: 5,
      rules: {
        'service_info.service_name': [
          {
            required: true,
            message: '请输入服务名称',
            trigger: ['blur', 'change']
          },
          {
            pattern: /^[0-9a-zA-Z\u4E00-\u9FA5.]{1,32}$/,
            message: '支持中文、英文、数字，限制32字符',
            trigger: ['blur', 'change']
          }
        ],
        'service_info.language': [
          {
            required: true,
            message: '请选择服务类型',
            trigger: ['blur', 'change']
          }
        ],
        'decision_rule.rule_name': [
          {
            required: true,
            message: '请输入规则名称',
            trigger: ['blur', 'change']
          },
          {
            pattern: /^[0-9a-zA-Z\u4E00-\u9FA5.]{1,20}$/,
            message: '支持中文、英文、数字，限制20字符',
            trigger: ['blur', 'change']
          }
        ],
        'decision_rule.metric_value': [
          {
            required: true,
            message: '请输入QPS值',
            trigger: ['blur', 'change']
          },
          {
            pattern: /^[0-9]{1,10}$/,
            message: '仅支持数字',
            trigger: ['blur', 'change']
          }
        ],
        'decision_rule.redundancy': [
          { required: true, message: '请输入冗余度', trigger: 'blur' },
          {
            pattern: /^[0-9]{1,10}$/,
            message: '仅支持数字',
            trigger: ['blur', 'change']
          }
        ],
        'decision_rule.expand_size': [
          { required: true, message: '请输入扩容步长', trigger: 'blur' },
          {
            pattern: /^[0-9]{1,10}$/,
            message: '仅支持数字',
            trigger: ['blur', 'change']
          }
        ]
      }
    }
  },
  mounted() {
    this.getTemplateList()
  },
  methods: {
    async getTemplateList() {
      const res = await getTemplateList()
      this.templateList = _.get(res, 'templateList', [])
    },
    createTemplate() {
      this.$router.push({ name: 'templateCreate' })
    },
    async submit() {
      this.$refs['form'].validate(async(valid) => {
        if (valid) {
          this.form.decision_rule.metric_value = Number(
            this.form.decision_rule.metric_value
          )
          this.form.decision_rule.redundancy = Number(
            this.form.decision_rule.redundancy
          )
          this.form.decision_rule.expand_size = Number(
            this.form.decision_rule.expand_size
          )
          const res = await serviceCreate(this.form)
          if (res.data.code === 200) {
            this.$message.success('创建成功')
            this.serviceClusterId = res.data.data.service_cluster_id
            this.tipDialogVisible = true
            const _this = this
            this.timer = window.setInterval(function() {
              --_this.seconds
              if (_this.seconds === 0) {
                window.clearInterval(_this.timer)
                _this.tipDialogVisible = false
                _this.goTemplateCreate()
              }
            }, 1000)
          } else {
            this.$message.error('创建失败')
          }
          // this.$router.push({ name: "serviceList" });
        }
      })
    },
    cancel() {
      this.$router.push({ name: 'serviceList' })
    },
    goTemplateCreate() {
      this.clearTimer()
      this.$router.push({
        path: `/service/${this.form.service_info.service_name}/${this.serviceClusterId}/template-create`
      })
    },
    goServiceList() {
      this.clearTimer()
      this.$router.push({ name: 'serviceList' })
    },
    clearTimer() {
      if (this.timer !== '') {
        window.clearInterval(this.timer)
      }
      if (this.tipDialogVisible === true) {
        this.tipDialogVisible = false
      }
    }
  }
}
</script>
<style lang="less" scoped>
.service-container {
  width: 100%;
  height: 100%;
  padding: 10px 10px 0 40px;
  background-color: #fff;
  .form {
    padding: 20px 20%;
    .note {
      padding-top: 5px;
      color: rgb(170, 170, 170);
      line-height: 10px;
    }
  }
}
</style>
