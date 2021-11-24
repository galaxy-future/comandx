const host = 'http://127.0.0.1:9090'
// const host = 'http://bridgx-api.internal.galaxy-future.org'

const schedulx_host = 'http://10.16.23.96:9090'
// const schedulx_host = 'http://192.168.35.41:9090'

function getHost() {
  return host
}
function getSchedulxHost() {
  return schedulx_host
}
exports.getHost = getHost
exports.getSchedulxHost = getSchedulxHost
