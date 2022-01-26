import request from '@/utils/request'
import { getToken } from '@/utils/auth'
import _ from 'lodash'

export function login(data) {
  return request({
    url: '/user/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/api/v1/user/info',
    method: 'get',
    headers: {
      Authorization: ` Bearer ${token}`
    }
  })
}

export function refreshToken() {
  const token = getToken()
  return request({
    url: '/user/refresh_token',
    method: 'post',
    headers: {
      Authorization: ` Bearer ${token}`
    }
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}

export async function userList(page_number, page_size) {
  const token = getToken()
  const res = await request({
    url: '/api/v1/user/list',
    params: {
      page_number,
      page_size
    },
    headers: {
      Authorization: ` Bearer ${token}`
    }
  })
  return _.get(res, 'data')
}

export function createUser(username, password, user_type) {
  const token = getToken()
  return request({
    url: '/api/v1/user/create_user',
    method: 'post',
    data: {
      username,
      password,
      user_type
    },
    headers: {
      Authorization: ` Bearer ${token}`
    }
  })
}

export function passwordModify(username, old_password, new_password) {
  const token = getToken()
  return request({
    url: '/api/v1/user/modify_password',
    method: 'post',
    data: {
      username,
      old_password,
      new_password
    },
    headers: {
      Authorization: ` Bearer ${token}`
    }
  })
}

export function userEnable(usernames, action) {
  const token = getToken()
  return request({
    url: '/api/v1/user/enable_user',
    method: 'post',
    data: {
      usernames,
      action
    },
    headers: {
      Authorization: ` Bearer ${token}`
    }
  })
}

export function modifyUserType(user_ids, user_type) {
  const token = getToken()
  return request({
    url: '/api/v1/user/modify_user_type',
    method: 'post',
    data: {
      user_ids,
      user_type
    },
    headers: {
      Authorization: ` Bearer ${token}`
    }
  })
}

export async function getOrg(org_id) {
  const token = getToken()
  const res = await request({
    url: `/api/v1/org/id/${org_id}`,
    headers: {
      Authorization: ` Bearer ${token}`
    }
  })
  return _.get(res, 'data')
}

export function editOrg(org_id, org_name) {
  const token = getToken()
  return request({
    url: '/api/v1/org/edit',
    method: 'post',
    data: {
      org_id,
      org_name
    },
    headers: {
      Authorization: ` Bearer ${token}`
    }
  })
}
