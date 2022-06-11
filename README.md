# BlogNode
![GitHub commit activity](https://img.shields.io/github/commit-activity/y/BATTLEHAWK00/BlogNode-dev)  
A blog written in TypeScript using Next.js  
BlogNode 是一个使用 TypeScript + Next.js 搭建的博客项目，具有迅速、轻量化、易于部署、易于扩展的特点。  
项目目前处于初期阶段，如果对你有用，请务必点个 star 哦~  
Bugs 和功能建议请在 Issues 提出。

# 预览 / Preview
![image](https://user-images.githubusercontent.com/45313304/172744462-2a94e483-dead-4d18-94ff-1af363838f20.png)

# 文档 / Documentation
待定...

# 部署 / Deploy
> 目前本项目未推出正式版，请勿用于正式生产环境！  
```shell
# 生产环境运行
yarn start
# 开发环境运行
yarn start:dev
# 开发环境运行（输出debug日志）
yarn start:debug
# 开发环境运行（输出trace日志）
yarn start:trace
# 生产环境构建
yarn build
# 生产环境构建（核心）
yarn build:core
# 生产环境构建（默认主题）
yarn build:theme
```

# Todo List
- [x] static 中间件
- [ ] 路由平滑切换
- [ ] userDao, userService 编写
- [ ] 后台登录注册功能
- [ ] 搭建项目文档
- [ ] postSchema, postDao, postService 编写
- [ ] config 结构编写
- [ ] 后台文章发布功能
- [ ] 主题热重载
- [ ] 提供SSR中间件的接口（Next.js/Nuxt.js）
- [ ] 博客首页
- [ ] 任务池与 mongoose 共用 connection
- [ ] 本地文件存取 API
- [ ] 实现 minio 对象存储
- [ ] 完整的 SEO 支持
- [ ] Sitemap 支持
- [ ] 搜索功能
- [ ] 本地化支持
- [ ] Redis 支持
- [ ] JWT 鉴权

# 贡献 / Contribute
目前项目处于初始阶段，你可以根据 Todo List 上的内容提交 PR，对于 GitHub 新手来说，这是很好的机会哟~  
当项目可用于正式生产环境时，我会将个人博客迁移到此项目

# 支持 / Support
* Email: [battlehawk0_0@163.com](mailto:battlehawk0_0@163.com)
