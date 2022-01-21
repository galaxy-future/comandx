<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import Moment from 'moment'
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import resize from './mixins/resize'
import _ from 'lodash'

export default {
  mixins: [resize],
  props: {
    type: {
      type: String,
      require: true
    },
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '200px'
    },
    autoResize: {
      type: Boolean,
      default: true
    },
    timestamps: {
      type: Array,
      required: true
    },
    values: {
      type: Object,
      required: true
    },
    markLine: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      chart: null
    }
  },
  watch: {
    values: {
      deep: true,
      handler() {
        this.setOptions(this.timestamps, this.values, this.markLine)
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart()
    })
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')
      this.setOptions(this.timestamps, this.values, this.markLine)
    },
    formatValue(type, value) {
      if (type === '冗余度') {
        return value.toFixed(2)
      }
      if (type === 'MetricQPS') {
        return value.toFixed(0)
      }
      return value
    },
    setOptions(timestamps, values, markLine) {
      const data = _.zip(timestamps, values.data)
      data.push([+new Date() + 300000, null])
      const options = {
        name: this.type,
        xAxis: {
          splitLine: {
            show: false
          },
          type: 'time',
          boundaryGap: false,
          maxInterval: 1000,
          axisLabel: {
            formatter: (value) => {
              const time = Moment(+value)
              if (time.minutes() % 5 === 0 && time.second() === 0) {
                return time.format('HH:mm')
              }
              // if (time.second() % 5 === 0) {
              //   return time.format('mm:ss')
              // }
              return ''
            }
          },
          axisTick: {
            show: false
          }
        },
        grid: {
          left: 10,
          right: 10,
          bottom: 20,
          top: 30,
          containLabel: true
        },
        tooltip: {
          trigger: 'axis',
          triggerOn: 'none',
          enterable: true,
          formatter: (params) => {
            const value = this.formatValue(this.type, params[0].value[1])
            return `${Moment(+params[0].axisValue).format('YYYY-MM-DD')}<br>${Moment(+params[0].axisValue).format('HH:mm:ss')}<br>${params[0].marker}${this.type}:${value}`
          },
          padding: [5, 10]
        },
        yAxis: {
          splitLine: {
            show: false
          },
          axisTick: {
            show: false
          }
        },
        legend: {
          data: [values.name]
        },
        series: [{
          name: values.name, itemStyle: {
            normal: {
              color: '#00A843FF',
              lineStyle: {
                color: '#00A843FF',
                width: 2
              }
            }
          },
          smooth: false,
          type: 'line',
          symbol: 'circle',
          data,
          animationDuration: 2800,
          animationEasing: 'cubicInOut'
        }]
      }
      if (this.type === '机器数') {
        options.yAxis.minInterval = 1
        options.yAxis.type = 'value'
      }
      if (this.type === '冗余度') {
        options.yAxis.axisLabel = {
          formatter: (v) => v.toFixed(2)
        }
      }
      if (markLine !== null && markLine.min !== null && markLine.max !== null && values.data.length !== 0) {
        options.series[0].markLine = {
          symbol: 'none',
          data: [{
            lineStyle: {
              color: '#FD0202DA',
              type: 'solid'
            },
            label: {
              position: 'middle',
              formatter: '冗余下限'
            },
            yAxis: markLine.min
          }, {
            lineStyle: {
              color: '#FD0202DA',
              type: 'solid'
            },
            label: {
              position: 'middle',
              formatter: '冗余上限'
            },
            yAxis: markLine.max
          }]
        }
      }
      this.chart.setOption(options)
      this.chart.on('mouseover', (params) => {
        this.chart.dispatchAction({
          type: 'showTip',
          seriesIndex: 0,
          dataIndex: params.dataIndex
        })
      })
      this.chart.group = 'group1'
      this.chart.dispatchAction({
        type: 'showTip',
        seriesIndex: 0,
        dataIndex: data.length - 2
      })
    }
  }
}
</script>
