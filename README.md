![image](https://user-images.githubusercontent.com/94337797/145354238-42473c28-a928-4ec5-84fb-7204db088283.png)
=====

[![Go Report Card](https://goreportcard.com/badge/github.com/galaxy-future/BridgX)](https://goreportcard.com/report/github.com/galaxy-future/BridgX) &nbsp;
[![CodeFactor](https://www.codefactor.io/repository/github/galaxy-future/bridgx/badge)](https://www.codefactor.io/repository/github/galaxy-future/bridgx)



Language
----

English | [中文](https://github.com/galaxy-future/comandx/blob/main/docs/CH-README.md)

Introduction
-----

ComandX is an observable interface-based O&M solution. It is a web-based visual presentation interface for BridgX and SchedulX, providing a simple and easy-to-use operating experience.
It has the following key features:
1. cluster creation and management;
2. scaling up and scaling down tasks;
3. K8s cluster creation and management;
4. service deployment and orchestration;
5. cloud server management;
6. cloud account management;
7. fees management;
8. Dashboard global display.



Contact Us
----

[Weibo](https://weibo.com/galaxyfuture) | [Zhihu](https://www.zhihu.com/org/xing-yi-wei-lai) | [Bilibili](https://space.bilibili.com/2057006251)
| [WeChat Official Account](https://github.com/galaxy-future/comandx/blob/main/docs/resource/wechat_official_account.md)
| [WeCom Communication Group](https://github.com/galaxy-future/comandx/blob/main/docs/resource/wechat.md)

Getting Started Guide
----

#### 1. Environmental Dependence

- [Install BridgX](https://github.com/galaxy-future/bridgx/blob/dev/docs/EN-README.md);
- [Install SchedulX](https://github.com/galaxy-future/bridgx/blob/dev/docs/EN-README.md)

#### 2. Installation and Deployment

* (1)Download source code

  - Front-end work：
  > git clone https://github.com/galaxy-future/comandx.git

* (2)macOS Deloyment
  - For front-end deployment, run the following command in the ComandX directory:
    > make docker-run-mac
   
  - When the system is running, type http://127.0.0.1 into your browser to see the management console interface, with the default username root and password 123456.

* (3)Linux Installation and Deployment

  - The following steps should be performed with the root user or a user with sudo privileges sudo su - after switching to the root user.
  - 1）For users
    - For front-end deployment, run the following command in the ComandX directory:
      > make docker-run-linux
    -	When the system is running, type http://127.0.0.1 into your browser to see the management console interface, with the default username root and password 123456.

  - 2）For develops
    - Front-end deployment
      - If you are deploying on the same machine as the back-end, you can go directly to the next step; if the back-end is deployed separately, go to `cd conf` and modify the corresponding configuration ip and port information.
      - Go to the ComandX directory, and then use the following command
        > docker-compose up -d //Start BridgX service <br>
        > docker-compose down //Stop BridgX service  <br>

      - When the system is running, type http://127.0.0.1 into your browser to see the management console interface, with the default username root and password 123456.
#### 3.Quick Start  

The [Quick Start Guide](https://github.com/galaxy-future/comandx/blob/main/docs/en-getting-started.md) allows you to master the basic cluster creation, rapid scale-up and scale-down, K8s clustering, and other operational processes.

#### 4.User Manual  
The [User Manual](https://github.com/galaxy-future/comandx/blob/main/docs/en-user-manual.md) allows users to get a complete overview of BridgX 's features and to quickly identify which features they are interested in using.

Video Tutorial
------
[ComandX Installation](https://www.bilibili.com/video/BV1n34y167o8/) <br>
[Adding The Cloud Vendor Account](https://www.bilibili.com/video/BV1Jr4y1S7q4/)  <br>
[Create Cluster](https://www.bilibili.com/video/BV1Wb4y1v7jw/)   <br>
[Manual Scaling](https://www.bilibili.com/video/BV1bm4y197QD/)  <br>
[K8s Cluster Creation and Pod cutting](https://www.bilibili.com/video/BV1FY411p7rE/) <br>


Technical Articles
------
[《How does cloud-native technology migrate TB data per minute?》](https://zhuanlan.zhihu.com/p/442746588)<br>
[《Best practices for enterprise migration to K8s》](https://zhuanlan.zhihu.com/p/445131885) <br>
[《Top ten methods of cloud-native cost optimization 》](https://zhuanlan.zhihu.com/p/448405809)<br>

Code of Conduct
------
[Contributor Convention](https://github.com/galaxy-future/comandx/blob/main/CODE_OF_CONDUCT)

Authorization
-----

ComandX is licensed under the [Apache License 2.0](https://github.com/galaxy-future/comandx/blob/main/LICENSE).


