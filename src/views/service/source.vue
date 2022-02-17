<template>
  <div class="container">
    <div class="wrap">
      <iframe :src="href+$route.params.service_name" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'Monitor',
  data() {
    return {
      href: '/d/-DgXCgf7z/system-metrics-for-the-linux-hosts?orgId=1&var-ident=All&var-psm='
    }
  },
  methods: {}
}
</script>

<style lang="less" scoped>
.container {
    position: absolute;
    width: 100%;
    height: 100%;
    padding: 10px 10px 0 10px;
    background-color: rgb(240, 242, 245);

    .wrap {
        overflow: hidden;
        position: relative;
        height: 100%;
        background: white;
        box-shadow: 4px 4px 5px rgba(0, 0, 0, .08);

        iframe {
            width: 100%;
            height: 100%;
        }
    }
}
</style>
