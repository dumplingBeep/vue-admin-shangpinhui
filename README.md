# vue-admin-shangpinhui

English | [简体中文](./README-zh.md)

> A minimal vue admin template with Element UI & axios & iconfont & permission control & lint

**Live demo:** http://panjiachen.github.io/vue-admin-template

**The current version is `v4.0+` build on `vue-cli`. If you want to use the old version , you can switch branch to [tag/3.11.0](https://github.com/PanJiaChen/vue-admin-template/tree/tag/3.11.0), it does not rely on `vue-cli`**

## Build Setup

```bash
# clone the project
git clone https://github.com/dumplingBeep/vue-admin-shangpinhui.git

# enter the project directory
cd vue-admin-template

# install dependency
npm install

# develop
npm run dev
```

This will automatically open http://localhost:9528

## Build

```bash
# build for test environment
npm run build:stage

# build for production environment
npm run build:prod
```

## Advanced

```bash
# preview the release environment effect
npm run preview

# preview the release environment effect + static resource analysis
npm run preview -- --report

# code format check
npm run lint

# code format check and auto fix
npm run lint -- --fix
```

## 准备工作

> - 清除不需要的文件
> - 配置服务器代理
> - 配置请求过滤器

## 登录

> ### 定义user相关API
>
> - 登录
>   - 定义API，请求服务器校验
>   - 登录成功，跳转首页
>     - 获得响应结果
>     - cookie存储响应体中的*token*
>     - 在过滤器请求头中携带此*token*
>   - 登录失败，弹出提示框
>   - 再次访问登录页时校验是否存在上次登录保存的凭证
>     - 有则跳转首页
>     - 没有继续访问登录页
>
> - 退出登录
>   - 定义API，请求服务器，通知退出登录
>   - 退出成功，跳转登录页
>     - 清除cookie存储的*token*
>
> - 用户信息
>   - 定义API，请求服务器，获取用户信息
>
> ### 前端表单校验
>
> element-ui库自定义表单校验
>
> - 用户名
>   - 限制用户名只能是*admin*或者*editor*
>
> - 密码
>   - 限制密码长度至少6位

## 配置路由

> ### 注册路由
>
> 注册路由 *product* 商品管理
> 注册品牌管理下四个子路由
>
> - *product* 商品管理
>   - *Brand* 品牌管理
>   - *Attr* 属性管理
>   - *Sku* Sku管理
>   - *Spu* Spu管理
