const host = require('../config/host')
const request = require('request-promise')
const Router = require('koa-router')
const common = require('../util/common')

const prefix = '/api/v1/cluster'
const routerApi = new Router({
  prefix
})

const getUrl = [
  '/describe_all',
  '/num',
  '/instance_stat',
  '/custom/detail'
]

const postUrl = [
  '/create',
  '/edit',
  '/expand',
  '/shrink',
  '/create_custom_public',
  '/create_custom_private',
  '/instance/check'
]

common.generateRouter(getUrl, postUrl, routerApi, host.getHost(), prefix)

routerApi.delete('/delete/:ids', async(ctx) => {
  try {
    ctx.body = await request({
      headers: {
        authorization: ctx.header.authorization
      },
      url: `${host.getHost()}${prefix}/delete/${ctx.params.ids}`,
      method: 'DELETE',
      json: true
    })
  } catch (e) {
    ctx.body = e.error
  }
})

routerApi.delete('/custom/delete/:ids', async(ctx) => {
  try {
    ctx.body = await request({
      headers: {
        authorization: ctx.header.authorization
      },
      url: `${host.getHost()}${prefix}/custom/delete/${ctx.params.ids}`,
      method: 'DELETE',
      json: true
    })
  } catch (e) {
    ctx.body = e.error
  }
})

routerApi.get('/name/:cluster_name', async(ctx) => {
  try {
    ctx.body = await request({
      headers: {
        authorization: ctx.header.authorization
      },
      url: `${host.getHost()}${prefix}/name/${encodeURIComponent(ctx.params.cluster_name)}`
    })
  } catch (e) {
    ctx.body = e.error
  }
})

module.exports = routerApi
