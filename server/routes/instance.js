const host = require('../config/host')
const request = require('request-promise')
const Router = require('koa-router')
const common = require('../util/common')

const prefix = '/api/v1/instance'
const routerApi = new Router({
  prefix
})

const getUrl = [
  '/num',
  '/describe_all',
  '/id/describe',
  '/usage_total',
  '/usage_statistics',
  '/list_custom'
]
const postUrl = []
common.generateRouter(getUrl, postUrl, routerApi, host.getHost(), prefix)

module.exports = routerApi
