const host = require('../config/host')
const request = require('request-promise')
const Router = require('koa-router')
const routerApi = new Router({
  prefix: '/api/v1'
})

routerApi.get('/schedulx/service/list', async(ctx) => {
  try {
    ctx.body = await request({
      headers: {
        authorization: ctx.header.authorization
      },
      url: `${host.getSchedulxHost()}/api/v1/schedulx/service/list`,
      qs: ctx.query,
      json: true
    })
  } catch (e) {
    ctx.body = e.error
  }
})

routerApi.post('/schedulx/service/update', async(ctx) => {
  try {
    ctx.body = await request({
      headers: {
        authorization: ctx.header.authorization
      },
      url: `${host.getSchedulxHost()}/api/v1/schedulx/service/update`,
      method: 'POST',
      body: ctx.request.body,
      json: true
    })
  } catch (e) {
    ctx.body = e.error
  }
})

routerApi.post('/schedulx/service/create', async(ctx) => {
  try {
    ctx.body = await request({
      headers: {
        authorization: ctx.header.authorization
      },
      url: `${host.getSchedulxHost()}/api/v1/schedulx/service/create`,
      method: 'POST',
      body: ctx.request.body,
      json: true
    })
  } catch (e) {
    ctx.body = e.error
  }
})

routerApi.get('/schedulx/service/expand', async(ctx) => {
  try {
    ctx.body = await request({
      headers: {
        authorization: ctx.header.authorization
      },
      url: `${host.getSchedulxHost}/api/v1/schedulx/service/expand`,
      qs: ctx.query,
      json: true
    })
  } catch (e) {
    ctx.body = e.error
  }
})

routerApi.get('/schedulx/service/shrink', async(ctx) => {
  try {
    ctx.body = await request({
      headers: {
        authorization: ctx.header.authorization
      },
      url: `${host.getSchedulxHost}/api/v1/schedulx/service/shrink`,
      qs: ctx.query,
      json: true
    })
  } catch (e) {
    ctx.body = e.error
  }
})

routerApi.get('/schedulx/template/expand/list', async(ctx) => {
  try {
    ctx.body = await request({
      headers: {
        authorization: ctx.header.authorization
      },
      url: `${host.getSchedulxHost()}/api/v1/schedulx/template/expand/list`,
      qs: ctx.query
    })
  } catch (e) {
    ctx.body = e.error
  }
})

routerApi.post('/schedulx/template/expand/create', async(ctx) => {
  try {
    ctx.body = await request({
      headers: {
        authorization: ctx.header.authorization
      },
      url: `${host.getSchedulxHost()}/api/v1/schedulx/template/expand/create`,
      method: 'POST',
      body: ctx.request.body,
      json: true
    })
  } catch (e) {
    ctx.body = e.error
  }
})

routerApi.post('/schedulx/template/expand/update', async(ctx) => {
  try {
    ctx.body = await request({
      headers: {
        authorization: ctx.header.authorization
      },
      url: `${host.getSchedulxHost()}/api/v1/schedulx/template/expand/update`,
      method: 'POST',
      body: ctx.request.body,
      json: true
    })
  } catch (e) {
    ctx.body = e.error
  }
})

routerApi.post('/schedulx/template/expand/delete', async(ctx) => {
  try {
    ctx.body = await request({
      headers: {
        authorization: ctx.header.authorization
      },
      url: `${host.getSchedulxHost()}/api/v1/schedulx/template/expand/delete`,
      method: 'POST',
      body: ctx.request.body,
      json: true
    })
  } catch (e) {
    ctx.body = e.error
  }
})

routerApi.get('/schedulx/template/expand/info', async(ctx) => {
  try {
    ctx.body = await request({
      headers: {
        authorization: ctx.header.authorization
      },
      url: `${host.getSchedulxHost()}/api/v1/schedulx/template/expand/info`,
      qs: ctx.query
    })
  } catch (e) {
    ctx.body = e.error
  }
})

routerApi.post('/schedulx/decision/rule/update', async(ctx) => {
  try {
    ctx.body = await request({
      headers: {
        authorization: ctx.header.authorization
      },
      url: `${host.getSchedulxHost()}/api/v1/schedulx/decision/rule/update`,
      method: 'POST',
      body: ctx.request.body,
      json: true
    })
  } catch (e) {
    ctx.body = e.error
  }
})

routerApi.get('/schedulx/decision/rule/info', async(ctx) => {
  try {
    ctx.body = await request({
      headers: {
        authorization: ctx.header.authorization
      },
      url: `${host.getSchedulxHost()}/api/v1/schedulx/decision/rule/info`,
      qs: ctx.query
    })
  } catch (e) {
    ctx.body = e.error
  }
})

routerApi.get('/schedulx/service/breathrecord', async(ctx) => {
  try {
    ctx.body = await request({
      headers: {
        authorization: ctx.header.authorization
      },
      url: `${host.getSchedulxHost()}/api/v1/schedulx/service/breathrecord`,
      qs: ctx.query
    })
  } catch (e) {
    ctx.body = e.error
  }
})

routerApi.get('/cluster/describe_all', async(ctx) => {
  try {
    ctx.body = await request({
      headers: {
        authorization: ctx.header.authorization
      },
      url: `${host.getHost()}/api/v1/cluster/describe_all`,
      qs: ctx.query
    })
  } catch (e) {
    ctx.body = e.error
  }
})

module.exports = routerApi
