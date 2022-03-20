const host = require('../config/host')
const request = require('request-promise')
const Router = require('koa-router')
const common = require('../util/common')

const prefix = '/api/v1/galaxy_cloud'
const routerApi = new Router({
  prefix
})

const getUrl = [
  '/kubernetes',
  '/instance_group',
  '/instance/form',
  '/instance/self',
  '/cluster/summary',
  '/cluster/bridgx/available_clusters'
]
const postUrl = [
  '/instance_group/batch/create',
  '/instance_group/batch/delete',
  '/instance_group/expand_shrink',
  '/instance/delete',
  '/instance/restart',
  '/cluster'
]
common.generateRouter(getUrl, postUrl, routerApi, host.getKubeHost(), prefix)

routerApi.get('/cluster/summary/:clusterId', async(ctx) => {
  try {
    ctx.body = await request({
      headers: {
        authorization: ctx.header.authorization
      },
      url: `${host.getKubeHost()}${prefix}/cluster/summary/${ctx.params.clusterId}`,
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
      url: `${host.getKubeHost()}${prefix}/cluster/nodes/${ctx.params.clusterId}`,
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
      url: `${host.getKubeHost()}${prefix}/cluster/pods/${ctx.params.clusterId}`,
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
      url: `${host.getKubeHost()}${prefix}/cluster/${ctx.params.clusterId}`,
      method: 'DELETE',
      json: true
    })
  } catch (e) {
    ctx.body = e.error
  }
})

module.exports = routerApi
