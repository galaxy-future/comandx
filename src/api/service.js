import request from '@/utils/request'
import http from '@/utils/http'
import _ from 'lodash'
import { getToken } from '@/utils/auth'

export function checkSchedulX() {
  return request({
    url: '/api/v1/schedulx/ok'
  })
}

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

export function serviceExpand(params) {
  const token = getToken()
  return request({
    url: '/api/v1/schedulx/service/expand',
    method: 'get',
    params: params,
    headers: {
      Authorization: ` Bearer ${token}`
    }
  })
}

export function serviceShrink(params) {
  const token = getToken()
  return request({
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

export async function serviceClusterList(service_name) {
  const token = getToken()
  const res = await request({
    url: '/api/v1/schedulx/service/cluster_list',
    headers: {
      Authorization: ` Bearer ${token}`
    },
    params: {
      service_name
    }
  })
  return _.get(res, 'data', [])
}

export function serviceDeploy(service_cluster_id, count, exec_type, download_file_url, rollback) {
  const token = getToken()
  return request({
    url: '/api/v1/schedulx/service/deploy',
    headers: {
      Authorization: ` Bearer ${token}`
    },
    params: {
      service_cluster_id,
      count,
      exec_type,
      download_file_url,
      rollback
    }
  })
}

export async function taskInfo(task_id) {
  const token = getToken()
  const res = await request({
    url: '/api/v1/schedulx/task/info',
    headers: {
      Authorization: ` Bearer ${token}`
    },
    params: {
      task_id
    }
  })
  return _.get(res, 'data')
}

export function serviceDelete() {}

export async function deployList(service_name, service_cluster_id, page_num, page_size) {
  const token = getToken()
  const res = await request({
    url: '/api/v1/schedulx/template/deploy/list',
    headers: {
      Authorization: ` Bearer ${token}`
    },
    params: {
      service_name,
      service_cluster_id,
      page_num,
      page_size
    }
  })
  return _.get(res, 'data', [])
}

export async function deployTaskDetail(service_cluster_id, task_id) {
  const token = getToken()
  const res = await request({
    url: '/api/v1/schedulx/task/deploy/detail',
    headers: {
      Authorization: ` Bearer ${token}`
    },
    params: {
      service_cluster_id,
      task_id
    }
  })
  return _.get(res, 'data')
}

export async function workflowList(service_name) {
  const token = getToken()
  const res = await request({
    url: '/api/v1/schedulx/service/zadig/workflow/list',
    headers: {
      Authorization: ` Bearer ${token}`
    },
    params: {
      service_name
    }
  })
  return _.get(res, 'data.workflow_list', [])
}

export async function artifactList(service_name, workflow_name, file_type, page_num, page_size) {
  const token = getToken()
  const res = await request({
    url: '/api/v1/schedulx/service/zadig/artifact/list',
    headers: {
      Authorization: ` Bearer ${token}`
    },
    params: {
      service_name,
      workflow_name,
      file_type,
      page_num,
      page_size
    }
  })
  return _.get(res, 'data', [])
}

export async function createIntegration(host, account, password, type) {
  const token = getToken()
  const res = await request({
    url: '/api/v1/schedulx/integration/create',
    headers: {
      Authorization: ` Bearer ${token}`
    },
    method: 'post',
    data: {
      host,
      account,
      password,
      type
    }
  })
  return res
}

export async function deleteIntegration(ids) {
  const token = getToken()
  const res = await request({
    url: '/api/v1/schedulx/integration/delete',
    headers: {
      Authorization: ` Bearer ${token}`
    },
    method: 'post',
    data: {
      ids
    }
  })
  return res
}

export async function integrationList(type, page_num, page_size) {
  const token = getToken()
  const res = await request({
    url: '/api/v1/schedulx/integration/list',
    headers: {
      Authorization: ` Bearer ${token}`
    },
    params: {
      type,
      page_num,
      page_size
    }
  })
  return _.get(res, 'data', [])
}
