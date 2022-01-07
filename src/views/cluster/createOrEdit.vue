<template>
  <div class="cluster-container">
    <div class="step-container">
      <el-steps :active="step" finish-status="success" align-center>
        <el-step title="云厂商" />
        <el-step title="网络配置" />
        <el-step title="机器配置" />
        <el-step title="系统配置" />
      </el-steps>
      <div style="padding-top: 10px">
        <div v-if="step === 0" class="form">
          <div class="form-container">
            <el-row>
              <el-col :span="5"><div class="center-text"><div class="asterisk">*</div>云厂商 </div></el-col>
              <el-col :span="19">
                <el-select v-model="cluster.provider" size="medium" placeholder="请选择">
                  <el-option
                    v-for="item in cloudProviders"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                    @click.native.capture="changeProvider(item.value)"
                  />
                </el-select>
              </el-col>
            </el-row>
          </div>
          <div class="form-container">
            <el-row>
              <el-col :span="5"><div class="center-text"><div class="asterisk">*</div>云厂商账户 </div></el-col>
              <el-col :span="19">
                <el-select v-model="cluster.account_key" v-load-more="loadMore" size="medium" @change="loadZoneAndVpc">
                  <el-option v-for="(p, idx) in accounts" :key="idx" :label="p.account_name" :value="p.account">
                    <span>{{ p.account_name }}({{ p.account }})</span>
                  </el-option>
                </el-select>
                <el-button type="text" style="margin-left: 10px" @click="transferTo('provider')">添加云厂商账户</el-button>
              </el-col>
            </el-row>
          </div>
          <div class="form-container">
            <el-row>
              <el-col :span="5"><div class="center-text"><div class="asterisk">*</div>集群名称 </div></el-col>
              <el-col :span="19">
                <el-input v-model="cluster.name" size="medium" placeholder="请输入集群名称" maxlength="20" show-word-limit style="width: 400px" />
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="5"><div style="height: 16px" /></el-col>
              <el-col :span="19"><div class="note">支持中文、英文、数字，限制20字符</div></el-col>
            </el-row>
          </div>
          <div class="form-container">
            <el-row>
              <el-col :span="5"><div class="center-text">集群描述 </div></el-col>
              <el-col :span="19">
                <el-input v-model="cluster.desc" size="medium" placeholder="请输入集群描述信息" maxlength="50" show-word-limit style="width: 400px" />
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="5"><div style="height: 16px" /></el-col>
              <el-col :span="19"><div class="note">支持中文、英文、数字，限制50字符</div></el-col>
            </el-row>
          </div>
          <div class="form-container">
            <el-row>
              <el-col :span="5"><div class="center-text"><div class="asterisk">*</div>地域 </div></el-col>
              <el-col :span="19">
                <el-select v-model="cluster.region_id" size="medium" placeholder="请选择" style="width: 400px" :disabled="cluster.provider === ''" @change="afterRegionSelected">
                  <el-option
                    v-for="item in regions"
                    :key="item.RegionId"
                    :label="item.LocalName"
                    :value="item.RegionId"
                  />
                </el-select>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="5"><div style="height: 18px" /></el-col>
              <el-col :span="19"><div class="tips"><i class="el-icon-info" style="color: green; font-size: 16px" />云服务器实例所在的物理位置</div></el-col>
            </el-row>
          </div>
          <div class="form-container">
            <el-row>
              <el-col :span="5"><div class="center-text"><div class="asterisk">*</div>可用区 </div></el-col>
              <el-col :span="19">
                <el-select v-model="cluster.zone_id" :disabled="cluster.region_id === ''" size="medium" style="width: 400px" placeholder="请选择" @change="AfterZoneSelected">
                  <el-option
                    v-for="item in zones"
                    :key="item.ZoneId"
                    :label="item.LocalName"
                    :value="item.ZoneId"
                  />
                </el-select>
                <el-tooltip class="item" effect="light" placement="top">
                  <div slot="content">
                    可用区：同一地域内，电力和网络互相独立的物理区域<br>
                    较高容灾能力：建议在同一地域的不同可用区内创建集群则<br>
                    较低网络时延：建议将云服务器实例创建在相同的可用区内
                  </div>
                  <i class="el-icon-question" style="color: green; font-size: 16px; margin-left: 5px" />
                </el-tooltip>
              </el-col>
            </el-row>
          </div>
        </div>
        <div v-if="step === 1" class="form">
          <div class="form-container">
            <el-row>
              <el-col :span="5"><div class="center-text"><div class="asterisk">*</div>网络类型 </div></el-col>
              <el-col :span="19">
                <el-radio v-model="network_type" label="vpc" style="height:36px; display: flex; align-items: center">专用网络VPC</el-radio>
              </el-col>
            </el-row>
          </div>
          <div class="form-container">
            <el-row>
              <el-col :span="5"><div class="center-text"><div class="asterisk">*</div>VPC </div></el-col>
              <el-col :span="19">
                <el-select v-model="network_config.vpc" :disabled="cluster.region_id === ''" size="medium" style="width: 400px" @change="afterVpcChange">
                  <el-option
                    v-for="item in vpcs"
                    :key="item.VpcId"
                    :value="item.VpcId"
                    :label="item.VpcName"
                  />
                </el-select>
                <el-tooltip class="item" effect="light" placement="top">
                  <div slot="content">
                    专有网络是您专有的云上私有网络，建议使用RFC私网地址<br>作为专有网络的网段如
                    <span v-if="cluster.provider !== 'TencentCloud'">10.0.0.0/8，172.16.0.0/12，<br>192.168.0.0/16</span>
                    <span v-else>10.0.0.0/16, 172.16.0.0/16, <br>192.168.0.0/16</span>
                  </div>
                  <i class="el-icon-question" style="color: green; font-size: 16px; margin-left: 5px" />
                </el-tooltip>
                <el-button size="medium" type="primary" style="margin-left: 10px; width: 126px" :disabled="cluster.region_id === '' || cluster.account_key === ''" @click="addVpc">添加VPC</el-button>
              </el-col>
            </el-row>
          </div>
          <div class="form-container">
            <el-row>
              <el-col :span="5"><div class="center-text"><div class="asterisk">*</div>子网 </div></el-col>
              <el-col :span="19">
                <el-select v-model="network_config.subnet_id" size="medium" :disabled="network_config.vpc === ''" style="width: 400px">
                  <el-option
                    v-for="item in subnets"
                    :key="item.SwitchId"
                    :value="item.SwitchId"
                    :label="item.SwitchName"
                  />
                </el-select>
                <el-tooltip class="item" effect="light" placement="top">
                  <div slot="content">
                    子网的网段必须是其所属VPC网段的真子集且掩码需在16位<br>到29位之间，可提供8~65536个地址
                  </div>
                  <i class="el-icon-question" style="color: green; font-size: 16px; margin-left: 5px" />
                </el-tooltip>
                <el-button size="medium" type="primary" style="margin-left: 10px;" @click="addSubnet">添加网络子网</el-button>
              </el-col>
            </el-row>
          </div>
          <div class="form-container">
            <el-row>
              <el-col :span="5"><div class="center-text"><div class="asterisk">*</div>安全组 </div></el-col>
              <el-col :span="19">
                <el-select v-model="network_config.security_group" size="medium" :disabled="network_config.vpc === ''" style="width: 400px">
                  <el-option
                    v-for="item in securityGroups"
                    :key="item.SecurityGroupId"
                    :value="item.SecurityGroupId"
                    :label="item.SecurityGroupName"
                  />
                </el-select>
                <el-tooltip class="item" effect="light" placement="top">
                  <div slot="content">
                    安全组为虚拟防火墙，用于控制安全组内云服务器的入流量<br>和出流量
                  </div>
                  <i class="el-icon-question" style="color: green; font-size: 16px; margin-left: 5px" />
                </el-tooltip>
                <el-button size="medium" type="primary" style="margin-left: 10px;width: 126px" @click="addSecurityGroup">添加安全组</el-button>
              </el-col>
            </el-row>
          </div>
          <div class="form-container">
            <el-row>
              <el-col :span="5"><div class="center-text">公网访问 </div></el-col>
              <el-col :span="19">
                <div style="height: 36px; display: flex; align-items: center">
                  <el-checkbox v-model="networkSwitch">需要公网访问</el-checkbox>
                  <i class="el-icon-info" style="color: green; margin-left: 10px" /><span style="font-size: 14px;color: #8c939d;">系统将分配IPv4地址，支持公网访问</span>
                </div>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="5"><div style="height: 36px" /></el-col>
              <el-col :span="19">
                <div v-if="networkSwitch" style="display: flex; flex-direction: row; justify-content: left; align-items: center">
                  <div v-if="cluster.provider === 'HuaweiCloud'" style="display: flex; flex-direction: row; align-items: center">
                    <div class="asterisk">*</div><span>IP类型</span>
                    <el-select v-model="network_config.internet_ip_type" size="medium" style="width: 130px; margin-left: 5px">
                      <el-option
                        v-for="item in huaweiIpType"
                        :key="item.value"
                        :value="item.value"
                        :label="item.label"
                      />
                    </el-select>
                  </div>
                  <div class="asterisk" style="margin-left: 20px">*</div><span>付费方式</span>
                  <el-radio-group v-model="network_config.internet_charge_type" size="medium" style="margin-left: 5px">
                    <el-radio-button label="PayByBandwidth">固定带宽</el-radio-button>
                    <el-radio-button label="PayByTraffic">按量付费</el-radio-button>
                  </el-radio-group>
                  <span style="display: inline-block; margin-left: 20px">带宽</span>
                  <el-input-number v-model="network_config.internet_max_bandwidth_out" style="margin-left: 10px;width: 150px" size="medium" :min="1" />
                  M
                </div>
              </el-col>
            </el-row>
          </div>
        </div>
        <div v-if="step === 2" class="form">
          <div class="form-container">
            <el-row>
              <el-col :span="5"><div class="center-text"><div class="asterisk">*</div>付费方式 </div></el-col>
              <el-col :span="19">
                <el-radio-group v-model="charge_config.charge_type">
                  <el-radio-button label="PostPaid">按量付费</el-radio-button>
                  <el-radio-button label="PrePaid">包年包月</el-radio-button>
                </el-radio-group>
                <el-select v-if="charge_config.charge_type === 'PrePaid'" v-model="charge_config.period" style="width: 80px; margin-left: 20px">
                  <el-option v-for="item in chargePeriodOptions" :key="item" :value="item" :label="item" />
                </el-select>
                <el-select v-if="charge_config.charge_type === 'PrePaid'" v-model="charge_config.period_unit" style="margin-left: 5px; width: 80px">
                  <el-option v-for="(u, idx) in chargeUnits[cluster.provider]" :key="idx" :value="u.value" :label="u.label" />
                </el-select>
              </el-col>
            </el-row>
          </div>
          <div class="form-container">
            <el-row>
              <el-col :span="5"><div class="center-text"><div class="asterisk">*</div>算力类型 </div></el-col>
              <el-col :span="19">
                <el-radio-group v-model="instance_type_config.computing_power_type" @change="changeComputedType">
                  <el-radio-button label="CPU">CPU</el-radio-button>
                  <el-radio-button label="GPU">GPU</el-radio-button>
                </el-radio-group>
              </el-col>
            </el-row>
          </div>
          <div class="form-container">
            <el-row>
              <el-col :span="5"><div class="center-text"><div class="asterisk">*</div>机器规格 </div></el-col>
              <el-col :span="19">
                筛选:
                <el-select v-model="instance_type_config.core" size="medium" style="width: 150px" clearable filterable placeholder="请选择CPU" @change="changeCoreOrMemory">
                  <el-option v-for="(c, idx) in filterCores" :key="idx" :value="c" :label="c" />
                </el-select>
                <el-select v-model="instance_type_config.mem" size="medium" style="width: 150px;margin-left: 10px" clearable filterable placeholder="请选择内存" @change="changeCoreOrMemory">
                  <el-option v-for="(m, idx) in filterMems" :key="idx" :value="m" :label="m" />
                </el-select>
              </el-col>
            </el-row>
            <el-row style="margin-top: 10px">
              <el-col :span="5"><div style="height: 36px" /></el-col>
              <el-col :span="19">
                <el-select
                    v-model="cluster.instance_type"
                    size="medium"
                    :disabled="cluster.region_id === '' || cluster.zone_id === ''"
                    placeholder="可输入机器信息匹配"
                    style="width: calc( 25% + 340px )"
                    filterable
                >
                  <el-option
                      v-for="(item, idx) in filterInstanceTypes"
                      :key="idx"
                      :value="item.instance_type"
                      :label="item.instance_type"
                  />
                </el-select>
              </el-col>
            </el-row>
          </div>
          <div class="form-container">
            <el-row>
              <el-col :span="5"><div class="center-text"><div class="asterisk">*</div>操作系统镜像 </div></el-col>
              <el-col :span="19">
                <!--                <el-radio-group v-model="imageType" size="medium">-->
                <!--                  <el-radio-button label="public">云厂商镜像</el-radio-button>-->
                <!--                  <el-radio-button label="private">自定义镜像</el-radio-button>-->
                <!--                </el-radio-group>-->
                <el-select v-model="image_config.type" size="medium" placeholder="请选择镜像类别" style="width: 150px" @change="changeImageType">
                  <el-option v-for="t in imageTypes" :key="t.value" :value="t.value" :label="t.label" />
                </el-select>
                <el-select v-model="image_config.platform" size="medium" placeholder="请选择镜像平台" style="width: 150px; margin-left: 20px" :disabled="image_config.type === ''" clearable filterable @change="changeImagePlatform">
                  <el-option v-for="(i, idx) in Object.keys(imagePlatforms)" :key="idx" :value="i" :label="i" />
                </el-select>
                <el-select v-model="cluster.image" size="medium" style="width: 25%; margin-left: 20px" filterable placeholder="可输入镜像信息匹配" :disabled="image_config.type === ''">
                  <el-option v-for="i in filterImages" :key="i.image_id" :value="i.image_id" :label="i.os_name" />
                </el-select>
              </el-col>
            </el-row>
          </div>
          <div class="form-container">
            <el-row>
              <el-col :span="5"><div class="center-text"><div class="asterisk">*</div>系统盘 </div></el-col>
              <el-col :span="19">
                <div style="display: flex; flex-direction: row; align-items: center;">
                  <el-select v-model="system_disk.category" size="medium" placeholder="请选择系统盘类型" style="width: 200px">
                    <el-option
                      v-for="item in diskTypes"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                  <el-input v-model="system_disk.size" placeholder="磁盘空间20-500" size="medium" style="width: 150px; margin-left: 20px" @blur="checkNum('system', true)" /><span style="display: inline-block; margin-left: 5px">GiB</span>
                </div>
              </el-col>
            </el-row>
          </div>
          <div class="form-container">
            <el-row>
              <el-col :span="5">
                <div class="center-text">
                  数据盘
                </div>
              </el-col>
              <el-col :span="19">
                <div style="display: flex; flex-direction: row; align-items: center; height: 36px">
                  <span style="color: #8c939d">
                    您已选择<span style="display: inline-block; padding: 0 10px; color: red">{{ data_disks.length }}</span>块盘，还可以选择<span style="display: inline-block; padding: 0 10px; color: red">{{ 16 - data_disks.length }}</span>块盘
                  </span>
                  <el-button size="mini" type="primary" style="margin-left: 10px" @click="addItem">+增加数据盘</el-button>
                </div>
              </el-col>
            </el-row>
          </div>
          <div v-for="(item, index) in data_disks" :key="index" class="form-container">
            <el-row>
              <el-col :span="5"><div style="height: 36px; display: flex; justify-content: flex-end; align-items: center; margin-right: 10px"><i class="el-icon-delete" style="cursor:pointer;" @click="deleteItem(index)" /></div></el-col>
              <el-col :span="19">
                <div style="display: flex; flex-direction: row; align-items: center; height: 36px">
                  <el-select v-model="item.category" size="medium" style="width: 200px" placeholder="请选择数据盘类型">
                    <el-option
                      v-for="t in diskTypes"
                      :key="t.value"
                      :label="t.label"
                      :value="t.value"
                    />
                  </el-select>
                  <el-input v-model="item.size" placeholder="磁盘空间20-32768" size="medium" style="width: 150px; margin-left: 20px" @blur="checkNum('data', true)" /><span style="display: inline-block; margin-left: 5px">GiB</span>
                </div>
              </el-col>
            </el-row>
          </div>
        </div>
        <div v-if="step === 3" class="form">
          <div class="form-container">
            <el-row>
              <el-col :span="5"><div class="center-text">初始登录名 </div></el-col>
              <el-col :span="19">
                <div style="height: 36px; display: flex; align-items: center">
                  root
                </div>
              </el-col>
            </el-row>
          </div>
          <div class="form-container">
            <el-row>
              <el-col :span="5"><div class="center-text"><div class="asterisk">*</div>初始密码 </div></el-col>
              <el-col :span="19">
                <el-input v-model="cluster.password" size="medium" style="width: 50%" show-password @blur="checkPassword" />
                <span v-if="passwordIllegal" style="color: #f4516c; font-size: 14px; margin-left: 5px">
                  密码不合规
                </span>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="5"><div style="height: 16px" /></el-col>
              <el-col :span="19">
                <div style="color: #8c939d; font-size: 14px">
                  {{ passwordTips }}
                </div>
              </el-col>
            </el-row>
          </div>
          <div class="form-container">
            <el-row>
              <el-col :span="5"><div class="center-text"><div class="asterisk">*</div>确认密码  </div></el-col>
              <el-col :span="19">
                <el-input v-model="againPassword" size="medium" style="width: 50%" show-password />
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="5"><div style="height: 16px" /></el-col>
              <el-col :span="19">
                <div v-if="againPasswordIllegal" style="color: #f4516c; font-size: 14px">
                  两次密码不一致
                </div>
                <div v-else style="color: #8c939d; font-size: 14px">
                  {{ passwordWarning }}
                </div>
              </el-col>
            </el-row>
          </div>
        </div>
      </div>
      <div class="buttons">
        <div class="step-buttons">
          <el-button v-if="step !== 0" type="primary" style="margin-top: 12px;" size="medium" @click="previous">上一步</el-button>
          <el-button v-if="step !== 3" type="primary" style="margin-top: 12px;" size="medium" :disabled="nextDisabled" @click="next">下一步</el-button>
        </div>
        <div class="submit-buttons">
          <el-button v-if="step===3" type="primary" style="margin-top: 12px;" size="medium" :disabled="submitDisabled" @click="submit">完成</el-button>
          <el-button type="info" style="margin-top: 12px;" size="medium" plain @click="cancel">取消</el-button>
        </div>
      </div>
    </div>
    <el-dialog :visible.sync="vpcAddVisible" title="添加VPC" @close="closeVpc">
      <el-form v-model="vpc" label-width="80px">
        <el-form-item label="VPC名称 ">
          <el-input v-model="vpc.vpc_name" size="medium" />
        </el-form-item>
        <el-form-item label="VPC网段 ">
          <el-select v-model="vpc.cidr_block" size="medium">
            <el-option v-for="item in vpcCidrOptions[cluster.provider]" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <div style="display: flex; justify-content: center">
          <el-button type="primary" size="medium" @click="submitVpc">保存</el-button>
        </div>
      </el-form>
    </el-dialog>
    <el-dialog :visible.sync="subnetAddVisible" title="添加子网" @close="closeSubnet">
      <div>
        <el-row style="padding-bottom: 20px">
          <el-col :span="5">
            <div style="display: flex; flex-direction: row-reverse; align-items: center; padding-right: 30px; height: 36px;font-size: 16px;font-weight: bolder;">
              子网名称
            </div>
          </el-col>
          <el-col :span="19">
            <el-input v-model="subnet.switch_name" size="medium" />
          </el-col>
        </el-row>
        <el-row style="padding-bottom: 20px">
          <el-col :span="5">
            <div style="display: flex; flex-direction: row-reverse; align-items: center; padding-right: 30px; height: 36px;font-size: 16px;font-weight: bolder;">
              所属VPC
            </div>
          </el-col>
          <el-col :span="19">
            <el-select v-model="subnet.vpc_id" size="medium">
              <el-option v-for="item in vpcs" :key="item.VpcId" :value="item.VpcId" :label="item.VpcName" />
            </el-select>
          </el-col>
        </el-row>
        <el-row style="padding-bottom: 20px">
          <el-col :span="5">
            <div style="display: flex; flex-direction: row-reverse; align-items: center; padding-right: 30px; height: 36px;font-size: 16px;font-weight: bolder;">
              网关IP
            </div>
          </el-col>
          <el-col :span="19">
            <el-input v-model="subnet.gateway_ip" size="medium" />
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="5">
            <div style="display: flex; flex-direction: row-reverse; align-items: center; padding-right: 30px; height: 36px;font-size: 16px;font-weight: bolder;">
              交换机网段
            </div>
          </el-col>
          <el-col :span="19">
            <el-input v-model="subnet.cidr_block" size="medium" placeholder="172.16.0.0/24" @blur="checkCidr" />
          </el-col>
        </el-row>
        <el-row style="padding-bottom: 20px">
          <el-col :span="5">
            <div style="height: 36px" />
          </el-col>
          <el-col :span="19">
            <div style="font-size: 14px;color: #8c939d;">
              <i class="el-icon-info" style="color: green" />{{ subnetNote }}
            </div>
          </el-col>
        </el-row>
        <div style="display: flex; justify-content: center">
          <el-button type="primary" size="medium" :disabled="subnetDisabled" @click="submitSubnet">保存</el-button>
        </div>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="securityGroupsAddVisible" title="添加安全组" @close="closeSecurityGroups">
      <el-form v-model="securityGroup" label-width="100px">
        <el-form-item label="安全组名称">
          <el-input v-model="securityGroup.security_group_name" size="medium" />
        </el-form-item>
        <div v-for="(item, idx) in rules" :key="idx" style="margin-bottom: 10px">
          <span style="margin-left: 13px">
            传输层协议
          </span>
          <el-select v-model="item.protocol" size="mini" style="width: 100px">
            <el-option v-for="i in protocols[cluster.provider]" :key="i" :value="i" :label="i" />
          </el-select>
          <span style="margin-left: 20px">端口范围</span>
          <el-input v-model="item.port_from" size="mini" style="width: 70px" /> - <el-input v-model="item.port_to" size="mini" style="width: 70px" />
          <span style="margin-left: 20px">规则方向</span>
          <el-radio-group v-model="item.direction" size="mini">
            <el-radio-button label="ingress" />
            <el-radio-button label="egress" />
          </el-radio-group>
          <el-button v-if="idx === (rules.length - 1)" size="medium" type="text" style="margin-left: 20px" @click="addSecurityRule">增加一条</el-button>
          <el-button v-if="rules.length > 1" size="medium" type="text" style="color: #f4516c; margin-left: 20px" @click="delSecurityRule(idx)">删除</el-button>
        </div>
        <div style="display: flex; justify-content: center">
          <el-button type="primary" size="medium" @click="submitSecurityGroup">保存</el-button>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import _ from 'lodash'
import { justifySubnet, passwordLegitimacy } from '@/utils'
import { cloudProviders, cloudDiskTypes, systemDiskSizes, dataDiskSizes, huaweiIpType, imageTypes, chargeUnits, protocols, chargePeriods, vpcCidrOptions } from '@/config/cloud'
import loadMore from '@/directive/el-select-load-more'
import {
  securityGroupDescribe,
  subnetDescribe,
  vpcDescribe,
  regionList,
  zoneList,
  instanceTypeList,
  vpcCreate,
  subnetCreate,
  securityGroupCreateWithRule,
  imageList,
  cloudAccountList
} from '@/api/cloud'
import { clusterCreate, clusterDescribe, clusterEdit } from '@/api/cluster'
const data_disk_item = {
  category: '',
  size: '',
  performance_level: ''
}

const rule = {
  protocol: '',
  port_from: '',
  port_to: '',
  direction: 'ingress'
}
export default {
  name: 'CreateOrEdit',
  directives: {
    loadMore
  },
  data() {
    return {
      vpcCidrOptions,
      protocols,
      vpcAddVisible: false,
      subnetAddVisible: false,
      securityGroupsAddVisible: false,
      chargeUnits,
      vpc: {
        vpc_name: '',
        cidr_block: ''
      },
      subnet: {
        switch_name: '',
        vpc_id: '',
        cidr_block: '',
        gateway_ip: ''
      },
      securityGroup: {
        security_group_name: ''
      },
      rules: [{
        ...rule
      }],
      step: 0,
      cloudProviders,
      cloudDiskTypes,
      diskTypes: [],
      systemDiskSizes,
      dataDiskSizes,
      huaweiIpType,
      providers: [{
        value: '',
        label: '全部'
      }, ...cloudProviders],
      regions: [],
      zones: [],
      cluster: {
        name: '',
        provider: 'AlibabaCloud',
        account_key: '',
        region_id: '',
        zone_id: '',
        instance_type: '',
        image: '',
        password: ''
      },
      cores: [],
      mems: [],
      pairs: [],
      instance_type_config: {
        core: '',
        mem: '',
        computing_power_type: 'CPU'
      },
      chargePeriods,
      charge_config: {
        charge_type: 'PostPaid',
        period: 1,
        period_unit: 'Month'
      },
      network_type: 'vpc',
      network_config: {
        vpc: '',
        subnet_id: '',
        security_group: '',
        internet_charge_type: 'PayByTraffic',
        internet_max_bandwidth_out: 0,
        internet_ip_type: ''
      },
      networkSwitch: false,
      system_disk: {
        category: '',
        size: '',
        performance_level: ''
      },
      data_disks: [],
      data_disk_item: {
        category: '',
        size: 0,
        performance_level: ''
      },
      vpcs: [],
      subnets: [],
      securityGroups: [],
      instanceTypes: [],
      images: [],
      imagePlatforms: [],
      image_config: {
        id: '',
        name: '',
        type: '',
        platform: ''
      },
      imageTypes,
      accounts: [],
      accountQuery: {
        page_number: 1,
        page_size: 50,
        total: 0
      },
      passwordTips: '8～30 个字符，必须同时包含三项（大写字母、小写字母、数字、 ()`~!@#$%^&*_-+=|{}[]:;\'<>,.?/ 中的特殊符号），其中 Windows 实例不能以斜线号（/）开头',
      passwordIllegal: false,
      againPassword: '',
      passwordWarning: '请牢记您所设置的密码',
      subnetDisabled: true,
      subnetNote: '子网的网段必须是其所属VPC网段的真子集且掩码需在16位到29位之间，可提供 8 ~ 65536 个地址',
      subnetVpc: {},
      cache: {
        AlibabaCloud: {},
        HuaweiCloud: {}
      }
    }
  },
  computed: {
    filterInstanceTypes() {
      return this.instanceTypes.filter((i) => {
        let coreFilter = true
        let memFilter = true
        if (this.instance_type_config.core !== '') {
          coreFilter = i.core === this.instance_type_config.core
        }
        if (this.instance_type_config.mem !== '') {
          memFilter = i.memory === this.instance_type_config.mem
        }
        return coreFilter && memFilter && (this.instance_type_config.computing_power_type === 'GPU' ? i.is_gpu : !i.is_gpu)
               && (i.charge_type === this.charge_config.charge_type || i.charge_type === 'All')
      })
    },
    filterCores() {
      if (this.instance_type_config.mem === '') {
        return this.cores
      }
      return this.pairs.filter(i => i[1] === this.instance_type_config.mem).map(i => i[0])
    },
    filterMems() {
      if (this.instance_type_config.core === '') {
        return this.mems
      }
      return this.pairs.filter(i => i[0] === this.instance_type_config.core).map(i => i[1])
    },
    filterImages() {
      return this.images.filter(i => i.platform === this.image_config.platform)
    },
    chargePeriodOptions() {
      return _.get(this.chargePeriods, `${this.cluster.provider}.${this.charge_config.period_unit}`, [])
    },
    nextDisabled() {
      switch (this.step) {
        case 0:
          return _.isEmpty(this.cluster.name) || _.isEmpty(this.cluster.provider) || _.isEmpty(this.cluster.account_key) || _.isEmpty(this.cluster.zone_id) || _.isEmpty(this.cluster.region_id)
        case 1:
          return _.isEmpty(this.network_config.vpc) || _.isEmpty(this.network_config.subnet_id) || _.isEmpty(this.network_config.security_group)
        case 2:
          return _.isEmpty(this.cluster.image) || _.isEmpty(this.cluster.instance_type) || !this.diskCheck
        default:
      }
      return true
    },
    diskCheck() {
      return this.data_disks.filter(i => i.size === '' || i.category === '').length < 1 && this.system_disk.size !== '' && this.system_disk.category !== ''
    },
    submitDisabled() {
      return this.cluster.password === '' || this.cluster.password !== this.againPassword || this.passwordIllegal
    },
    againPasswordIllegal() {
      return this.cluster.password !== this.againPassword
    }
  },
  async mounted() {
    if (this.$route.name === 'clusterEdit') {
      if (this.$route.params.name === '') {
        this.$message.error('请选择要编辑的集群!')
        this.$router.push({ name: 'clusterList' })
      }
      await this.fetchData()
    }
    await this.loadAccounts()
    await this.loadRegion()
    await this.loadInstanceTypes()
    await this.loadImages()
  },
  methods: {
    previous() {
      if (this.step-- < 0) this.step = 0
    },
    next() {
      if (this.step++ > 3) this.step = 0
    },
    transferTo(name) {
      this.$router.push({ name })
    },
    checkCidr() {
      const vpc = this.vpcs.find(i => i.VpcId === this.subnet.vpc_id)
      if (vpc !== undefined && justifySubnet(vpc.CidrBlock, this.subnet.cidr_block)) {
        this.subnetNote = '子网的网段必须是其所属VPC网段的真子集且掩码需在16位到29位之间，可提供 8 ~ 65536 个地址'
        this.subnetDisabled = false
      } else {
        this.subnetNote = '子网网段不合法'
        this.subnetDisabled = true
      }
    },
    async fetchData() {
      const cluster = await clusterDescribe(this.$route.params.name)
      if (!_.isEmpty(cluster)) {
        this.cluster = { ...cluster }
        this.image_config.type = _.get(cluster, 'image_config.type')
        this.image_config.id = _.get(cluster, 'image_config.id')
        this.image_config.name = _.get(cluster, 'image_config.name')
        this.network_config = _.get(cluster, 'network_config')
        this.networkSwitch = this.network_config.internet_max_bandwidth_out > 0
        this.system_disk = _.get(cluster, 'storage_config.disks.system_disk')
        this.data_disks = _.get(cluster, 'storage_config.disks.data_disk') || []
        this.charge_config = _.get(cluster, 'charge_config')
        await this.loadInstanceTypes()
      }
      this.againPassword = this.cluster.password
    },
    async changeProvider(provider) {
      this.handleCache(provider)
      await this.loadAccounts()
      await this.loadRegion()
      await this.loadInstanceTypes()
      await this.loadImages()
    },
    handleCache(provider) {
      this.cacheProvider(this.cluster.provider)
      if (_.isEmpty(this.cache[provider])) {
        this.cleanCluster()
        this.cluster.provider = provider
        this.cleanNetConfig()
        this.cleanImage()
        this.cleanDisk()
      } else {
        this.loadCache(provider)
      }
    },
    cleanImage() {
      this.image_config = {
        id: '',
        type: '',
        name: ''
      }
    },
    loadCache(provider) {
      const cache = this.cache[provider]
      this.cluster = {
        ...cache.cluster
      }
      this.network_config = {
        ...cache.network_config
      }
      this.networkSwitch = cache.networkSwitch
      this.system_disk = {
        ...cache.system_disk
      }
      this.data_disks = _.cloneDeep(cache.data_disks)
      this.imageType = cache.imageType
    },
    cacheProvider(provider) {
      this.cache[provider] = {
        cluster: {
          ...this.cluster
        },
        network_config: {
          ...this.network_config
        },
        networkSwitch: this.networkSwitch,
        system_disk: { ...this.system_disk },
        data_disks: _.cloneDeep(this.data_disks),
        imageType: this.imageType
      }
    },
    cleanCluster() {
      this.cluster = {
        name: '',
        provider: '',
        account_key: '',
        region_id: '',
        zone_id: '',
        instance_type: '',
        image: '',
        password: ''
      }
      this.instance_type_config.computing_power_type = 'CPU'
    },
    cleanNetConfig() {
      this.network_config = {
        vpc: '',
        subnet_id: '',
        security_group: '',
        internet_charge_type: 'PayByTraffic',
        internet_max_bandwidth_out: 0,
        internet_ip_type: ''
      }
      this.networkSwitch = false
    },
    cleanDisk() {
      this.system_disk = {
        category: '',
        size: '',
        performance_level: ''
      }
      this.data_disks = []
    },
    async loadRegion() {
      this.regions = await regionList(this.cluster.provider)
      this.diskTypes = _.get(this.cloudDiskTypes, this.cluster.provider, [])
      if (this.cluster.region_id === '' && this.regions !== null && this.regions.length > 0) {
        this.cluster.region_id = _.get(this.regions, '0.RegionId', '')
      }
      await this.loadZoneAndVpc()
      await this.loadCloud()
    },
    async loadAccounts() {
      const res = await cloudAccountList('', this.cluster.provider, '', this.accountQuery.page_number, this.accountQuery.page_size)
      this.accounts = _.get(res, 'account_list', [])
      this.accountQuery.total = _.get(res, 'pager.total', 0)
      if (this.accounts.length === 1) {
        this.cluster.account_key = _.get(this.accounts, '0.account', '')
      }
    },
    async loadMore() {
      if (this.accounts.length === this.accountQuery.total) {
        return
      }
      this.accountQuery.page_number++
      const res = await cloudAccountList('', this.cluster.provider, '', this.accountQuery.page_number, this.accountQuery.page_size)
      this.accounts = _.concat(this.accounts, ..._.get(res, 'account_list', []))
    },
    async afterRegionSelected() {
      await this.loadZoneAndVpc()
      this.cluster.zone_id = _.get(this.zones, '0.ZoneId', '')
      await this.loadInstanceTypes()
      this.cleanNetConfig()
    },
    async loadZoneAndVpc() {
      this.zones = await zoneList(this.cluster.provider, this.cluster.region_id)
      if (this.cluster.zone_id === '' && this.zones !== null && this.zones.length > 0) {
        this.cluster.zone_id = _.get(this.zones, '0.ZoneId', '')
      }
      this.vpcs = await vpcDescribe(this.cluster.region_id, this.cluster.provider, this.cluster.account_key)
    },
    changeImageType() {
      this.loadImages()
      this.cluster.image = ''
    },
    async loadImages() {
      const images = await imageList(this.cluster.provider, this.cluster.region_id, this.cluster.instance_type, this.image_config.type)
      if (images !== null) {
        this.images = images.map((i) => {
          if (this.image_config.type === 'private') {
            return {
              ...i,
              os_name: i.image_name
            }
          }
          return {...i}
        })
      }
      this.imagePlatforms = _.groupBy(this.images, 'platform')
      this.loadImagePlatform()
    },
    changeImagePlatform() {
      this.cluster.image = ''
    },
    loadImagePlatform() {
      if (this.cluster.image !== '') {
        const info = this.images.find(i => i.image_id === this.cluster.image)
        this.image_config.platform = info.platform
      }
    },
    async loadCloud() {
      this.securityGroups = await securityGroupDescribe(this.network_config.vpc)
      this.subnets = await subnetDescribe(this.network_config.vpc, this.cluster.zone_id)
    },
    async afterVpcChange() {
      this.network_config.security_group = ''
      this.network_config.subnet_id = ''
      await this.loadCloud()
    },
    async AfterZoneSelected() {
      await this.loadInstanceTypes()
      this.cleanNetConfig()
    },
    changeComputedType() {
      this.cluster.instance_type = ''
      this.instance_type_config.core= ''
      this.instance_type_config.mem = ''
    },
    changeCoreOrMemory() {
      this.cluster.instance_type = ''
    },
    async loadInstanceTypes() {
      if (this.cluster.region_id !== '' && this.cluster.zone_id !== '') {
        const data = await instanceTypeList(this.cluster.provider, this.cluster.region_id, this.cluster.zone_id)
        this.instanceTypes = _.orderBy(data, ['core', 'memory'])
      }
      this.generateInstanceType()
      this.loadCoreAndMem()
    },
    loadCoreAndMem() {
      if (this.cluster.instance_type !== '') {
        const info = this.instanceTypes.find(i => i.instance_type === this.cluster.instance_type)
        this.instance_type_config.core = info.core
        this.instance_type_config.mem = info.memory
        this.instance_type_config.computing_power_type = info.is_gpu ? 'GPU' : 'CPU'
      }
    },
    generateInstanceType() {
      const cores = []
      const mems = []
      const pairs = []
      this.instanceTypes.forEach((i) => {
        cores.push(i.core)
        mems.push(i.memory)
        pairs.push([i.core, i.memory])
      })
      this.cores = _.uniq(cores)
      this.mems = _.uniq(mems)
      this.pairs = _.uniqWith(pairs, _.isEqual)
    },
    async submit() {
      let network_config
      if (this.networkSwitch) {
        network_config = {
          ...this.network_config
        }
      } else {
        network_config = {
          vpc: this.network_config.vpc,
          subnet_id: this.network_config.subnet_id,
          security_group: this.network_config.security_group
        }
      }
      if (this.cluster.provider === 'HuaweiCloud') {
        network_config.internet_ip_type = this.network_config.internet_ip_type
      }
      let charge_config
      if (this.charge_config.charge_type === 'PrePaid') {
        charge_config = { ...this.charge_config }
      } else {
        charge_config = {
          charge_type: this.charge_config.charge_type
        }
      }
      const image = this.images.find(i => i.image_id === this.cluster.image)
      const image_config = {
        type: this.image_config.type,
        id: image.image_id,
        name: image.os_name
      }
      const disks = {}
      if (this.system_disk.size !== '') {
        disks['system_disk'] = {
          ...this.system_disk,
          size: +this.system_disk.size
        }
      }
      if (this.data_disks.filter(i => i.size === '').length < 1) {
        disks['data_disk'] = this.data_disks.map(i => ({
          ...i,
          size: +i.size
        }))
      }
      const data = {
        ...this.cluster,
        network_config,
        image_config,
        storage_config: {
          disks
        },
        charge_config
      }
      let res
      let text = '创建成功'
      if (this.$route.name === 'clusterCreate') {
        res = await clusterCreate(data)
      } else if (this.$route.name === 'clusterEdit') {
        res = await clusterEdit(data)
        text = '编辑成功'
      } else {
        this.$message.error('未知路由')
      }
      if (res.data.code === 200) {
        this.$message.success(text)
        this.createDialogVisible = false
        this.$router.push({ name: 'clusterList' })
      } else {
        if (/cluster_cluster_name_uindex/.test(res.data.msg)) {
          this.$message.error('集群名已占用')
        } else {
          this.$message.error(res.data.msg)
        }
      }
    },
    cancel() {
      this.$router.push({ name: 'clusterList' })
    },
    deleteItem(idx) {
      this.data_disks = this.data_disks.filter((v, i) => i !== idx)
    },
    addItem() {
      this.data_disks.push({ ...data_disk_item })
    },
    addVpc() {
      this.vpcAddVisible = true
    },
    closeVpc() {
      this.vpc = {
        vpc_name: '',
        cidr_block: ''
      }
    },
    addSubnet() {
      this.subnetAddVisible = true
    },
    closeSubnet() {
      this.subnet = {
        switch_name: '',
        vpc_id: '',
        cidr_block: ''
      }
    },
    checkNum(type, message) {
      let alert = false
      switch (type) {
        case 'system':
          if (isNaN(+this.system_disk.size) || +this.system_disk.size < 1) {
            this.system_disk.size = ''
            if (message) {
              this.$message.error('系统盘大小不合规!')
            }
          }
          return false
        case 'data':
          this.data_disks.forEach((i) => {
            if (isNaN(+i.size) || +i.size < 1) {
              i.size = ''
              alert = true
            }
          })
          if (alert && message) {
            this.$message.error('数据盘大小不合规!')
          }
          return false
        default:
      }
      return true
    },
    addSecurityGroup() {
      this.securityGroupsAddVisible = true
    },
    closeSecurityGroups() {
      this.securityGroup = {
        security_group_name: ''
      }
      this.rules = [{
        ...rule
      }]
    },
    async submitVpc() {
      const res = await vpcCreate(this.cluster.provider, this.cluster.region_id, this.vpc.cidr_block, this.vpc.vpc_name, this.cluster.account_key)
      if (res.code === 200) {
        this.$message.success('创建成功!')
      }
      await this.loadZoneAndVpc()
      this.vpcAddVisible = false
    },
    async submitSubnet() {
      const res = await subnetCreate(this.cluster.provider, this.cluster.zone_id, this.subnet.cidr_block, this.subnet.vpc_id, this.subnet.switch_name, this.subnet.gateway_ip)
      if (res.code === 200) {
        this.$message.success('创建成功!')
      }
      await this.loadCloud()
      this.subnetAddVisible = false
    },
    addSecurityRule() {
      this.rules.push({ ... rule })
    },
    delSecurityRule(idx) {
      this.rules = this.rules.filter((v, i) => i !== idx)
    },
    async submitSecurityGroup() {
      const res = await securityGroupCreateWithRule(this.cluster.region_id, this.network_config.vpc, this.securityGroup.security_group_name, this.rules.map(i => ({
        protocol: i.protocol,
        port_from: +i.port_from,
        port_to: +i.port_to,
        direction: i.direction
      })))
      if (res.code === 200) {
        this.$message.success('创建成功!')
      }
      await this.loadCloud()
      this.securityGroupsAddVisible = false
    },
    checkPassword() {
      this.passwordIllegal = !passwordLegitimacy(this.cluster.password)
    }
  }
}
</script>

<style lang="less" scoped>
.cluster-container {
  position: absolute;
  width: 100%;
  height: 100%;
  padding: 10px 10px 0 10px;
  background-color: rgb(240, 242, 245);
  .step-container {
    box-shadow: 4px 4px 5px rgba(0, 0, 0, .08);
    background-color: #ffffff;
    padding: 20px;
  }
  .buttons {
    display: grid;
    .step-buttons {
      grid-column-start: 1;
      grid-row-start: 1;
      justify-self:center;
    }
    .submit-buttons {
      grid-column-start: 1;
      grid-row-start: 1;
      justify-self: right;
    }
  }
}
.form {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  .form-container {
    margin-bottom: 20px;
    display: flex;
    flex-direction: column;
    width: 90%;
    .tips {
      margin-top: 5px;
      color: #8c939d;
      font-size: 14px;
    }
  }
  .center-text {
    font-size: 16px;
    height: 36px;
    display: flex;
    padding-right: 30px;
    justify-content: flex-end;
    align-items: center;
  }
  .asterisk {
    display: flex;
    align-items: center;
    padding-right: 5px;
    color: #f4516c;
  }
  .note {
    padding-top: 5px;
    color: rgb(170, 170,170);
  }
  .buttons {
    display: flex;
    flex-direction: row;
    justify-content:flex-end;
  }
}
</style>
