const host = require('../config/host')
const request = require('request-promise')
const Router = require('koa-router')
const common = require('../util/common')

const prefix = '/api/v1/cudgx'
const routerApi = new Router({
  prefix
})

const getUrl = [
  '/predict/rule/list'
]

const postUrl = [
  '/predict/rule/create',
  '/predict/rule/update',
  '/predict/rule/batch/delete'
]

common.generateRouter(getUrl, postUrl, routerApi, host.getCudgxHost(), prefix)

routerApi.get('/predict/rule/:id', async(ctx) => {
  try {
    ctx.body = await request({
      headers: {
        authorization: ctx.header.authorization
      },
      url: `${host.getCudgxHost()}${prefix}/predict/rule/${ctx.params.id}`,
      json: true
    })
  } catch (e) {
    ctx.body = e.error
  }
})

routerApi.post('/predict/rule/:id/enable', async(ctx) => {
  try {
    ctx.body = await request({
      headers: {
        authorization: ctx.header.authorization
      },
      url: `${host.getCudgxHost()}${prefix}/predict/rule/${ctx.params.id}/enable`,
      method: 'POST',
      json: true
    })
  } catch (e) {
    ctx.body = e.error
  }
})

routerApi.post('/predict/rule/:id/disable', async(ctx) => {
  try {
    ctx.body = await request({
      headers: {
        authorization: ctx.header.authorization
      },
      url: `${host.getCudgxHost()}${prefix}/predict/rule/${ctx.params.id}/disable`,
      method: 'POST',
      json: true
    })
  } catch (e) {
    ctx.body = e.error
  }
})

module.exports = routerApi
