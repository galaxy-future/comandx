<style lang="less">
.once_task_select {
  li:not(:last-child) {
    border-bottom: 2px solid #e3e3e5;
  }
  .el-select-dropdown__item {
    height: 50px !important;
    line-height: 20px !important;
  }
}
</style>
<template>
  <div>
    <div class="form">
      <div class="container">
        <el-row>
          <el-col :span="5"><div class="center-text">任务名 </div></el-col>
          <el-col :span="19">
            <el-input
              v-model="task.name"
              size="medium"
              type="text"
              style="width: 400px"
              placeholder="请输入任务名"
              maxlength="40"
              show-word-limit
              @blur="checkTaskName"
            />
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="5"><div style="height: 16px" /></el-col>
          <el-col :span="19">
            <div v-if="taskNameIllegal" class="note" style="color: #f4516c">任务名不合规</div>
            <div v-else class="note">支持中文英文数字，限制2到40字符</div>
          </el-col>
        </el-row>
      </div>
    </div>
    <div class="form" style="margin-bottom: 10px">
      <div class="container">
        <el-row>
          <el-col :span="5"><div class="center-text">集群信息 </div></el-col>
          <el-col :span="19">
            <div v-loading="instanceNumLoading" class="info-text">
              <span v-show="instanceTypeDesc !== ''" style="padding-right: 30px">{{ instanceTypeDesc }}</span>
              运行中<span style="color: #f4516c; font-weight: bolder">{{ instanceNum }}</span> 台
            </div>
          </el-col>
        </el-row>
        <el-row v-if="cluster.provider !== ''">
          <el-col :span="5"><div style="height: 36px" /></el-col>
          <el-col :span="19">
            <span style="display: inline-block; padding-right: 30px">{{ cluster.provider | filterCloudProvider }}-{{ cluster.charge_type | parsePaidType }}</span>
            <!--              <span>集群用途: </span>-->
          </el-col>
        </el-row>
      </div>
    </div>
    <div class="form">
      <div class="container">
        <el-row>
          <el-col :span="5"><div class="center-text">操作动作 </div></el-col>
          <el-col :span="19">
            <el-radio-group v-model="task.type" size="medium" @change="handleTypeChange">
              <el-radio-button label="expand">扩容</el-radio-button>
              <el-radio-button label="shrink" :disabled="instanceNum < 1">缩容</el-radio-button>
            </el-radio-group>
          </el-col>
        </el-row>
      </div>
    </div>
    <div class="form">
      <div class="container">
        <el-row>
          <el-col :span="5"><div class="center-text">变动机器台数 </div></el-col>
          <el-col v-if="task.type === 'expand'" :span="19">
            <el-radio-group v-model="task.num" size="medium">
              <el-radio-button
                v-for="item in expandNumRadios"
                :key="item.label"
                :label="item.label"
              >{{ item.name }}</el-radio-button>
            </el-radio-group>
          </el-col>
          <el-col v-if="task.type === 'shrink'" :span="19">
            <el-radio-group v-model="task.num" size="medium">
              <el-radio-button
                v-for="item in shrinkNumRadios"
                :key="item.label"
                :label="item.label"
              >{{ item.name }}</el-radio-button>
            </el-radio-group>
          </el-col>
        </el-row>
        <el-row>
          <el-row>
            <el-col :span="5"><div style="height: 16px" /></el-col>
            <el-col :span="19">
              <el-row style="margin-top: 5px">
                <el-col :span="2"><div style="display: flex; align-items: center; height: 28px">其他: </div></el-col>
                <el-col v-if="task.type === 'expand'" :span="22">
                  <el-input-number v-model="task.otherNum" controls-position="right" size="mini" style="width: 100px;" :min="minNum" @change="handleChange" /> 台
                </el-col>
                <el-col v-if="task.type === 'shrink'" :span="22">
                  <el-input-number v-model="task.otherNum" controls-position="right" size="mini" style="width: 100px;" :min="minNum" :max="instanceNum" @focus="handleChange" /> 台
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </el-row>
      </div>
    </div>
    <div class="form">
      <div class="container">
        <el-row>
          <el-col :span="5"><div class="center-text">执行时间 </div></el-col>
          <el-col :span="19">
            <div class="info-text">
              立即
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
    <div class="form">
      <div class="container" style="display: flex; justify-content: center">
        <el-button size="medium" type="primary" style="margin-right: 20px" @click="submit">提交</el-button>
        <el-button size="medium" type="info" @click="goBack">取消</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import { clusterExpand, clusterShrink, clusterInstanceStat } from '@/api/cluster'
import loadMore from '@/directive/el-select-load-more'
import _ from 'lodash'

export default {
  name: 'CreateOnceTaskTemplate',
  directives: {
    loadMore
  },
  props: {
    clusterName: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      instanceNumLoading: false,
      instanceNum: 0,
      minNum: 0,
      instanceTypeDesc: '',
      cluster: {
        provider: ''
      },
      expandNumRadios: [{
        label: 1,
        name: '+1'
      }, {
        label: 5,
        name: '+5'
      }, {
        label: 10,
        name: '+10'
      }, {
        label: 50,
        name: '+50'
      }, {
        label: 100,
        name: '+100'
      }, {
        label: 200,
        name: '+200'
      }],
      shrinkNums: [1, 5, 10, 50, 100, 200],
      task: {
        name: '',
        cluster_name: '',
        type: 'expand',
        num: 0,
        otherNum: null
      },
      clusters: [],
      taskNameIllegal: false,
      listQuery: {
        page_size: 50,
        page_number: 1,
        total: 0
      }
    }
  },
  computed: {
    shrinkNumRadios() {
      const nums = [...this.shrinkNums.filter(i => i < this.instanceNum), this.instanceNum]
      return nums.map(i => ({
        label: i,
        name: `-${i}`
      }))
    }
  },
  async mounted() {
    const res = await clusterInstanceStat(this.clusterName)
    this.instanceNum = _.get(res, 'instance_count', 0)
    this.instanceTypeDesc = _.get(res, 'instance_type_desc', '')
  },
  methods: {
    async submit() {
      if (this.task.num === 0 && this.task.otherNum === 0) {
        this.$message.info('执行机器数为0')
        return
      }
      if (this.task.name === '') {
        this.taskNameIllegal = true
        return
      }
      const count = this.task.num === 0 ? this.task.otherNum : this.task.num
      let res
      switch (this.task.type) {
        case 'expand':
          res = await clusterExpand(this.clusterName, this.task.name, count)
          if (res.code === 200) {
            this.$message.success('提交成功')
            this.gotoList()
          }
          break
        case 'shrink':
          res = await clusterShrink(this.clusterName, this.task.name, count)
          if (res.code === 200) {
            this.$message.success('提交成功')
            this.gotoList()
          }
          break
      }
      this.goBack()
    },
    handleChange() {
      this.task.num = 0
    },
    handleTypeChange() {
      this.task.num = 0
      this.task.otherNum = null
    },
    checkTaskName() {
      this.taskNameIllegal = this.task.name === '' || this.task.name.length < 2
    },
    gotoList() {
      this.$router.push({ name: 'taskList' })
    },
    goBack() {
      this.$emit('close')
    }
  }
}
</script>

<style lang="less" scoped>
.form {
  margin-bottom: 30px;
  display: flex;
  justify-content: center;
  .container {
    width: 700px;
  }
  .center-text {
    font-size: 16px;
    height: 36px;
    display: flex;
    color: #333333;
    padding-right: 30px;
    flex-direction: row-reverse;
    align-items: center;
  }
  .info-text {
    font-size: 16px;
    height: 36px;
    display: flex;
    align-items: center;
  }
  .note {
    padding-top: 5px;
    color: #aaaaaa;
  }
}
</style>
