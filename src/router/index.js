import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

import Layout from '@/layout'
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: 'Dashboard', icon: 'dashboard' }
    }]
  },
  {
    path: '/task',
    component: Layout,
    redirect: '/task/create',
    name: '扩缩容任务',
    meta: { title: '扩缩容任务', icon: 'task' },
    children: [
      {
        path: '/task/create/once',
        name: 'createOnceTask',
        component: () => import('@/views/elasticTask/createOnceTask'),
        meta: { title: '立即扩缩容', icon: '' }
      },
      {
        path: '/task/create/cron',
        name: 'createCronTask',
        component: () => import('@/views/elasticTask/createCronTask'),
        meta: { title: '定时扩缩容', icon: '' }
      },
      {
        path: '/task/list',
        name: 'taskList',
        component: () => import('@/views/elasticTask/taskList'),
        meta: { title: '任务列表', icon: '' }
      }
    ]
  },
  {
    path: '/cluster',
    component: Layout,
    redirect: '/cluster',
    name: '集群管理',
    meta: { title: '集群管理', icon: 'cluster' },
    children: [{
      path: '/cluster/create',
      name: 'clusterCreate',
      component: () => import('@/views/cluster/createOrEdit'),
      meta: { title: '创建标准集群', icon: '' }
    }, {
      path: '/cluster/list',
      name: 'clusterList',
      component: () => import('@/views/cluster/index'),
      meta: { title: '标准集群', icon: '' }
    }, {
      path: '/cluster/public',
      name: 'publicCluster',
      component: () => import('@/views/cluster/privateCluster'),
      meta: { title: '自定义集群(公有云)', icon: '' }
    }, {
      path: '/cluster/private',
      name: 'privateCluster',
      component: () => import('@/views/cluster/privateCluster'),
      meta: { title: '自定义集群(私有云)', icon: '' }
    }, {
      path: '/cluster/edit/:name',
      name: 'clusterEdit',
      component: () => import('@/views/cluster/createOrEdit'),
      meta: { title: '编辑集群', icon: '' },
      hidden: true
    }, {
      path: '/cluster/info/:name',
      name: 'clusterInfo',
      component: () => import('@/views/cluster/detail'),
      meta: { title: '集群信息', icon: '' },
      hidden: true
    }, {
      path: '/cluster/public/add',
      name: 'publicClusterAdd',
      component: () => import('@/views/cluster/createOrEditPrivate'),
      meta: { title: '录入公有云集群', icon: '' },
      hidden: true
    }, {
      path: '/cluster/private/create',
      name: 'privateClusterCreate',
      component: () => import('@/views/cluster/createOrEditPrivate'),
      meta: { title: '创建私有云集群', icon: '' },
      hidden: true
    }, {
      path: '/cluster/private/:name/detail',
      name: 'privateClusterDetail',
      component: () => import('@/views/cluster/privateClusterDetail'),
      meta: { title: '私有云集群详情', icon: '' },
      hidden: true
    }, {
      path: '/cluster/public/:name/detail',
      name: 'publicClusterDetail',
      component: () => import('@/views/cluster/privateClusterDetail'),
      meta: { title: '公有云集群(录入)详情', icon: '' },
      hidden: true
    }]
  },
  {
    path: '/galaxy-cloud',
    component: Layout,
    redirect: '/galaxy-cloud/cluster',
    name: '集群',
    meta: { title: 'K8s集群', icon: 'galaxy' },
    children: [
      {
        path: '/galaxy-cloud/cluster',
        name: 'galaxyCloudCluster',
        redirect: '/galaxy-cloud/cluster/list',
        component: () => import('@/views/galaxyCloud/admin'),
        meta: { title: '集群列表', icon: '' },
        children: [{
          path: '/galaxy-cloud/cluster/list',
          name: 'galaxyCloudClusterList',
          component: () => import('@/views/galaxyCloud/clusterList'),
          meta: { title: '集群列表', icon: '', breadcrumb: false }
        }, {
          path: '/galaxy-cloud/cluster/create',
          name: 'galaxyCloudClusterCreate',
          component: () => import('@/views/galaxyCloud/createCluster'),
          meta: { title: '创建集群', icon: '' },
          hidden: true
        }, {
          path: '/galaxy-cloud/cluster/:clusterId/node/list',
          name: 'galaxyCloudClusterNodeList',
          component: () => import('@/views/galaxyCloud/clusterNodes'),
          meta: { title: '机器资源', icon: '' },
          hidden: true
        }, {
          path: '/galaxy-cloud/cluster/:clusterId/pod/list',
          name: 'galaxyCloudClusterPodList',
          component: () => import('@/views/galaxyCloud/clusterPods'),
          meta: { title: '实例资源', icon: '' },
          hidden: true
        }, {
          path: '/galaxy-cloud/cluster/:clusterId/node/:nodeIp/pod/list',
          name: 'galaxyCloudClusterPodList',
          component: () => import('@/views/galaxyCloud/clusterPods'),
          meta: { title: '实例资源', icon: '' },
          hidden: true
        }]
      },
      {
        path: '/galaxy-cloud/instance/apply',
        name: 'galaxyCloudInstanceApply',
        component: () => import('@/views/galaxyCloud/applyInstance'),
        meta: { title: '申请实例', icon: '' }
      },
      {
        path: '/galaxy-cloud/instance/group',
        name: 'galaxyCloudInstanceGroup',
        component: () => import('@/views/galaxyCloud/instanceGroup'),
        meta: { title: '实例组', icon: '' }
      },
      {
        path: '/galaxy-cloud/instance/self',
        name: 'galaxyCloudInstanceSelf',
        component: () => import('@/views/galaxyCloud/selfInstance'),
        meta: { title: '实例列表', icon: '' }
      },
      {
        path: '/galaxy-cloud/instance/form',
        name: 'galaxyCloudInstanceForm',
        component: () => import('@/views/galaxyCloud/instanceForm'),
        meta: { title: '实例申请单', icon: '' }
      }
    ]
  },
  {
    path: '/service',
    component: Layout,
    redirect: '/service/list',
    name: '服务部署',
    meta: { title: '服务部署', icon: 'service' },
    children: [{
      path: '/service/create',
      name: 'serviceCreate',
      component: () => import('@/views/service/create'),
      meta: { title: '创建服务', icon: '' }
    }, {
      path: '/service/list',
      name: 'serviceList',
      component: () => import('@/views/service/list'),
      meta: { title: '服务列表', icon: '' }
    }, {
      path: '/service/:service_name/monitor',
      name: 'serviceMonitor',
      component: () => import('@/views/service/monitor'),
      meta: { title: '服务列表', icon: '' },
      hidden: true
    }, {
      path: '/service/:service_name/:service_cluster_id/template',
      name: 'templateList',
      component: () => import('@/views/template/index'),
      meta: { title: '服务列表', icon: '' },
      hidden: true
    }, {
      path: '/service/:service_name/:service_cluster_id/create',
      name: 'createRule',
      component: () => import('@/views/template/createOrEditRule'),
      meta: { title: '服务列表', icon: '' },
      hidden: true
    }, {
      path: '/service/:service_name/:service_cluster_id/update/:rule_id',
      name: 'updateRule',
      component: () => import('@/views/template/createOrEditRule'),
      meta: { title: '服务列表', icon: '' },
      hidden: true
    }, {
      path: '/service/:service_name/:service_cluster_id/template-create',
      name: 'templateCreate',
      component: () => import('@/views/template/createOrEdit'),
      meta: { title: '创建扩缩容流程', icon: '' },
      hidden: true
    }, {
      path: '/service/template-edit/:service_name/:tmpl_expand_id',
      name: 'templateEdit',
      component: () => import('@/views/template/createOrEdit'),
      meta: { title: '编辑扩缩容流程', icon: '' },
      hidden: true
    }, {
      path: '/service/help',
      name: 'noService',
      component: () => import('@/views/service/help'),
      meta: { title: '帮助', icon: '' },
      hidden: true
    }]
  },
  {
    path: '/instance',
    component: Layout,
    redirect: '/instance',
    children: [{
      path: 'instance',
      name: 'instanceList',
      component: () => import('@/views/instance/index'),
      meta: { title: '云服务器', icon: 'instance' }
    }]
  },
  {
    path: '/provider',
    component: Layout,
    redirect: '/provider',
    children: [{
      path: 'provider',
      name: 'provider',
      component: () => import('@/views/cloudAccount/index'),
      meta: { title: '云厂商账户', icon: 'cloudAccount' }
    }]
  },
  {
    path: '/billing',
    component: Layout,
    redirect: '/billing',
    children: [{
      path: 'billing',
      name: 'billing',
      component: () => import('@/views/billing/index'),
      meta: { title: '费用管理', icon: 'billing' }
    }]
  },
  {
    path: '/account',
    component: Layout,
    redirect: '/account',
    children: [{
      path: 'account',
      name: 'account',
      component: () => import('@/views/account/index'),
      meta: { title: '账户管理', icon: 'account' }
    }]
  },
  {
    path: '/help',
    component: () => import('@/views/help'),
    hidden: true
  },
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
