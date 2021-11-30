const bridgx_host = 'http://127.0.0.1:9090'
// const bridgx_host = 'http://bridgx-api.internal.galaxy-future.org'

// const schedulx_host = 'http://10.16.23.96:9090'
const schedulx_host = 'http://127.0.0.1:9091'

const kube_host = 'http://127.0.0.1:8080'

function getBridgXHost() {
  return bridgx_host
}
function getSchedulXHost() {
  return schedulx_host
}
function getKubeHost() {
  return kube_host
}
exports.getHost = getBridgXHost
exports.getSchedulxHost = getSchedulXHost
exports.getKubeHost = getKubeHost
