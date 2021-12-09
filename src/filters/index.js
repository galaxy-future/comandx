import _ from 'lodash'
import moment from 'moment'

export function filterCloudProvider(string) {
  switch (string) {
    case 'AlibabaCloud':
      return '阿里云'
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
  FAILED: '执行完毕'
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

export function parsePaidType(type) {
  return _.get(paidTypes, type, '未知')
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
  const str = moment(new Date(date)).utcOffset(-6).format(format)
  return str === 'Invalid date' ? '--' : str
}

export function formatInstanceStatuses(status) {
  return _.get(instanceStatuses, status, '未知')
}
