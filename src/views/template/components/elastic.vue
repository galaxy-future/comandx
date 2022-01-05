<template>
  <div>
    <el-dialog title="执行扩缩容" :visible="dialogVisible" width="40%" @close="cancelDialog">
      <el-form
          ref="dialogForm"
          :model="dialogForm"
          label-width="100px"
          label-position="right"
          :rules="rules"
      >
        <el-form-item label="执行集群">
<!--          <el-select v-model="dialogForm.cluster" size="mini">-->
<!--            <el-option v-for="(c, idx) in clusters" :key="idx" :label="c.bridgx_cluster" :value="c" />-->
<!--          </el-select>-->
          {{ cluster.bridgx_cluster }}
        </el-form-item>
        <el-form-item label="操作动作">
          <el-radio-group v-model="dialogForm.operateType" size="mini">
            <el-radio-button label="expand" value="expand">扩容</el-radio-button>
            <el-radio-button label="shrink" value="shrink" :disabled="shrinkDisabled">缩容</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="集群信息">
          <span>{{ cluster.instance_type_desc }}</span>
          <span style="display: inline-block; margin-left: 15px">{{ cluster.provider | filterCloudProvider }}-{{ cluster.charge_type | parsePaidType }}-{{ cluster.computing_power_type }}</span>
          <span style="display: inline-block; margin-left: 15px">运行中<span style="color: red">{{ cluster.instance_count }}</span>台</span>
        </el-form-item>
        <!--        <el-form-item label="自动扩缩容">-->
        <!--          停用-->
        <!--        </el-form-item>-->
        <el-form-item label="扩容方式">
          <el-radio-group v-model="dialogForm.expandType">
            <el-radio label="instanceNum">按机器数</el-radio>
            <el-radio label="redundancy" disabled>按冗余度</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="冗余度" v-show="dialogForm.expandType === 'redundancy'">
          <el-slider
              style="width: 80%"
              :format-tooltip="format"
              v-model="dialogForm.redundancy"
              :min="100"
              :max="300"
              :marks="marks">
          </el-slider>
        </el-form-item>
        <el-form-item label="操作台数" v-show="dialogForm.expandType === 'instanceNum'">
          <el-radio-group v-if="dialogForm.operateType === 'expand'" v-model="dialogForm.operateCount" size="mini">
            <el-radio-button
                v-for="item in numRadios"
                :key="item.label"
                :label="item.label"
            >{{ item.name }}</el-radio-button>
          </el-radio-group>
          <el-radio-group v-else v-model="dialogForm.operateCount" size="mini">
            <el-radio-button
                v-for="item in shrinkNumRadios"
                :key="item.label"
                :label="item.label"
            >{{ item.name }}</el-radio-button>
          </el-radio-group>
          <el-radio-group v-else v-model="dialogForm.operateCount" size="mini">
            <el-radio-button
                v-for="item in shrinkNumRadios"
                :key="item.label"
                :label="item.label"
            >{{ item.name }}</el-radio-button>
          </el-radio-group>

          <div>
            其他：
            <el-input
                v-model="dialogForm.otherNum"
                prop="otherNum"
                size="mini"
                style="width: 80px"
            />
            台
          </div>
        </el-form-item>
        <el-form-item>
          <div style="margin-left:20%">
            <el-button type="primary" size="medium" @click="submitDialog">立即执行</el-button>
            <el-button size="medium" @click="cancelDialog">取消</el-button></div>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { serviceExpand, serviceShrink } from '@/api/service'

export default {
  name: 'Elastic',
  props: {
    dialogVisible: {
      type: Boolean,
      require: true
    },
    cluster: {
      type: Object,
      require: true
    }
  },
  computed: {
    shrinkDisabled() {
      return this.cluster.instance_count === 0
    },
    shrinkNumRadios() {
      const nums = [...this.shrinkNums.filter(i => i < this.cluster.instance_count), this.cluster.instance_count]
      return nums.map(i => ({
        label: i,
        name: `-${i}`
      }))
    }
  },
  data() {
    return {
      rules: {
        dialogTemplate: [
          { required: true, message: '请选择扩缩容流程', trigger: 'blur' }
        ]
      },
      dialogForm: {
        dialogTemplate: 0,
        operateType: 'expand',
        otherNum: '',
        operateCount: 0,
        expandType: 'instanceNum',
        redundancy: 200,
      },
      format: (val) => `${val}%`,
      clusters: [],
      shrinkNums: [1, 5, 10, 50, 100, 200],
      numRadios: [
        {
          label: 1,
          name: '+1'
        },
        {
          label: 5,
          name: '+5'
        },
        {
          label: 10,
          name: '+10'
        },
        {
          label: 50,
          name: '+50'
        },
        {
          label: 100,
          name: '+100'
        },
        {
          label: 200,
          name: '+200'
        }
      ],
      marks: {
        100: '100%',
        300: {
          style: {
            width: '40px'
          },
          label: this.$createElement('span', '300%')
        },
        154: {
          label: this.$createElement('span', '当前冗余度: 154%')
        }
      },
    }
  },
  methods: {
    async submitDialog() {
      if (
          this.dialogForm.operateCount === 0 &&
          this.dialogForm.otherNum === 0
      ) {
        this.$message.info('操作台数为0')
        return
      }
      const count =
          this.dialogForm.otherNum === ''
              ? this.dialogForm.operateCount
              : this.dialogForm.otherNum
      const params = {
        service_cluster_id: this.cluster.service_cluster_id,
        count: Number(count)
      }
      let res
      switch (this.dialogForm.operateType) {
        case 'expand':
          res = await serviceExpand(params)
          if (res.code === 200) {
            this.$message.success('提交成功')
            this.dialogVisible = false
          } else {
            this.$message.error('提交失败')
          }
          break
        case 'shrink':
          res = await serviceShrink(params)
          if (res.code === 200) {
            this.$message.success('提交成功')
            this.dialogVisible = false
          } else {
            this.$message.error('提交失败')
          }
          break
      }
    },
    cancelDialog() {
      this.$emit('close')
    },
  }
}
</script>

<style scoped>

</style>
