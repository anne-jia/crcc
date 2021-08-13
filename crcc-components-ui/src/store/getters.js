const getters = {
  sidebar: state => state.app.sidebar,
  size: state => state.app.size,
  device: state => state.app.device,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  avatar: state => state.user.avatar,
  userId: state => state.user.userId,
  userProviderId: state => state.user.userProviderId,
  positions: state => state.user.positions,
  mainPosition: state => state.user.mainPosition,
  name: state => state.user.name,
  introduction: state => state.user.introduction,
  roles: state => state.user.roles,
  permission_routes: state => state.permission.routes,
  permission_menus: state => state.permission.menus,
  hasPermission: state => state.permission.hasPermission
}
export default getters
