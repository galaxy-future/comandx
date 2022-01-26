import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login', '/help'] // no redirect whitelist

router.beforeEach(async(to, from, next) => {
  // start progress bar
  NProgress.start()

  // set page title
  document.title = getPageTitle(to.meta.title)

  if (store.getters.bridgX === 'unchecked') {
    await store.dispatch('app/checkBridgX')
    if (!store.getters.bridgX) {
      next({ path: '/help' })
      return
    }
  }

  if (store.getters.schedulX === 'unchecked' && to.path.substring(0, 8) === '/service') {
    try {
      await store.dispatch('app/checkSchedulX')
      if (!store.getters.schedulX) {
        next({ path: '/service/help' })
      }
    } catch (e) {
      // do nothing
    }
  }

  // determine whether the user has logged in
  const hasToken = getToken()

  if (hasToken) {
    if (to.path === '/login') {
      // if is logged in, redirect to the home page
      next({ path: '/' })
      NProgress.done()
    } else {
      const hasGetUserInfo = store.getters.name
      if (hasGetUserInfo) {
        next()
      } else {
        try {
          // get user info
          await store.dispatch('user/getInfo')
          next()
        } catch (error) {
          // remove token and go to login page to re-login
          await store.dispatch('user/resetToken')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    /* has no token*/
    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }

  // check right
  if (store.getters.userType !== 'ADMIN' && to.meta.isAdmin) {
    Message.error('无权限查看页面!')
    next(from)
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
