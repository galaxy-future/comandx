const Router = require('koa-router')
const host = require('../config/host')
const request = require('request-promise')
const common = require('../util/common')

const prefix = '/api/v1'
const routerApi = new Router({
  prefix: '/api/v1'
})

const getUrl = [
  '/vpc/describe',
  '/subnet/describe',
  '/security_group/describe',
  '/cloud_account/list',
  '/region/list',
  '/zone/list',
  '/instance_type/list',
  '/image/list'
]
const postUrl = [
  '/cloud_account/create',
  '/cloud_account/edit',
  '/vpc/create',
  '/subnet/create',
  '/security_group/create',
  '/security_group/create_with_rule',
  '/security_group/rule/add',
  '/network_config/sync'
]

common.generateRouter(getUrl, postUrl, routerApi, host.getHost(), prefix)

routerApi.get('/ok', async(ctx) => {
  try {
    ctx.body = await request({
      url: host.getHost()
    })
  } catch (e) {
    ctx.body = e.error
  }
})

routerApi.delete('/cloud_account/delete/:ids', async(ctx) => {
  try {
    ctx.body = await request({
      headers: {
        authorization: ctx.header.authorization
      },
      url: `${host.getHost()}${prefix}/cloud_account/delete/${ctx.params.ids}`,
      method: 'DELETE'
    })
  } catch (e) {
    ctx.body = e.error
  }
})

routerApi.get('/vpc/info/:id', async(ctx) => {
  try {
    ctx.body = await request({
      headers: {
        authorization: ctx.header.authorization
      },
      url: `${host.getHost()}${prefix}/vpc/info/${ctx.params.id}`,
    })
  } catch (e) {
    ctx.body = e.error
  }
})

routerApi.get('/subnet/info/:id', async(ctx) => {
  try {
    ctx.body = await request({
      headers: {
        authorization: ctx.header.authorization
      },
      url: `${host.getHost()}${prefix}/subnet/info/${ctx.params.id}`,
      qs: ctx.query
    })
  } catch (e) {
    ctx.body = e.error
  }
})

routerApi.get('/security_group/:id/rules', async(ctx) => {
  try {
    ctx.body = await request({
      headers: {
        authorization: ctx.header.authorization
      },
      url: `${host.getHost()}${prefix}/security_group/${ctx.params.id}/rules`,
      qs: ctx.query
    })
  } catch (e) {
    ctx.body = e.error
  }
})

module.exports = routerApi
