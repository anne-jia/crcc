
export function getInfo() {
  return window.axios({
    url: '/auth/user/info',
    method: 'get'
  })
}

export function getMainPosition(providerId, userId) {
  return window.axios({
    url: `/hrEmployee/getUserMainPosition`,
    method: 'get',
    params: { providerId, userId }
  })
}

export function logout() {
  return window.axios({
    url: '/user/logout',
    method: 'post'
  })
}
