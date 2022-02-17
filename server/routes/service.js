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
  '/template/expand/create',
  '/template/expand/update',
  '/template/expand/delete',
  '/decision/rule/update',
  '/integration/create',
  '/integration/delete'
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

module.exports = routerApi
