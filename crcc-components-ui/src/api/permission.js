
export function getUserMenus() {
  return window.axios({
    url: `${window.CLIENT_URL}/sysMenu/getUserMenus`,
    method: 'get'
  })
}

export function hasPermission() {
  return window.axios({
    url: `${window.CLIENT_URL}/sysBizOperation/hasAuthSubject`,
    method: 'get'
  })
}
