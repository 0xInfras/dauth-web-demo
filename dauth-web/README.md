### 项目介绍
DAuth Web版SDK

主要功能

### 项目目录
主要功能
- [x] 注册新账号
- [x] 登录账号
- [x] 退出账号
- [x] 签名
- [x] 交易

```
├── src                                   # 代码逻辑
│   ├── index.ts                          # 代码入口
│   ├── type.d.ts                         # 类型声明
│    
├── lib                                   # 打包后的文件
│   │                  
│   ├── index.d.ts                        # JS文件
│   ├── index.js                          # 类型声明文件
│          
├── package.json                          # 用户配置文件     
│                
```

### 项目开发
#### 本地引入
1.将dauth-web文件夹放置于根目录，与package.json同级
2.更新package.json文件
```
"devDependencies": {
  "dauth-web": "file:dauth-web",
}
```
3.运行命令
```
npm install dauth-web
```
4.项目引入开发
```
import WalletManager from 'dauth-web'
```
#### 开发命令
##### 打包应用
```
npm run prepare
```

##### 语法检测
```
npm run preversion
```

##### 发版前检测
```
npm run prepublishOnly
```

##### 提交commit前-检测
npm run version

##### 提交commit后-添加tag
npm run postversion

##### 发布版本
npm publish

##### 升级版本
npm version patch

[参考链接](https://juejin.cn/post/6844903892119977998#comment)








