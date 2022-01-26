const Router = require('koa-router')
const host = require('../config/host')
const request = require('request-promise')

const userRouter = new Router()

userRouter.post('/user/login', async(ctx) => {
  try {
    ctx.body = await request({
      url: `${host.getHost()}/user/login`,
      method: 'POST',
      body: ctx.request.body,
      json: true
    })
  } catch (e) {
    ctx.body = e.error
  }
})

userRouter.post('/user/refresh_token', async(ctx) => {
  console.log(ctx.header.authorization)
  try {
    ctx.body = await request({
      headers: {
        authorization: ctx.header.authorization
      },
      method: 'POST',
      url: `${host.getHost()}/user/refresh_token`
    })
  } catch (e) {
    ctx.body = e.error
  }
})

userRouter.post('/user/logout', (ctx) => {
  try {
    ctx.body = {
      code: 200,
      data: 'success'
    }
  } catch (e) {
    ctx.body = e.error
  }
})

userRouter.get('/api/v1/user/info', async(ctx) => {
  try {
    ctx.body = await request({
      headers: {
        authorization: ctx.header.authorization
      },
      url: `${host.getHost()}/api/v1/user/info`
    })
  } catch (e) {
    ctx.body = e.error
  }
})

userRouter.get('/api/v1/user/list', async(ctx) => {
  try {
    ctx.body = await request({
      headers: {
        authorization: ctx.header.authorization
      },
      url: `${host.getHost()}/api/v1/user/list`,
      qs: ctx.query
    })
  } catch (e) {
    ctx.body = e.error
  }
})

userRouter.post('/api/v1/user/create_user', async(ctx) => {
  try {
    ctx.body = await request({
      headers: {
        authorization: ctx.header.authorization
      },
      url: `${host.getHost()}/api/v1/user/create_user`,
      method: 'POST',
      body: ctx.request.body,
      json: true
    })
  } catch (e) {
    ctx.body = e.error
  }
})

userRouter.post('/api/v1/user/modify_password', async(ctx) => {
  try {
    ctx.body = await request({
      headers: {
        authorization: ctx.header.authorization
      },
      url: `${host.getHost()}/api/v1/user/modify_password`,
      method: 'POST',
      body: ctx.request.body,
      json: true
    })
  } catch (e) {
    ctx.body = e.error
  }
})

userRouter.post('/api/v1/user/enable_user', async(ctx) => {
  try {
    ctx.body = await request({
      headers: {
        authorization: ctx.header.authorization
      },
      url: `${host.getHost()}/api/v1/user/enable_user`,
      method: 'POST',
      body: ctx.request.body,
      json: true
    })
  } catch (e) {
    ctx.body = e.error
  }
})

userRouter.get('/api/v1/org/id/:id', async(ctx) => {
  try {
    ctx.body = await request({
      headers: {
        authorization: ctx.header.authorization
      },
      url: `${host.getHost()}/api/v1/org/id/${ctx.params.id}`
    })
  } catch (e) {
    ctx.body = e.error
  }
})

userRouter.post('/api/v1/org/edit', async(ctx) => {
  try {
    ctx.body = await request({
      headers: {
        authorization: ctx.header.authorization
      },
      url: `${host.getHost()}/api/v1/org/edit`,
      method: 'POST',
      body: ctx.request.body,
      json: true
    })
  } catch (e) {
    ctx.body = e.error
  }
})

userRouter.post('/api/v1/user/modify_user_type', async(ctx) => {
  try {
    ctx.body = await request({
      headers: {
        authorization: ctx.header.authorization
      },
      url: `${host.getHost()}/api/v1/user/modify_user_type`,
      method: 'POST',
      body: ctx.request.body,
      json: true
    })
  } catch (e) {
    ctx.body = e.error
  }
})

module.exports = userRouter
