const host = require('../config/host')
const request = require('request-promise')
const Router = require('koa-router')
const routerApi = new Router({
  prefix: '/api/v1/galaxy_cloud'
})

routerApi.get('/kubernetes', async(ctx) => {
  try {
    ctx.body = await request({
      headers: {
        authorization: ctx.header.authorization
      },
      url: `${host.getKubeHost()}/api/v1/kubernetes`,
      method: 'GET',
      json: true
    })
  } catch (e) {
    ctx.body = e.error
  }
})

routerApi.get('/eci/cluster', async(ctx) => {
  try {
    ctx.body = await request({
      headers: {
        authorization: ctx.header.authorization
      },
      url: `${host.getKubeHost()}/api/v1/eci/cluster`,
      method: 'GET',
      qs: ctx.query,
      json: true
    })
  } catch (e) {
    ctx.body = e.error
  }
})

routerApi.post('/eci/cluster/batch/create', async(ctx) => {
  try {
    ctx.body = await request({
      headers: {
        authorization: ctx.header.authorization
      },
      url: `${host.getKubeHost()}/api/v1/eci/cluster/batch/create`,
      method: 'POST',
      body: ctx.request.body,
      json: true
    })
  } catch (e) {
    ctx.body = e.error
  }
})

routerApi.post('/eci/cluster/batch/delete', async(ctx) => {
  try {
    ctx.body = await request({
      headers: {
        authorization: ctx.header.authorization
      },
      url: `${host.getKubeHost()}/api/v1/eci/cluster/batch/delete`,
      method: 'POST',
      body: ctx.request.body,
      json: true
    })
  } catch (e) {
    ctx.body = e.error
  }
})

routerApi.post('/eci/instance/expand', async(ctx) => {
  try {
    ctx.body = await request({
      headers: {
        authorization: ctx.header.authorization
      },
      url: `${host.getKubeHost()}/api/v1/eci/instance/expand`,
      method: 'POST',
      body: ctx.request.body
    })
  } catch (e) {
    ctx.body = e.error
  }
})

routerApi.post('/eci/instance/shrink', async(ctx) => {
  try {
    ctx.body = await request({
      headers: {
        authorization: ctx.header.authorization
      },
      url: `${host.getKubeHost()}/api/v1/eci/instance/shrink`,
      method: 'POST',
      body: ctx.request.body
    })
  } catch (e) {
    ctx.body = e.error
  }
})

routerApi.get('/cluster/summary', async(ctx) => {
  // ctx.body = {
  //   success: 'success',
  //   message: '',
  //   pager: {
  //     total: 3,
  //     page_size: 10,
  //     page_number: 1
  //   },
  //   clusters: [{
  //     cluster_id: 1,
  //     cluster_name: 'BridgxCluster',
  //     all_cpu_cores: 1000,
  //     free_cpu_cores: 680,
  //     all_memory_gi: 2000,
  //     free_memory_gi: 1200,
  //     all_disk_gi: 2,
  //     free_disk_gi: 1.24,
  //     max_unallocated_cpu_in_node: '',
  //     max_unallocated_memory_in_node: '',
  //     max_unallocated_storage_in_node: '',
  //     pod_count: 20,
  //     work_count: 3,
  //     master_count: 3,
  //     created_user: 'root',
  //     created_time: '',
  //     status: 'Running'
  //   }, {
  //     cluster_id: 2,
  //     cluster_name: 'BridgxCluster',
  //     all_cpu_cores: 1000,
  //     free_cpu_cores: 650,
  //     all_memory_gi: 2000,
  //     free_memory_gi: 1240,
  //     all_disk_gi: 2,
  //     free_disk_gi: 1.24,
  //     max_unallocated_cpu_in_node: '',
  //     max_unallocated_memory_in_node: '',
  //     max_unallocated_storage_in_node: '',
  //     pod_count: 20,
  //     work_count: 10,
  //     master_count: 3,
  //     created_user: 'root',
  //     created_time: '',
  //     status: 'Running'
  //   }]
  // }
  try {
    ctx.body = await request({
      headers: {
        authorization: ctx.header.authorization
      },
      url: `${host.getKubeHost()}/api/v1/galaxy_cloud/cluster/summary`,
      qs: ctx.query,
      json: true
    })
  } catch (e) {
    ctx.body = e.error
  }
})

routerApi.get('/cluster/bridgx/available_clusters', async(ctx) => {
  try {
    ctx.body = await request({
      headers: {
        authorization: ctx.header.authorization
      },
      url: `${host.getKubeHost()}/api/v1/galaxy_cloud/cluster/bridgx/available_clusters`,
      qs: ctx.query,
      json: true
    })
  } catch (e) {
    ctx.body = e.error
  }
})

routerApi.post('/cluster', async(ctx) => {
  try {
    ctx.body = await request({
      headers: {
        authorization: ctx.header.authorization
      },
      url: `${host.getKubeHost()}/api/v1/galaxy_cloud/cluster`,
      method: 'POST',
      body: ctx.request.body
    })
  } catch (e) {
    ctx.body = e.error
  }
})

routerApi.get('/cluster/summary/:clusterId', async(ctx) => {
  try {
    ctx.body = await request({
      headers: {
        authorization: ctx.header.authorization
      },
      url: `${host.getKubeHost()}/api/v1/galaxy_cloud/cluster/summary/${ctx.params.clusterId}`,
      json: true
    })
  } catch (e) {
    ctx.body = e.error
  }
})

routerApi.get('/cluster/nodes/:clusterId', async(ctx) => {
  try {
    ctx.body = await request({
      headers: {
        authorization: ctx.header.authorization
      },
      url: `${host.getKubeHost()}/api/v1/galaxy_cloud/cluster/nodes/${ctx.params.clusterId}`,
      qs: ctx.query,
      json: true
    })
  } catch (e) {
    ctx.body = e.error
  }
})

routerApi.get('/cluster/pods/:clusterId', async(ctx) => {
  try {
    ctx.body = await request({
      headers: {
        authorization: ctx.header.authorization
      },
      url: `${host.getKubeHost()}/api/v1/galaxy_cloud/cluster/pods/${ctx.params.clusterId}`,
      qs: ctx.query,
      json: true
    })
  } catch (e) {
    ctx.body = e.error
  }
})

routerApi.delete('/cluster/:clusterId', async(ctx) => {
  try {
    ctx.body = await request({
      headers: {
        authorization: ctx.header.authorization
      },
      url: `${host.getKubeHost()}/api/v1/galaxy_cloud/cluster/${ctx.params.clusterId}`,
      method: 'DELETE',
      json: true
    })
  } catch (e) {
    ctx.body = e.error
  }
})

routerApi.post('/eci/instance/restart', async(ctx) => {
  try {
    ctx.body = await request({
      headers: {
        authorization: ctx.header.authorization
      },
      url: `${host.getKubeHost()}/api/v1/galaxy_cloud/eci/instance/restart`,
      method: 'POST',
      body: ctx.request.body,
      json: true
    })
  } catch (e) {
    ctx.body = e.error
  }
})

module.exports = routerApi
