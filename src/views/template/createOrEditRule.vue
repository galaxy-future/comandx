<style lang="less">
  .rule-table {
    width: 450px;
    margin-top: 10px;
    td, th {
      padding: 0!important;
    }
  }
  .rule-tooltip {
    border-color: #d6d8da !important;
  }
</style>
<template>
  <div class="container">
    <div class="content">
      <div style="flex: 1">
        <el-row>
          <el-col :span="8"><div class="center-text"><div class="asterisk">*</div>规则名称</div></el-col>
          <el-col :span="16"><el-input v-model="rule.name" placeholder="请输入规则名称" maxlength="20" style="width: 400px" size="medium" /></el-col>
        </el-row>
        <el-row>
          <el-col :span="8"><div style="height: 16px" /></el-col>
          <el-col :span="16">
            <div class="note" :class="{ 'text-red': !ruleNameValidate }">
              支持中文、英文、数字，限制20字符
            </div>
          </el-col>
        </el-row>
        <el-row style="margin-top: 10px">
          <el-col :span="8"><div class="center-text"><div class="asterisk">*</div>关联集群</div></el-col>
          <el-col :span="16">
            <el-select v-model="rule.cluster_name" size="medium" placeholder="请选择规则对应的集群" style="width: 400px" disabled>
              <el-option v-for="(c, idx) in clusters" :key="idx" :label="c.bridgx_cluster" :value="c.bridgx_cluster" />
            </el-select>
          </el-col>
        </el-row>
        <el-row style="margin-top: 29px">
          <el-col :span="8"><div class="center-text"><div class="asterisk">*</div>度量指标</div></el-col>
          <el-col :span="16">
            <el-select v-model="rule.metric_name" size="medium" style="width: 400px">
              <el-option value="qps" label="QPS" />
              <el-option value="qps_section_factor" label="MetricQPS" />
            </el-select>
            <el-tooltip v-show="rule.metric_name === 'qps_section_factor'" placement="top" effect="light">
              <div slot="content">
                <div style="width: 330px">
                  MetricQPS度量指标，把不同QPS请求对服务器资源占用时长纳入了考量。该方法将QPS按时长进行分段，每个分段确定与之对应的权重值，进而计算单机最大承载能力<br><br>
                  <strong>单机metricQPS = ∑(wi权重值 * 分段请求数) / num机器数</strong>
                </div>
              </div>
              <i class="el-icon-question" style="color: green; font-size: 16px; margin-left: 5px; cursor: pointer" />
            </el-tooltip>
          </el-col>
        </el-row>
        <el-row style="margin-top: 29px">
          <el-col :span="8"><div class="center-text"><div class="asterisk">*</div>{{ benchmarkQpsLabel }}</div></el-col>
          <el-col :span="16">
            <el-input v-model="rule.benchmark_qps" :placeholder="benchmarkPlaceholder" style="width: 400px" size="medium" @blur="checkInput" />
            <el-tooltip v-show="rule.metric_name === 'qps_section_factor'" placement="bottom" effect="light" popper-class="rule-tooltip">
              <div slot="content">
                <div style="width: 450px">
                  <div>
                    以5台机器进行压测，分段规则及压测结果如下，为例进行计算。<br><span style="color: red">（注：该分段方式及对应权重为以往经验值）</span>
                    <el-table :data="sections" size="mini" border class="rule-table">
                      <el-table-column label="耗时区间" prop="cost" align="center" />
                      <el-table-column label="区间范围(不含上限)" width="160" prop="boundary" align="center" />
                      <el-table-column label="权重值" prop="right" align="center" />
                      <el-table-column label="请求数" prop="times" align="center" />
                    </el-table>
                    <div style="width: 100%; text-align: center; color: #a4a9af; margin-top: 5px">
                      分段压测结果
                    </div>
                    <div class="rule-formula">
                      <div>单机MetricQPS = </div>
                      <div class="formula">
                        <div class="dividend">
                          4000*0.1 + 3000*0.5 + 2000*2 + 900*4 + 100*8
                        </div>
                        <div class="divisor">
                          5
                        </div>
                      </div>
                      <div>
                        = 2060
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <i class="el-icon-question" style="color: green; font-size: 16px; margin-left: 5px; cursor: pointer" />
            </el-tooltip>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8"><div style="height: 16px" /></el-col>
          <el-col :span="16">
            <div class="note">
              <i class="el-icon-info" style="color: green; font-size: 16px" />
              {{ benchmarkQpsNote }}
            </div>
          </el-col>
        </el-row>
        <el-row style="margin-top: 10px">
          <el-col :span="8"><div class="center-text"><div class="asterisk">*
          </div>
            冗余度
            <el-tooltip placement="top" effect="light">
              <div slot="content">
                <div style="width: 330px">
                  冗余度代表当前运行机器对线上流量的承载富余程度，100%代表刚好可承载线上流量，200%代表运行机器可承载2倍当前线上流量
                </div>
              </div>
              <i class="el-icon-question" style="color: green; font-size: 16px; margin-left: 5px; cursor: pointer" />
            </el-tooltip>
          </div>
          </el-col>
          <el-col :span="16" class="col">
            上限<el-input v-model="rule.max_redundancy" size="mini" style="width: 100px; margin-left: 10px" @blur="checkInput" />%
            <i class="el-icon-info" style="color: green; font-size: 16px; margin-left: 10px" />
            <span class="note-text">冗余度高于上限，将缩容服务机器数节约成本</span>
          </el-col>
        </el-row>
        <el-row style="margin-top: 5px">
          <el-col :span="8"><div style="height: 16px" /></el-col>
          <el-col :span="16">
            下限<el-input v-model="rule.min_redundancy" size="mini" style="width: 100px; margin-left: 10px" @blur="checkInput" />%
            <i class="el-icon-info" style="color: green; font-size: 16px; margin-left: 10px" />
            <span class="note-text">冗余度低于下限，将扩容服务机器数保证业务安全</span>
          </el-col>
        </el-row>
        <el-row style="margin-top: 10px">
          <el-col :span="8"><div class="center-text"><div class="asterisk">*</div>机器数限制</div></el-col>
          <el-col :span="16" class="col">
            上限<el-input v-model="rule.max_instance_count" size="mini" style="width: 100px; margin-left: 10px" @blur="checkInput" />台
            <!--            <i class="el-icon-info" style="color: green; font-size: 16px; margin-left: 13px" />-->
            <!--            <span class="note-text">-->
            <!--              集群机器数达到上限后，将不再继续扩容-->
            <!--            </span>-->
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8"><div style="height: 16px" /></el-col>
          <el-col :span="16" class="col">
            下限<el-input v-model="rule.min_instance_count" size="mini" style="width: 100px; margin-left: 10px" @blur="checkInput" />台
            <!--            <i class="el-icon-info" style="color: green; font-size: 16px; margin-left: 13px" />-->
            <!--            <span class="note-text">-->
            <!--              线上流量接近0时，保持的最小机器-->
            <!--            </span>-->
          </el-col>
        </el-row>
        <el-row style="margin-top: 10px">
          <el-col :span="8"><div class="center-text"><div class="asterisk">*</div>扩缩容比例</div></el-col>
          <el-col :span="16" class="col">
            单次<el-input v-model="rule.execute_ratio" size="mini" style="width: 100px; margin-left: 10px" @blur="checkInput" />%
            <i class="el-icon-info" style="color: green; font-size: 16px; margin-left: 15px" />
            <span class="note-text">
              每次扩缩容发生时，增减的机器比例，不足1台向上取整
            </span>
          </el-col>
        </el-row>
        <el-row style="margin-top: 10px">
          <el-col :span="8"><div class="center-text"><div class="asterisk">*</div>规则启停</div></el-col>
          <el-col :span="16" class="col">
            <el-switch v-model="switchStatus" style="margin-right: 10px" @change="changeStatus" />
            <span v-if="switchStatus" style="color: #409EFF">启用</span>
            <span v-else style="color: #909399">停用</span>
            <!--            <i class="el-icon-info" style="color: green; font-size: 16px; margin-left: 90px" />-->
            <!--            <span class="note-text">提交后默认开启规则，自动执行扩缩容动作</span>-->
          </el-col>
        </el-row>
      </div>
      <div style="display: flex; flex-direction: row; justify-content: center; margin-top: 30px">
        <div>
          <el-button type="primary" size="medium" :disabled="disabled" @click="submit">提交</el-button>
          <el-button size="medium" style="margin-left: 10px" @click="cancel">取消</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getPredictRule, predictRuleCreate, predictRuleUpdate } from '@/api/cube'
import { serviceClusterList } from '@/api/service'
import { validInput } from '@/utils/validate'
import _ from 'lodash'
export default {
  name: 'CreateOrEditRule',
  data() {
    return {
      switchStatus: true,
      clusters: [],
      rule: {
        name: '',
        cluster_name: '',
        metric_name: 'qps',
        benchmark_qps: '',
        min_redundancy: '',
        max_redundancy: '',
        min_instance_count: '',
        max_instance_count: '',
        execute_ratio: '',
        status: 'enable'
      },
      sections: [{
        cost: 1,
        boundary: '0~10 ms',
        right: 0.1,
        times: 4000
      }, {
        cost: 2,
        boundary: '10~50 ms',
        right: 0.5,
        times: 3000
      }, {
        cost: 3,
        boundary: '50~100 ms',
        right: 2,
        times: 2000
      }, {
        cost: 4,
        boundary: '100~500 ms',
        right: 4,
        times: 900
      }, {
        cost: 5,
        boundary: '500ms以上',
        right: 8,
        times: 100
      }]
    }
  },
  computed: {
    ruleNameValidate() {
      if (this.rule.name === '') {
        return true
      }
      const res = validInput(this.rule.name)
      return res.type && res.count <= 20
    },
    disabled() {
      return this.rule.name === '' || !this.ruleNameValidate || this.rule.cluster_name === '' ||
          this.rule.benchmark_qps === '' || this.rule.min_redundancy === '' ||
          this.rule.max_redundancy === '' || this.rule.min_instance_count === '' ||
          this.rule.max_instance_count === '' || this.rule.execute_ratio === '' ||
          (+this.rule.max_redundancy) <= (+this.rule.min_redundancy) ||
          +this.rule.max_instance_count <= +this.rule.min_instance_count
    },
    benchmarkQpsNote() {
      if (this.rule.metric_name === 'qps') {
        return '请根据压测或评估结果，输入该集群单机可承载的QPS'
      }
      return '请根据压测或评估结果，输入该集群单机最大承载能力'
    },
    benchmarkQpsLabel() {
      if (this.rule.metric_name === 'qps') {
        return '单机QPS'
      }
      return '单机MetricQPS'
    },
    benchmarkPlaceholder() {
      if (this.rule.metric_name === 'qps') {
        return '请输入QPS值'
      }
      return '请输入单机MetricQPS'
    }
  },
  mounted() {
    if (this.$route.name === 'updateRule') {
      this.fetchData()
    }
    this.init()
  },
  methods: {
    async init() {
      const res = await serviceClusterList(this.$route.params.service_name)
      this.clusters = _.get(res, 'cluster_list', [])
      if (this.clusters.length > 0) {
        this.rule.cluster_name = _.get(this.clusters, '0.bridgx_cluster')
      }
    },
    async fetchData() {
      this.rule = await getPredictRule(this.$route.params.rule_id)
      this.switchStatus = this.rule.status === 'enable'
    },
    changeStatus() {
      this.rule.status = this.rule.status === 'enable' ? 'disable' : 'enable'
    },
    checkInput() {
      if (isNaN(+this.rule.benchmark_qps) || +this.rule.benchmark_qps < 1 || +this.rule.benchmark_qps > 10000) {
        this.rule.benchmark_qps = ''
      }
      if (isNaN(+this.rule.min_redundancy) || +this.rule.min_redundancy < 0) {
        this.rule.min_redundancy = ''
      }
      if (isNaN(+this.rule.max_redundancy) || +this.rule.max_redundancy > 1000) {
        this.rule.max_redundancy = ''
      }
      if (isNaN(+this.rule.min_instance_count) || +this.rule.min_instance_count < 1) {
        this.rule.min_instance_count = ''
      }
      if (isNaN(+this.rule.max_instance_count) || +this.rule.max_instance_count > 10000) {
        this.rule.max_instance_count = ''
      }
      if (isNaN(+this.rule.execute_ratio) || +this.rule.execute_ratio < 1 || +this.rule.execute_ratio > 100) {
        this.rule.execute_ratio = ''
      }
      if (this.rule.max_instance_count !== '' && this.rule.min_instance_count !== '' && +this.rule.max_instance_count <= +this.rule.min_instance_count) {
        this.$message.error('机器数上限不大于下限!')
      }
      if (this.rule.max_redundancy !== '' && this.rule.min_redundancy !== '' && +this.rule.max_redundancy <= +this.rule.min_redundancy) {
        this.$message.error('冗余度上限不大于下限!')
      }
    },
    async submit() {
      let res
      const data = {
        ...this.rule,
        cluster_name: 'default',
        status: this.switchStatus ? 'enable' : 'disable',
        service_name: this.$route.params.service_name,
        benchmark_qps: +this.rule.benchmark_qps,
        min_redundancy: +this.rule.min_redundancy,
        max_redundancy: +this.rule.max_redundancy,
        min_instance_count: +this.rule.min_instance_count,
        max_instance_count: +this.rule.max_instance_count,
        execute_ratio: +this.rule.execute_ratio
      }
      if (this.$route.name === 'createRule') {
        res = await predictRuleCreate(data)
      } else {
        res = await predictRuleUpdate(data)
      }
      if (res === 'success') {
        this.$message.success('操作成功')
        this.$router.push({
          name: 'templateList',
          params: {
            service_name: this.$route.params.service_name,
            service_cluster_id: this.$route.params.service_cluster_id
          }
        })
      } else {
        this.$message.error('操作失败')
      }
    },
    cancel() {
      this.$router.back()
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
    .content {
      padding: 20px 10px;
      height: 99%;
      display: flex;
      flex-direction: column;
      overflow-y: scroll;
      background-color: #ffffff;
      box-shadow: 4px 4px 5px rgba(0, 0, 0, .08);
    }
    .col {
      height: 36px;
      display: flex;
      flex-direction: row;
      align-items: center
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
    .note {
      padding-top: 5px;
      font-size: 13px;
      color: rgb(170, 170,170);
    }
    .note-text {
      font-size: 13px;
      color: rgb(170, 170,170);
    }
    .redundancy {
      height: 36px;
      display: flex;
      align-items: center;
      font-size: 13px;
    }
  }
  .rule-formula {
    margin-top: 15px;
    display: flex;
    flex-direction: row;
    align-items: center;
    .formula {
      margin: 0 5px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      .dividend {
        border-bottom: solid 1px black;
      }
      .divisor {
        width: 100%;
        text-align: center;
      }
    }
  }
</style>
