import http from '@/utils/http'
import { getToken } from '@/utils/auth'
import _ from 'lodash'

export async function predictRuleCreate(data) {
  const token = getToken()
  const res = await http({
    url: '/api/v1/cudgx/predict/rule/create',
    method: 'post',
    data,
    headers: {
      Authorization: ` Bearer ${token}`
    }
  })
  return _.get(res, 'data.status')
}

export async function predictRuleUpdate(data) {
  const token = getToken()
  const res = await http({
    url: '/api/v1/cudgx/predict/rule/update',
    method: 'post',
    data,
    headers: {
      Authorization: ` Bearer ${token}`
    }
  })
  return _.get(res, 'data.status')
}

export async function getPredictRule(id) {
  const token = getToken()
  const res = await http({
    url: `/api/v1/cudgx/predict/rule/${id}`,
    headers: {
      Authorization: ` Bearer ${token}`
    }
  })
  return _.get(res, 'data.data')
}

export async function getPredictRuleList(service_name, cluster_name, page_number, page_size) {
  const token = getToken()
  const res = await http({
    url: '/api/v1/cudgx/predict/rule/list',
    params: {
      service_name,
      cluster_name,
      page_number,
      page_size
    },
    headers: {
      Authorization: ` Bearer ${token}`
    }
  })
  return _.get(res, 'data.data')
}

export async function predictRuleDelete(ids) {
  const token = getToken()
  const res = await http({
    url: '/api/v1/cudgx/predict/rule/batch/delete',
    method: 'post',
    data: {
      ids
    },
    headers: {
      Authorization: ` Bearer ${token}`
    }
  })
  return _.get(res, 'data.status')
}

export async function enablePredictRule(id) {
  const token = getToken()
  const res = await http({
    url: `/api/v1/cudgx/predict/rule/${id}/enable`,
    method: 'post',
    headers: {
      Authorization: ` Bearer ${token}`
    }
  })
  return _.get(res, 'data.status')
}

export async function disablePredictRule(id) {
  const token = getToken()
  const res = await http({
    url: `/api/v1/cudgx/predict/rule/${id}/disable`,
    method: 'post',
    headers: {
      Authorization: ` Bearer ${token}`
    }
  })
  return _.get(res, 'data.status')
}

export async function queryRedundancyMetric(metric_name, service_name, cluster_name, begin, end) {
  const token = getToken()
  const res = await http({
    url: `/api/v1/query/metric/redundancy/${metric_name}`,
    params: {
      service_name,
      cluster_name,
      begin,
      end
    },
    headers: {
      Authorization: ` Bearer ${token}`
    }
  })
  return _.get(res, 'data.data.clusters')
}

export async function queryInstanceCountMetric(metric_name, service_name, cluster_name, begin, end) {
  const token = getToken()
  const res = await http({
    url: `/api/v1/query/metric/instance_count/${metric_name}`,
    params: {
      service_name,
      cluster_name,
      begin,
      end
    },
    headers: {
      Authorization: ` Bearer ${token}`
    }
  })
  return _.get(res, 'data.data.clusters')
}

export async function queryLoadMetric(metric_name, service_name, cluster_name, begin, end) {
  const token = getToken()
  const res = await http({
    url: `/api/v1/query/metric/load/${metric_name}`,
    params: {
      service_name,
      cluster_name,
      begin,
      end
    },
    headers: {
      Authorization: ` Bearer ${token}`
    }
  })
  return _.get(res, 'data.data.clusters')
}
