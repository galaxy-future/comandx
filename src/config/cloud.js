const cloudProviders = [{
  value: 'AlibabaCloud',
  label: '阿里云'
}, {
  value: 'HuaweiCloud',
  label: '华为云'
}
, {
  value: 'TencentCloud',
  label: '腾讯云'
}
]

const cloudDiskTypes = {
  AlibabaCloud: [{
    value: 'cloud_efficiency',
    label: '高效云盘'
  }, {
    value: 'cloud_ssd',
    label: 'SSD云盘'
  }, {
    value: 'cloud_essd',
    label: 'ESSD云盘'
  }],
  HuaweiCloud: [{
    value: 'SAS',
    label: '高IO'
  }, {
    value: 'SSD',
    label: '超高IO'
  }, {
    value: 'CO_P1',
    label: '高IO (性能优化I型)'
  }, {
    value: 'UH_L1',
    label: '高IO (性能优化I型)'
  }],
  TencentCloud: [
  // {
  //   value: 'LOCAL_BASIC',
  //   label: '本地硬盘'
  // }, {
  //   value: 'LOCAL_SSD',
  //   label: '本地SSD硬盘'
  // },
  {
    value: 'CLOUD_BASIC',
    label: '普通云硬盘'
  }, {
    value: 'CLOUD_SSD',
    label: 'SSD云硬盘'
  }, {
    value: 'CLOUD_PREMIUM',
    label: '高性能云硬盘'
  }]
}

const vpcCidrOptions = {
  AlibabaCloud: ['10.0.0.0/8', '172.16.0.0/12', '192.168.0.0/16'],
  HuaweiCloud: ['10.0.0.0/8', '172.16.0.0/12', '192.168.0.0/16'],
  TencentCloud: ['10.0.0.0/16', '172.16.0.0/16', '192.168.0.0/16']
}

const ramUrl = {
  AlibabaCloud: 'https://ram.console.aliyun.com/manage/ak',
  HuaweiCloud: 'https://console.huaweicloud.com/iam/?region=cn-north-4&locale=zh-cn#/mine/accessKey',
  TencentCloud: 'https://console.cloud.tencent.com/cam/capi'
}

const systemDiskSizes = [{
  value: 50,
  label: '50G'
}, {
  value: 100,
  label: '100G'
}, {
  value: 200,
  label: '200G'
}]

const dataDiskSizes = [{
  value: 50,
  label: '50G'
}, {
  value: 500,
  label: '500G'
}, {
  value: 1000,
  label: '1T'
}, {
  value: 2000,
  label: '2T'
}]

const huaweiIpType = [{
  value: '5_telcom',
  label: '电信'
}, {
  value: '5_union',
  label: '联通'
}, {
  value: '5_bgp',
  label: '全动态BGP'
}, {
  value: '5_sbgp',
  label: '静态BGP'
}, {
  value: '5_ipv6',
  label: 'ipv6'
}]

const aksk = {
  AlibabaCloud: {
    key: 'AccessKey',
    secret: 'AccessKey Secret'
  },
  HuaweiCloud: {
    key: 'AK',
    secret: 'SK'
  },
  TencentCloud: {
    key: 'AK',
    secret: 'SK'
  }
}

const taskStatus = [{
  label: '待执行',
  value: 'INIT'
}, {
  label: '执行成功',
  value: 'SUCCESS'
}, {
  label: '执行中',
  value: 'RUNNING'
}, {
  label: '执行失败',
  value: 'FAILED'
}]

const imageTypes = [{
  value: 'global',
  label: '公共镜像'
}, {
  value: 'private',
  label: '私有镜像'
}]

const chargeUnits = {
  AlibabaCloud: [{
    value: 'Week',
    label: '周'
  }, {
    value: 'Month',
    label: '月'
  }],
  HuaweiCloud: [{
    value: 'Month',
    label: '月'
  }, {
    value: 'Year',
    label: '年'
  }],
  TencentCloud: [{
    value: 'Month',
    label: '月'
  }]
}

const protocols = {
  AlibabaCloud: ['tcp', 'udp', 'icmp', 'gre', 'all'],
  HuaweiCloud: ['tcp', 'udp', 'icmp', 'all'],
  TencentCloud: ['tcp', 'udp', 'icmp', 'gre', 'all']
}

const chargePeriods = {
  AlibabaCloud: {
    Week: [1, 2, 3, 4],
    Month: [1, 2, 3, 4, 6, 12, 24, 36, 48, 60]
  },
  HuaweiCloud: {
    Month: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    Year: [1, 2, 3]
  },
  TencentCloud: {
    Month: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 24, 36, 48, 60]
  }
}

const providerDiskLimits = {
  AlibabaCloud: {
    system_disk: {
      max:  500,
      min: 20
    },
    data_disk: {
      max: 32768,
      min: 20
    }
  },
  HuaweiCloud: {
    system_disk: {
      max: 1024,
      min: 40
    },
    data_disk: {
      max: 32768,
      min: 10
    }
  },
  TencentCloud: {
    system_disk: {
      max: 1024,
      min: 50
    },
    data_disk: {
      max: 32000,
      min: 20
    }
  }
}

export {
  cloudProviders,
  cloudDiskTypes,
  aksk,
  taskStatus,
  systemDiskSizes,
  dataDiskSizes,
  ramUrl,
  huaweiIpType,
  imageTypes,
  chargeUnits,
  protocols,
  chargePeriods,
  vpcCidrOptions,
  providerDiskLimits
}
