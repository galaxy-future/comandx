const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  bridgX: state => state.app.service.bridgX,
  schedulX: state => state.app.service.schedulX,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  userType: state => state.user.userType,
  orgId: state => state.user.orgId
}
export default getters
