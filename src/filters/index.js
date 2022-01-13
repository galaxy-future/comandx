import _ from 'lodash'
import moment from 'moment'

export function filterCloudProvider(string) {
  switch (string) {
    case 'AlibabaCloud':
      return '阿里云'
    case 'HuaweiCloud':
      return '华为云'
    case 'TencentCloud':
      return '腾讯云'
    default:
      return '未知云厂商'
  }
}

export function parseMin(second) {
  if (second <= 60) {
    return `${second}秒`
  }
  return `${Math.floor(second / 60)}分${second % 60}秒`
}

const taskStatusCode = {
  SUCCESS: '执行成功',
  RUNNING: '执行中',
  INIT: '待执行',
  FAILED: '执行失败'
}

const taskStatusRoughlyCode = {
  SUCCESS: '执行完毕',
  RUNNING: '执行中',
  INIT: '待执行',
  FAILED: '执行完毕',
  PARTIAL_SUCCESS: '部分成功'
}

const taskResult = {
  SUCCESS: '成功',
  RUNNING: '--',
  INIT: '--',
  FAILED: '失败'
}

const taskActionCode = {
  EXPAND: '扩容',
  SHRINK: '缩容'
}

const instanceStatuses = {
  Undefined: '未定义',
  Pending: '初始化中',
  Timeout: '执行超时',
  Starting: '启动中',
  Running: '运行中',
  Deleted: '已删除',
  Deleting: '删除中'
}

const paidTypes = {
  PostPaid: '按量付费',
  PrePaid: '包年包月'
}

const networkPaidTypes = {
  PayByTraffic: '按使用流量计费',
  PayByBandwidth: '按固定带宽计费'
}

export function parseNetworkPaidType(type) {
  return _.get(networkPaidTypes, type, '未知')
}

export function parsePaidType(type) {
  return _.get(paidTypes, type, '未知')
}

const gClusterNodeStatuses = {
  Ready: '正常',
  notReady: '异常'
}

const gClusterStatuses = {
  initialize: '初始化中',
  running: '运行中',
  failed: '异常'
  // 'Initialize the cluster': '初始化集群',
  // 'Install master': '安装master',
  // 'Install flannel': '安装flannel',
  // 'Install Node': '安装node',
  // 'Done': '初始化完成'
}

export function parseTest(result) {
  return result
}
export function parseUsage(usage) {
  if (usage === 'unused') {
    return '未使用'
  }
  return usage
}

export function parseTaskAction(action) {
  return _.get(taskActionCode, action, '未知')
}

export function parseTaskStatus(status) {
  return _.get(taskStatusCode, status, '未知')
}

export function parseTaskStatusRoughly(status) {
  return _.get(taskStatusRoughlyCode, status, '未知')
}
export function parseTaskResult(status) {
  return _.get(taskResult, status, '--')
}

export function formatMoment(date, format) {
  return moment(date).format(format)
}

export function formatMomentZone(date, format) {
  const dateFormat = date ? date.split('+0800')[0].replaceAll('-', '/') : date
  const str = moment(new Date(dateFormat)).utcOffset(-6).format(format)
  return str === 'Invalid date' ? '--' : str
}

export function formatInstanceStatuses(status) {
  return _.get(instanceStatuses, status, '未知')
}

export function formatPercent(value, precision) {
  const tmp = 10 ** precision
  return `${Math.round(value * 100 * tmp) / tmp}%`
}

export function generateNodeStatus(status) {
  return _.get(gClusterNodeStatuses, status, '未知')
}

export function generateClusterStatus(status) {
  return _.get(gClusterStatuses, status, status)
}

export function formatPrecision(value, precision) {
  if (_.isNumber(value)) {
    return value.toFixed(precision)
  }
  return '--'
}

export function formatStorage(storage) {
  if (storage >= 1000) {
    return `${(storage / 1000).toFixed(2)}T`
  }
  return `${storage.toFixed(2)}G`
}
