const Koa = require('koa')

const app = new Koa()
const serve = require('koa-static')
const json = require('koa-json')
const onerror = require('koa-onerror')
const koaBody = require('koa-body')
const logger = require('koa-logger')
const path = require('path')

const cloud = require('./routes/cloud')
const user = require('./routes/user')
const task = require('./routes/task')
const instance = require('./routes/instance')
const cluster = require('./routes/cluster')
const service = require('./routes/service')
app.use(koaBody())

onerror(app)

app.use(json())
app.use(logger())
app.use(require('koa-static')(`${__dirname}/public`))

// logger
app.use(async(ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

// routes
app.use(cloud.routes())
app.use(user.routes())
app.use(cluster.routes())
app.use(task.routes())
app.use(instance.routes())
app.use(service.routes())

app.use(serve(path.join(__dirname, 'web'), { maxage: 1000 * 60 * 60 }))
app.listen(80)

module.exports = app
