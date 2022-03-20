const request = require('request-promise')

function generateRouter(getUrl, postUrl, routerApi, host, prefix) {
  getUrl.forEach((i) => {
    routerApi.get(i, async(ctx) => {
      try {
        ctx.body = await request({
          headers: {
            authorization: ctx.header.authorization
          },
          url: `${host}${prefix}${i}`,
          qs: ctx.query,
          json: true
        })
      } catch (e) {
        ctx.body = e.error
      }
    })
  })

  postUrl.forEach((i) => {
    routerApi.post(i, async(ctx) => {
      try {
        ctx.body = await request({
          headers: {
            authorization: ctx.header.authorization
          },
          url: `${host}${prefix}${i}`,
          method: 'POST',
          body: ctx.request.body,
          json: true
        })
      } catch (e) {
        ctx.body = e.error
      }
    })
  })
}

exports.generateRouter = generateRouter
exports.request = request
