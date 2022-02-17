const host = require('../config/host')
const Router = require('koa-router')
const common = require('../util/common')

const prefix = '/api/v1/task'
const routerApi = new Router({
  prefix
})

const getUrl = [
  '/describe_all',
  '/num',
  '/list',
  '/describe',
  '/instances'
]
const postUrl = []
common.generateRouter(getUrl, postUrl, routerApi, host.getHost(), prefix)

module.exports = routerApi
