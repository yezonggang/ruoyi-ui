import request from '@/utils/request'

// 查询测试表a列表
export function listTesta(query) {
  return request({
    url: '/testyzg/testa/list',
    method: 'get',
    params: query
  })
}

// 查询测试表a详细
export function getTesta(a) {
  return request({
    url: '/testyzg/testa/' + a,
    method: 'get'
  })
}

// 新增测试表a
export function addTesta(data) {
  return request({
    url: '/testyzg/testa',
    method: 'post',
    data: data
  })
}

// 修改测试表a
export function updateTesta(data) {
  return request({
    url: '/testyzg/testa',
    method: 'put',
    data: data
  })
}

// 删除测试表a
export function delTesta(a) {
  return request({
    url: '/testyzg/testa/' + a,
    method: 'delete'
  })
}
