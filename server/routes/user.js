const Router = require('koa-router')
const host = require('../config/host')
const request = require('request-promise')
const common = require('../util/common')

const userRouter = new Router()

const getUrl = [
  '/api/v1/user/info',
  '/api/v1/user/list'
]
const postUrl = [
  '/user/login',
  '/user/logout',
  '/user/refresh_token',
  '/api/v1/org/edit',
  '/api/v1/user/create_user',
  '/api/v1/user/modify_password',
  '/api/v1/user/enable_user',
  '/api/v1/user/modify_user_type'
]
common.generateRouter(getUrl, postUrl, userRouter, host.getHost(), '')

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

module.exports = userRouter
