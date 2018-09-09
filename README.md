# 预约系统node中间层

> 为了完成前后端分离工作，支持IT侠各个语言的开发者，使用一个node中间层给前端提供服务、完成权限验证以及连接后端服务。

## 用途

1. 为前端提供REST接口
2. 权限验证
3. 通过配置，使用反向代理连接后端服务

## 启动步骤

1. git clone https://github.com/NJU-itxia/back-end-controller.git (当然也可以用ssh)
2. cd back-end-controller
3. npm install
4. 联系 @Tipwheal(qq:674714966) 获取config文件内容 或自行搭建mysql环境并修改config/config.js
5. npm start (默认监听3000端口)

## 前置条件

1. git
2. node, npm