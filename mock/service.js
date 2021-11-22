const { string } = require('jszip/lib/support')
const Mock = require('mockjs')
const service_list = Mock.mock({
  'service_list|25': [{
    'service_id|+1': 1,
    'service_cluster_id|+1': 1,
    service_cluster_name: '@sentence(1,5)',
    service_name: '@sentence(1,10)',
    language: '@sentence(1,10)',
    tmpl_expand_name: '@sentence(1,10)',
    auto_decision: 'on',
    task_type_status: '扩容中',
    inst_cnt: '@integer(100, 500)',
    description: '@sentence(1,10)'
  }]
})

const tmpl_expand_list = Mock.mock({
  'tmpl_expand_list|10': [{
    'tmpl_expand_id|+1': 1,
    tmpl_expand_name: '@sentence(1,10)',
    inst_cluster_id: '@integer(100, 500)',
    inst_cluster_name: '@sentence(1,10)',
    is_container: '@sentence(1,10)',
    register_type: '@sentence(1,10)'
  }]
})

const schedule_task_list = Mock.mock({
  'schedule_task_list|25': [{
    'task_id|+1': 1,
    tmpl_expand_name: '@sentence(1,10)',
    schedule_type: '@sentence(1,10)',
    task_inst_cnt: '@integer(100, 500)',
    task_exec_opr: '@sentence(1,10)',
    task_exec_type: '@sentence(1,10)',
    begin_at: '@sentence(1,10)',
    time_cost: '@sentence(1,10)',
    task_status: '@sentence(1,10)',
    task_step_desc: '@sentence(1,10)'
  }]
})

const tmpl_decision_rule = Mock.mock({
  'tmpl_decision_rule': {
    metric_value: '@integer(100, 500)',
    redundancy: '@integer(100, 500)',
    expand_size: '@integer(100, 500)',
    is_valid: 1

  }
})


module.exports = [
  {
    url: '/api/v1/schedulx/service/list',
    type: 'get',
    response: config => {
      const items = service_list.service_list
      return {
        code: 200,
        data: {
          service_list: items,
          pager: {
            page_number:1,
            page_size:20,
            total: items.length
          }
        }
      }
    }
  },
  {
    url: '/api/v1/schedulx/service/create',
    type: 'post',
    response: config => {
      return {
        code: 200,
        data: {
          "service_cluster_id": 1
        }
      }
    }
  },
  {
    url: '/api/v1/schedulx/service/update',
    type: 'post',
    response: config => {
      return {
        code: 200
      }
    }
  },
  {
    url: '/api/v1/schedulx/service/expand',
    type: 'get',
    response: config => {
      return {
        code: 200,
        task_id: 1
      }
    }
  },
  {
    url: '/api/v1/schedulx/service/shrink',
    type: 'get',
    response: config => {
      return {
        code: 200,
        task_id: 1
      }
    }
  },
  {
    url: '/api/v1/schedulx/service/breathrecord',
    type: 'get',
    response: config => {
      const items = schedule_task_list.schedule_task_list
      return {
        code: 200,
        data: {
          schedule_task_list: items,
          pager: {
            page_number:1,
            page_size:20,
            total: items.length
          }
        }
      }
    }
  },
  {
    url: '/api/v1/schedulx/template/expand/create',
    type: 'post',
    response: config => {
      return {
        code: 200,
        tmpl_id: 1
      }
    }
  },
  {
    url: '/api/v1/schedulx/template/expand/list',
    type: 'get',
    response: config => {
      const items = tmpl_expand_list.tmpl_expand_list
      return {
        code: 200,
        data: {
          tmpl_expand_list: items,
          pager: {
            page_number:1,
            page_size:20,
            total: items.length
          }
        }
      }
    }
  },
  {
    url: '/api/v1/schedulx/decision/rule/info',
    type: 'get',
    response: config => {
      const items = tmpl_decision_rule.tmpl_decision_rule
      return {
        code: 200,
        data: {
          tmpl_decision_rule: items
        }
      }
    }
  },
  {
    url: '/api/v1/schedulx/decision/rule/update',
    type: 'post',
    response: config => {
      return {
        code: 200
      }
    }
  },
]
