const Router = require('koa-router')
const host = require('../config/host')
const request = require('request-promise')

const prefix = '/api/v1'
const routerApi = new Router({
  prefix: '/api/v1'
})

routerApi.get('/ok', async(ctx) => {
  try {
    ctx.body = await request({
      url: host.getHost()
    })
  } catch (e) {
    ctx.body = e.error
  }
})

routerApi.get('/vpc/describe', async(ctx) => {
  try {
    ctx.body = await request({
      headers: {
        authorization: ctx.header.authorization
      },
      url: `${host.getHost()}${prefix}/vpc/describe`,
      qs: ctx.query
    })
  } catch (e) {
    ctx.body = e.error
  }
})

routerApi.get('/subnet/describe', async(ctx) => {
  try {
    ctx.body = await request({
      headers: {
        authorization: ctx.header.authorization
      },
      url: `${host.getHost()}${prefix}/subnet/describe`,
      qs: ctx.query
    })
  } catch (e) {
    ctx.body = e.error
  }
})

routerApi.get('/security_group/describe', async(ctx) => {
  try {
    ctx.body = await request({
      headers: {
        authorization: ctx.header.authorization
      },
      url: `${host.getHost()}${prefix}/security_group/describe`,
      qs: ctx.query
    })
  } catch (e) {
    ctx.body = e.error
  }
})

routerApi.get('/cloud_account/list', async(ctx) => {
  try {
    ctx.body = await request({
      headers: {
        authorization: ctx.header.authorization
      },
      url: `${host.getHost()}${prefix}/cloud_account/list`,
      qs: {
        ...ctx.query
      }
    })
  } catch (e) {
    ctx.body = e.error
  }
})

routerApi.post('/cloud_account/create', async(ctx) => {
  ctx.body = await request({
    headers: {
      authorization: ctx.header.authorization
    },
    url: `${host.getHost()}${prefix}/cloud_account/create`,
    method: 'POST',
    body: ctx.request.body,
    json: true
  })
})

routerApi.post('/cloud_account/edit', async(ctx) => {
  try {
    ctx.body = await request({
      headers: {
        authorization: ctx.header.authorization
      },
      url: `${host.getHost()}${prefix}/cloud_account/edit`,
      method: 'POST',
      body: ctx.request.body,
      json: true
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

routerApi.get('/region/list', async(ctx) => {
  try {
    ctx.body = await request({
      headers: {
        authorization: ctx.header.authorization
      },
      url: `${host.getHost()}${prefix}/region/list`,
      qs: ctx.query
    })
  } catch (e) {
    ctx.body = e.error
  }
})

routerApi.get('/zone/list', async(ctx) => {
  try {
    ctx.body = await request({
      headers: {
        authorization: ctx.header.authorization
      },
      url: `${host.getHost()}${prefix}/zone/list`,
      qs: ctx.query
    })
  } catch (e) {
    ctx.body = e.error
  }
})

routerApi.get('/instance_type/list', async(ctx) => {
  try {
    ctx.body = await request({
      headers: {
        authorization: ctx.header.authorization
      },
      url: `${host.getHost()}${prefix}/instance_type/list`,
      qs: ctx.query
    })
  } catch (e) {
    ctx.body = e.error
  }
})

routerApi.post('/vpc/create', async(ctx) => {
  try {
    ctx.body = await request({
      headers: {
        authorization: ctx.header.authorization
      },
      method: 'POST',
      url: `${host.getHost()}${prefix}/vpc/create`,
      body: ctx.request.body,
      json: true
    })
  } catch (e) {
    ctx.body = e.error
  }
})

routerApi.post('/subnet/create', async(ctx) => {
  try {
    ctx.body = await request({
      headers: {
        authorization: ctx.header.authorization
      },
      method: 'POST',
      url: `${host.getHost()}${prefix}/subnet/create`,
      body: ctx.request.body,
      json: true
    })
  } catch (e) {
    ctx.body = e.error
  }
})

routerApi.post('/security_group/create', async(ctx) => {
  try {
    ctx.body = await request({
      headers: {
        authorization: ctx.header.authorization
      },
      method: 'POST',
      url: `${host.getHost()}${prefix}/security_group/create`,
      body: ctx.request.body,
      json: true
    })
  } catch (e) {
    ctx.body = e.error
  }
})

routerApi.post('/security_group/create_with_rule', async(ctx) => {
  try {
    ctx.body = await request({
      headers: {
        authorization: ctx.header.authorization
      },
      method: 'POST',
      url: `${host.getHost()}${prefix}/security_group/create_with_rule`,
      body: ctx.request.body,
      json: true
    })
  } catch (e) {
    ctx.body = e.error
  }
})

routerApi.post('/security_group/rule/add', async(ctx) => {
  try {
    ctx.body = await request({
      headers: {
        authorization: ctx.header.authorization
      },
      method: 'POST',
      url: `${host.getHost()}${prefix}/security_group/rule/add`,
      body: ctx.request.body,
      json: true
    })
  } catch (e) {
    ctx.body = e.error
  }
})

routerApi.get('/image/list', async(ctx) => {
  try {
    ctx.body = await request({
      headers: {
        authorization: ctx.header.authorization
      },
      url: `${host.getHost()}${prefix}/image/list`,
      qs: ctx.query
    })
  } catch (e) {
    ctx.body = e.error
  }
})

routerApi.post('/network_config/sync', async(ctx) => {
  try {
    ctx.body = await request({
      headers: {
        authorization: ctx.header.authorization
      },
      url: `${host.getHost()}${prefix}/network_config/sync`,
      method: 'POST',
      body: ctx.request.body,
      json: true
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
