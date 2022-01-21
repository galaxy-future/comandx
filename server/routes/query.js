const host = require('../config/host')
const request = require('request-promise')
const Router = require('koa-router')

const prefix = '/api/v1/query'
const routerApi = new Router({
  prefix
})

routerApi.get('/metric/redundancy/:metric_name', async(ctx) => {
  try {
    ctx.body = await request({
      headers: {
        authorization: ctx.header.authorization
      },
      url: `${host.getCudgxHost()}${prefix}/metric/redundancy/${ctx.params.metric_name}`,
      qs: ctx.query,
      json: true
    })
  } catch (e) {
    ctx.body = e.error
  }
})

routerApi.get('/metric/instance_count/:metric_name', async(ctx) => {
  try {
    ctx.body = await request({
      headers: {
        authorization: ctx.header.authorization
      },
      url: `${host.getCudgxHost()}${prefix}/metric/instance_count/${ctx.params.metric_name}`,
      qs: ctx.query,
      json: true
    })
  } catch (e) {
    ctx.body = e.error
  }
})

routerApi.get('/metric/load/:metric_name', async(ctx) => {
  try {
    ctx.body = await request({
      headers: {
        authorization: ctx.header.authorization
      },
      url: `${host.getCudgxHost()}${prefix}/metric/load/${ctx.params.metric_name}`,
      qs: ctx.query,
      json: true
    })
  } catch (e) {
    ctx.body = e.error
  }
})

module.exports = routerApi
