const host = require('../config/host')
const request = require('request-promise')
const Router = require('koa-router')
const common = require('../util/common')

const prefix = '/api/v1/schedulx'
const routerApi = new Router({
  prefix
})

const getUrl = [
  '/service/list',
  '/service/detail',
  '/service/expand',
  '/service/shrink',
  '/service/breathrecord',
  '/service/cluster_list',
  '/service/deploy',
  '/service/zadig/workflow/list',
  '/service/zadig/artifact/list',
  '/template/expand/list',
  '/template/expand/info',
  '/template/deploy/list',
  '/decision/rule/info',
  '/task/info',
  '/task/deploy/detail',
  '/integration/list'
]

const postUrl = [
  '/service/update',
  '/service/create',
  '/service/delete',
  '/template/expand/create',
  '/template/expand/update',
  '/template/expand/delete',
  '/decision/rule/update',
  '/integration/create',
  '/integration/delete',
  '/running_env/create',
  '/running_env/update'
]

common.generateRouter(getUrl, postUrl, routerApi, host.getSchedulxHost(), prefix)

routerApi.get('/ok', async(ctx) => {
  try {
    ctx.body = await request({
      url: host.getSchedulxHost()
    })
  } catch (e) {
    ctx.body = e.error
  }
})

routerApi.delete('/running_env/:ids', async(ctx) => {
  try {
    ctx.body = await request({
      url: `${host.getSchedulxHost()}${prefix}/running_env/${ctx.params.ids}`,
      method: 'DELETE',
      headers: {
        authorization: ctx.header.authorization
      },
      json: true
    })
  } catch (e) {
    ctx.body = e.error
  }
})

routerApi.get('/running_env/:id', async(ctx) => {
  try {
    ctx.body = await request({
      url: `${host.getSchedulxHost()}${prefix}/running_env/${ctx.params.id}`,
      headers: {
        authorization: ctx.header.authorization
      }
    })
  } catch (e) {
    ctx.body = e.error
  }
})

routerApi.get('/service/:id/running_env', async(ctx) => {
  try {
    ctx.body = await request({
      url: `${host.getSchedulxHost()}${prefix}/service/${ctx.params.id}/running_env`,
      headers: {
        authorization: ctx.header.authorization
      }
    })
  } catch (e) {
    ctx.body = e.error
  }
})

module.exports = routerApi
