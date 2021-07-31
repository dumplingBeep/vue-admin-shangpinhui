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

## 封装公共组件

> ### CategorySelector 分类选择器
>
> - 使用*element-ui*库中组件
>   - 容器*el-card*
>   - 内容层*el-form* + *el-form-item*
>   - 选择器*el-select*
> - 三级分类联动
>   - 父组件以*props*方式传递参数
>     - *sync*修饰符传递的*category3Id*: 在组件内使其父组件的*category3Id*的值保持一致
>     - 接收传递的函数*setList*: 用于更新父组件将要渲染的列表数据
>   - 定义API
>     - 一级分类
>     - 二级分类，需要一级分类id
>     - 三级分类，需要二级分类id
>   - 组件挂载，请求一级分类数据
>   - 监视一级分类选择器
>     - 发送改变请求二级分类数据
>     - 初始化数据
>       - 清空二级分类id
>       - 清空三级分类列表
>       - 清空三级分类列表
>   - 监视二级分类选择器
>     - 发送改变请求三级分类数据
>     - 初始化数据
>       - 清空三级分类id
>   - 监视三级分类选择器
>     - 调用*setList*传入category3Id
>     - *$emit*更新父组件传入的*category3Id*
>
> ### TipButton 提示按钮
>
> - 外层*el-tooltip*
>   - 接收*props*传递*tipTitle*设置按钮提示标题
> - 包裹*el-button*
>   - 以*v-bind="$attrs"*将其他参数设置到*el-button*
>   - 以*v-on="$listeners"*将所有(不含 *.native* 修饰器的)*v-on* 事件绑定在*el-button*

## SPU管理

> ### SPU首页
>
> #### 静态搭建
>
> - 公共组件 *CategorySelector* 分类选择器
>   - 使用*sync*修饰符传递*category3Id*: 在组件内使其父组件的*category3Id*的值保持一致
>   - 传递函数*setList*: 用于更新父组件将要渲染的列表数据
> - *el-table* 展示SPU列表
>   - 公共组件 *TipButton* 操作按钮
> - *el-pagination* 分页器
>
> #### API
>
> - 分页查询*SPU*列表，所需参数*page*、*limit*
>