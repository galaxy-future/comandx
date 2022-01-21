<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
/* 设置滚动条的样式 */
::-webkit-scrollbar {
  width:7px;
}
/* 滚动槽 */
::-webkit-scrollbar-track {
  -webkit-box-shadow:inset006pxrgba(0,0,0,0.3);
  border-radius:7px;
}
/* 滚动条滑块 */
::-webkit-scrollbar-thumb {
  border-radius:7px;
  background:rgba(0,0,0,0.1);
  -webkit-box-shadow:inset006pxrgba(0,0,0,0.5);
}
::-webkit-scrollbar-thumb:window-inactive {
  background: rgb(202, 202, 203);
}
/* fix el-table for safari*/
.el-table__body {
  width: 100%;
  table-layout: fixed !important;
}

.el-tooltip__popper.is-light {
  border-color: #d6d8da !important;
}
</style>
