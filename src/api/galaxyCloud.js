import request from '@/utils/request'
import http from '@/utils/http'
import { getToken } from '@/utils/auth'

export async function galaxyCloudBatchCreate(data) {
  const token = getToken()
  const res = await http({
    url: '/api/v1/eci/cluster/batch/create',
    method: 'post',
    data,
    headers: {
      Authorization: ` Bearer ${token}`
    }
  })
  return res
}

export async function instanceGroupDelete(data) {
  const token = getToken()
  const res = await http({
    url: '/api/v1/eci/cluster/batch/delete',
    method: 'post',
    data,
    headers: {
      Authorization: ` Bearer ${token}`
    }
  })
  return res
}

export async function getGalaxyClusters() {
  const token = getToken()
  const res = await request({
    url: '/api/v1/kubernetes',
    method: 'get',
    headers: {
      Authorization: ` Bearer ${token}`
    }
  })
  return res
}

export async function getInstanceGroup(params) {
  const token = getToken()
  const res = await request({
    url: '/api/v1/eci/cluster',
    method: 'get',
    params: params,
    headers: {
      Authorization: ` Bearer ${token}`
    }
  })
  return res
}

export async function instanceExpand(params) {
  const token = getToken()
  return await request({
    url: '/api/v1/eci/instance/expand',
    method: 'get',
    params: params,
    headers: {
      Authorization: ` Bearer ${token}`
    }
  })
}

export async function instanceShrink(params) {
  const token = getToken()
  return await request({
    url: '/api/v1/eci/instance/shrink',
    method: 'get',
    params: params,
    headers: {
      Authorization: ` Bearer ${token}`
    }
  })
}

export function clustersSummary(page_number, page_size) {
  const token = getToken()
  return request({
    url: '/api/v1/galaxy_cloud/cluster/summary',
    params: {
      page_number,
      page_size
    },
    headers: {
      Authorization: ` Bearer ${token}`
    }
  })
}

export function clusterAvailable(page_number, page_size, ip, cluster_name) {
  const token = getToken()
  return request({
    url: '/api/v1/galaxy_cloud/cluster/bridgx/available_clusters',
    params: {
      page_number,
      page_size,
      ip,
      cluster_name
    },
    headers: {
      Authorization: ` Bearer ${token}`
    }
  })
}

export function clusterCreate(cluster_name, bridgx_cluster_name, type) {
  const token = getToken()
  return request({
    url: '/api/v1/galaxy_cloud/cluster',
    method: 'post',
    data: {
      cluster_name,
      bridgx_cluster_name,
      type
    },
    headers: {
      Authorization: ` Bearer ${token}`
    }
  })
}

export function clusterDelete(id) {
  const token = getToken()
  return request({
    url: `/api/v1/galaxy_cloud/cluster/${id}`,
    method: 'delete',
    headers: {
      Authorization: ` Bearer ${token}`
    }
  })
}

export function clusterSummary(id) {
  const token = getToken()
  return request({
    url: `/api/v1/galaxy_cloud/cluster/summary/${id}`,
    headers: {
      Authorization: ` Bearer ${token}`
    }
  })
}

export function clusterNodes(id, page_number, page_size, node_ip, cluster_name, role) {
  const token = getToken()
  return request({
    url: `/api/v1/galaxy_cloud/cluster/nodes/${id}`,
    params: {
      page_number,
      page_size,
      node_ip,
      cluster_name,
      role
    },
    headers: {
      Authorization: ` Bearer ${token}`
    }
  })
}

export function clusterPods(id, page_number, page_size, node_ip, pod_ip) {
  const token = getToken()
  return request({
    url: `/api/v1/galaxy_cloud/cluster/pods/${id}`,
    params: {
      page_number,
      page_size,
      node_ip,
      pod_ip
    },
    headers: {
      Authorization: ` Bearer ${token}`
    }
  })
}

export function podRestart(cluster_id, instance_name) {
  const token = getToken()
  return request({
    url: '/api/v1/galaxy_cloud/eci/instance/restart',
    method: 'post',
    data: {
      cluster_id,
      instance_name
    },
    headers: {
      Authorization: ` Bearer ${token}`
    }
  })
}
