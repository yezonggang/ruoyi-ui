import request from '@/utils/request'

// 查询监控量测列表
export function listJklc(query) {
  return request({
    url: '/system/jklc/list',
    method: 'get',
    params: query
  })
}

// 查询监控量测详细
export function getJklc(id) {
  return request({
    url: '/system/jklc/' + id,
    method: 'get'
  })
}

// 新增监控量测
export function addJklc(data) {
  return request({
    url: '/system/jklc',
    method: 'post',
    data: data
  })
}

// 修改监控量测
export function updateJklc(data) {
  return request({
    url: '/system/jklc',
    method: 'put',
    data: data
  })
}

// 删除监控量测
export function delJklc(id) {
  return request({
    url: '/system/jklc/' + id,
    method: 'delete'
  })
}
