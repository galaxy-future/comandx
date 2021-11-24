import request from '@/utils/request'
import http from '@/utils/http'
import _ from 'lodash'
import { getToken } from '@/utils/auth'

export async function getServiceList(params) {
  const token = getToken()
  const res = await request({
    url: '/api/v1/schedulx/service/list',
    method: 'get',
    params: params,
    headers: {
      Authorization: ` Bearer ${token}`
    }
  })
  return _.get(res, 'data', [])
}

export async function serviceEdit(data) {
  const token = getToken()
  const res = await http({
    url: '/api/v1/schedulx/service/update',
    method: 'post',
    data,
    headers: {
      Authorization: ` Bearer ${token}`
    }
  })
  return res
}

export async function serviceCreate(data) {
  const token = getToken()
  const res = await http({
    url: '/api/v1/schedulx/service/create',
    method: 'post',
    data,
    headers: {
      Authorization: ` Bearer ${token}`
    }
  })
  return res
}

export async function serviceExpand(params) {
  const token = getToken()
  return await request({
    url: '/api/v1/schedulx/service/expand',
    method: 'get',
    params: params,
    headers: {
      Authorization: ` Bearer ${token}`
    }
  })
}

export async function serviceShrink(params) {
  const token = getToken()
  return await request({
    url: '/api/v1/schedulx/service/shrink',
    method: 'get',
    params: params,
    headers: {
      Authorization: ` Bearer ${token}`
    }
  })
}

export async function getTemplateList(params) {
  const token = getToken()
  const res = await request({
    url: '/api/v1/schedulx/template/expand/list',
    method: 'get',
    params: params,
    headers: {
      Authorization: ` Bearer ${token}`
    }
  })
  return _.get(res, 'data', [])
}

export async function templateCreate(data) {
  const token = getToken()
  const res = await http({
    url: '/api/v1/schedulx/template/expand/create',
    method: 'post',
    data,
    headers: {
      Authorization: ` Bearer ${token}`
    }
  })
  return res
}

export async function getTemplateInfo(params) {
  const token = getToken()
  const res = await request({
    url: '/api/v1/schedulx/template/expand/info',
    method: 'get',
    params: params,
    headers: {
      Authorization: ` Bearer ${token}`
    }
  })
  return _.get(res, 'data', [])
}

export async function templateUpdate(data) {
  const token = getToken()
  const res = await http({
    url: '/api/v1/schedulx/template/expand/update',
    method: 'post',
    data,
    headers: {
      Authorization: ` Bearer ${token}`
    }
  })
  return res
}

export async function templateDeletes(data) {
  const token = getToken()
  const res = await http({
    url: '/api/v1/schedulx/template/expand/delete',
    method: 'post',
    data,
    headers: {
      Authorization: ` Bearer ${token}`
    }
  })
  return res
}

export async function decisionUpdate(data) {
  const token = getToken()
  const res = await http({
    url: ' /api/v1/schedulx/decision/rule/update',
    method: 'post',
    data,
    headers: {
      Authorization: ` Bearer ${token}`
    }
  })
  return res
}

export async function getDecisionRule(params) {
  const token = getToken()
  const res = await request({
    url: '/api/v1/schedulx/decision/rule/info',
    method: 'get',
    params: params,
    headers: {
      Authorization: ` Bearer ${token}`
    }
  })
  return _.get(res, 'data', [])
}

export async function getHistoryList(params) {
  const token = getToken()
  const res = await request({
    url: '/api/v1/schedulx/service/breathrecord',
    method: 'get',
    params: params,
    headers: {
      Authorization: ` Bearer ${token}`
    }
  })
  return _.get(res, 'data', [])
}

export async function getBridgXClusterList(params) {
  const token = getToken()
  const res = await request({
    url: '/api/v1/cluster/describe_all',
    method: 'get',
    params: params,
    headers: {
      Authorization: ` Bearer ${token}`
    }
  })
  return _.get(res, 'data', [])
}

